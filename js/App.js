import { StorageManager } from './services/StorageManager.js';
import { GeminiClient } from './services/GeminiClient.js';
import { ThemeManager } from './services/ThemeManager.js';
import { Router } from './services/Router.js';

import { ChatController } from './controllers/ChatController.js';
import { JournalController } from './controllers/JournalController.js';

import { ChatView } from './views/ChatView.js';
import { JournalView } from './views/JournalView.js';
import { InsightsView } from './views/InsightsView.js';

import { Header } from './components/organisms/Header.js';
import { Navigation } from './components/organisms/Navigation.js';
import { SettingsModal } from './components/organisms/SettingsModal.js';
import { EmotionModal } from './components/organisms/EmotionModal.js';

/**
 * Main Application Class
 * Acts as the Coordinator/Root
 */
export class App {
    constructor() {
        // 1. Initialize Services
        this.storage = new StorageManager();
        this.gemini = new GeminiClient(this.storage.getSetting('gemini_api_key'));
        this.themeManager = new ThemeManager(this.storage);
        this.router = new Router((viewId) => this.handleViewChange(viewId));

        // 2. Initialize Views
        this.chatView = new ChatView((text) => this.chatController.handleSendMessage(text));

        this.journalView = new JournalView({
            onSearch: (query) => this.journalController.filterJournal(query),
            onClear: () => this.journalController.clearSearch(),
            onEntryUpdate: (entry) => this.journalController.updateEntry(entry),
            onEntryDelete: (id) => this.journalController.deleteEntry(id),
            onEntryExport: (entry) => this.journalController.exportEntry(entry),
            getFilteredEntries: () => this.journalController.filteredEntries
        });

        this.insightsView = new InsightsView(() => this.storage.getEntries());

        // 3. Initialize Controllers
        this.chatController = new ChatController(
            this.chatView,
            this.gemini,
            this.storage,
            this.themeManager,
            () => this.router.navigateTo('view-journal') // On journal entry created
        );

        this.journalController = new JournalController(
            this.journalView,
            this.storage
        );

        // 4. Initialize Global UI Components
        this.settingsModal = this.createSettingsModal();
        this.emotionModal = this.createEmotionModal();

        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    async initializeApp() {
        this.renderApp();
        this.checkSetup();

        // Initial data load
        this.chatController.initialize();
        await this.journalController.loadEntries();

        // Setup global event listeners
        window.addEventListener('request-export-all', () => this.journalController.exportAll());
        window.addEventListener('request-import', (e) => {
            this.journalController.importEntries(e.detail.file);
            this.settingsModal.close();
        });
    }

    /**
     * Create Settings Modal
     */
    createSettingsModal() {
        return SettingsModal.create({
            onSave: ({ apiKey, model }) => {
                this.storage.setSetting('gemini_api_key', apiKey);
                this.storage.setSetting('gemini_model', model);
                this.gemini.setApiKey(apiKey);
                this.settingsModal.close();
            },
            onClose: () => this.settingsModal.close(),
            onFetchModels: async (apiKey) => {
                const tempClient = new GeminiClient(apiKey);
                return await tempClient.listAvailableModels();
            },
            initialValues: {
                apiKey: this.storage.getSetting('gemini_api_key') || '',
                model: this.storage.getSetting('gemini_model') || ''
            }
        });
    }

    /**
     * Create Emotion Modal
     */
    createEmotionModal() {
        return EmotionModal.create((mood) => {
            this.emotionModal.close();
            this.chatController.endConversation(mood);
        });
    }

    /**
     * Render the app structure
     */
    renderApp() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        // Header
        this.renderHeader();
        app.appendChild(this.header);

        // Main Content
        const main = document.createElement('main');

        // Append Views
        main.appendChild(this.chatView.render());
        main.appendChild(this.journalView.render());
        main.appendChild(this.insightsView.render());

        app.appendChild(main);

        // Chat Controls (Input area)
        app.appendChild(this.chatView.getControls());

        // Navigation
        this.navigation = Navigation.create(
            (target) => this.router.navigateTo(target),
            'view-chat'
        );
        app.appendChild(this.navigation);

        // Modals
        app.appendChild(this.settingsModal.element);
        app.appendChild(this.emotionModal.element);
        // Note: JournalView manages its own EntryDetailModal, but we need to ensure it's in the DOM
        // The JournalView.render() doesn't append the modal to itself to avoid z-index issues relative to other views?
        // Actually, modals usually sit at the root.
        // Let's append the JournalView's modal here.
        app.appendChild(this.journalView.getModalElement());
    }

    /**
     * Render or Re-render Header
     */
    renderHeader() {
        const newHeader = Header.create({
            onSettingsClick: () => this.settingsModal.open(),
            onModeChange: (e) => {
                const mode = e.target.value;
                this.themeManager.applyMode(mode);
                this.chatController.setGreeting();
            },
            onEndConversation: () => this.emotionModal.open(),
            onThemeToggle: () => {
                this.themeManager.toggleTheme();
                this.renderHeader(); // Re-render to update icon
            },
            currentMode: this.themeManager.getMode(),
            currentTheme: this.themeManager.getTheme()
        });

        if (this.header && this.header.parentNode) {
            this.header.replaceWith(newHeader);
        }
        this.header = newHeader;
    }

    /**
     * Handle View Changes
     */
    handleViewChange(viewId) {
        const chatControls = document.getElementById('chat-controls');

        if (viewId === 'view-chat') {
            chatControls.classList.remove('hidden');
        } else {
            chatControls.classList.add('hidden');
            if (viewId === 'view-journal') {
                this.journalController.loadEntries();
                this.journalController.clearSearch();
                // We need to clear the search input in the view manually or via controller
                // The controller.clearSearch() does it logic-wise, but we might need to reset UI
                // The JournalView re-renders or we can just access the input if needed.
                // For now, JournalController.clearSearch() reloads entries.
                // We might want to reset the input value in the DOM.
                const searchInput = document.getElementById('journal-search');
                if (searchInput) searchInput.value = '';
            } else if (viewId === 'view-insights') {
                this.insightsView.refresh();
            }
        }
    }

    /**
     * Check if setup is needed
     */
    checkSetup() {
        if (!this.storage.getSetting('gemini_api_key')) {
            setTimeout(() => {
                this.settingsModal.open();
            }, 500);
        }
    }
}