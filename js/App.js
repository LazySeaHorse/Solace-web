import { StorageManager } from './services/StorageManager.js';
import { GeminiClient } from './services/GeminiClient.js';
import { Header } from './components/organisms/Header.js';
import { Navigation } from './components/organisms/Navigation.js';
import { ChatContainer } from './components/organisms/ChatContainer.js';
import { SettingsModal } from './components/organisms/SettingsModal.js';
import { EmotionModal } from './components/organisms/EmotionModal.js';
import { FAB } from './components/organisms/FAB.js';
import { InputArea } from './components/molecules/InputArea.js';
import { JournalEntry } from './components/molecules/JournalEntry.js';

/**
 * Main Application Class
 */
export class App {
    constructor() {
        this.storage = new StorageManager();
        this.gemini = new GeminiClient(this.storage.getSetting('gemini_api_key'));
        this.chatHistory = [];
        this.currentMood = null;
        this.mode = 'default';

        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    async initializeApp() {
        // Create UI components
        this.createComponents();

        // Render initial UI
        this.renderApp();

        // Check setup and load data
        this.checkSetup();
        await this.loadJournal();
        this.setGreeting();
    }

    /**
     * Create all UI components
     */
    createComponents() {
        // Header
        this.header = Header.create({
            onSettingsClick: () => this.settingsModal.open(),
            onModeChange: (e) => {
                this.mode = e.target.value;
                this.applyTheme(this.mode);
                if (this.chatHistory.length === 0) this.setGreeting();
            },
            currentMode: this.mode
        });

        // Navigation
        this.navigation = Navigation.create(
            (target) => this.switchView(target),
            'view-chat'
        );

        // Chat components
        this.chatContainer = ChatContainer.create();
        this.suggestionsContainer = ChatContainer.createSuggestionsContainer(
            (text) => this.handleSendMessage(text)
        );
        this.inputArea = InputArea.create(() => this.handleSendMessage());

        // Modals
        this.settingsModal = SettingsModal.create({
            onSave: ({ apiKey, model }) => {
                this.storage.setSetting('gemini_api_key', apiKey);
                this.storage.setSetting('gemini_model', model);
                this.gemini.setApiKey(apiKey);
                this.settingsModal.close();
            },
            onClose: () => this.settingsModal.close(),
            onFetchModels: async (apiKey) => {
                // Create a temporary client to fetch models
                const tempClient = new GeminiClient(apiKey);
                return await tempClient.listAvailableModels();
            },
            initialValues: {
                apiKey: this.storage.getSetting('gemini_api_key') || '',
                model: this.storage.getSetting('gemini_model') || ''
            }
        });

        this.emotionModal = EmotionModal.create((mood) => {
            this.currentMood = mood;
            this.saveSessionToJournal();
        });

        // FAB
        this.fab = FAB.create(() => this.emotionModal.open());
    }

    /**
     * Render the app to the DOM
     */
    renderApp() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        // Append header
        app.appendChild(this.header);

        // Create main content area
        const main = document.createElement('main');

        // Chat view
        const chatView = document.createElement('div');
        chatView.id = 'view-chat';
        chatView.className = 'view active';
        chatView.appendChild(this.chatContainer.element);

        const spacer = document.createElement('div');
        spacer.style.height = '140px';
        chatView.appendChild(spacer);

        // Journal view
        const journalView = document.createElement('div');
        journalView.id = 'view-journal';
        journalView.className = 'view';

        const journalTitle = document.createElement('h2');
        journalTitle.textContent = 'Journal';
        journalTitle.style.maxWidth = '640px';
        journalTitle.style.margin = '0 auto 20px';

        const journalList = document.createElement('div');
        journalList.id = 'journal-list';

        journalView.appendChild(journalTitle);
        journalView.appendChild(journalList);

        main.appendChild(chatView);
        main.appendChild(journalView);
        app.appendChild(main);

        // Chat controls
        const chatControls = document.createElement('div');
        chatControls.className = 'chat-controls';
        chatControls.id = 'chat-controls';
        chatControls.appendChild(this.suggestionsContainer.element);
        chatControls.appendChild(this.inputArea);
        app.appendChild(chatControls);

        // Navigation
        app.appendChild(this.navigation);

        // Modals
        app.appendChild(this.settingsModal.element);
        app.appendChild(this.emotionModal.element);

        // FAB
        app.appendChild(this.fab.element);
    }

    /**
     * Apply theme based on mode
     * @param {string} mode - Mode name
     */
    applyTheme(mode) {
        const root = document.documentElement;
        if (mode === 'gratitude') {
            root.style.setProperty('--primary-color', 'var(--mode-gratitude)');
        } else if (mode === 'reflection') {
            root.style.setProperty('--primary-color', 'var(--mode-reflection)');
        } else {
            root.style.setProperty('--primary-color', '#7c3aed');
        }
    }

    /**
     * Set greeting message based on time and mode
     */
    setGreeting() {
        const hour = new Date().getHours();
        let greeting = "Hi there.";

        if (hour < 12) greeting = "Good morning.";
        else if (hour < 18) greeting = "Good afternoon.";
        else greeting = "Good evening.";

        if (this.mode === 'gratitude') greeting += " What are you grateful for today?";
        else if (this.mode === 'reflection') greeting += " What's on your mind?";
        else greeting += " How was your day?";

        this.chatContainer.clear();
        this.chatContainer.addMessage(greeting, 'ai');
        this.chatHistory = [{ role: 'ai', text: greeting }];
    }

    /**
     * Switch between views
     * @param {string} viewId - View ID to switch to
     */
    switchView(viewId) {
        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        document.getElementById(viewId).classList.add('active');
        document.querySelector(`.nav-item[data-target="${viewId}"]`).classList.add('active');

        const chatControls = document.getElementById('chat-controls');

        if (viewId === 'view-chat') {
            chatControls.classList.remove('hidden');
            this.fab.show();
        } else {
            chatControls.classList.add('hidden');
            this.fab.hide();
            if (viewId === 'view-journal') this.loadJournal();
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

    /**
     * Handle sending a message
     * @param {string} textOverride - Optional text to send (for chips)
     */
    async handleSendMessage(textOverride = null) {
        const input = document.getElementById('chat-input');
        const text = textOverride || input.value.trim();
        if (!text) return;

        this.suggestionsContainer.clear();
        this.chatContainer.addMessage(text, 'user');
        this.chatHistory.push({ role: 'user', text });
        input.value = '';

        try {
            const model = this.storage.getSetting('gemini_model') || 'gemini-flash-latest';
            const loadingId = this.chatContainer.addTypingIndicator();

            let response = await this.gemini.generateContent(model, text, this.chatHistory);

            let suggestions = [];
            if (response.includes('|')) {
                const parts = response.split('|');
                if (parts.length >= 4) {
                    response = parts.slice(0, parts.length - 3).join('|').trim();
                    suggestions = parts.slice(-3).map(s => s.trim()).filter(s => s);
                }
            }

            this.chatContainer.removeElement(loadingId);
            this.chatContainer.addMessage(response, 'ai');
            this.chatHistory.push({ role: 'ai', text: response });

            this.suggestionsContainer.setSuggestions(suggestions);

        } catch (error) {
            this.chatContainer.addMessage("Error: " + error.message, 'ai');
        }
    }

    /**
     * Save current chat session to journal
     */
    async saveSessionToJournal() {
        if (this.chatHistory.length <= 1) return;

        // Close emotion modal
        this.emotionModal.close();

        // Show loading indicator in chat
        const loadingId = this.chatContainer.addTypingIndicator();
        this.chatContainer.addMessage('Generating your journal entry...', 'ai');

        try {
            const model = this.storage.getSetting('gemini_model') || 'gemini-flash-latest';

            // Generate AI summary
            const summary = await this.gemini.generateJournalSummary(
                this.chatHistory,
                this.currentMood,
                model
            );

            // Remove loading indicator
            this.chatContainer.removeElement(loadingId);

            // Save entry with AI-generated summary (no raw content)
            const entry = {
                date: new Date().toISOString(),
                summary: summary,
                mood: this.currentMood
            };

            await this.storage.addEntry(entry);

            // Clear chat and show success
            this.chatHistory = [];
            this.setGreeting();
            this.switchView('view-journal');

        } catch (error) {
            // Remove loading indicator
            this.chatContainer.removeElement(loadingId);

            // Show error message and ask for confirmation
            const errorMsg = `Failed to generate journal summary: ${error.message}\n\nWould you like to save the raw conversation instead?`;
            this.chatContainer.addMessage(errorMsg, 'ai');

            // Create confirmation buttons
            const confirmContainer = document.createElement('div');
            confirmContainer.className = 'confirmation-buttons';
            confirmContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 10px; justify-content: center;';

            const saveRawBtn = document.createElement('button');
            saveRawBtn.textContent = 'Save Raw Conversation';
            saveRawBtn.className = 'btn btn-primary';
            saveRawBtn.style.cssText = 'padding: 10px 20px; border-radius: 8px; border: none; background: var(--primary-color); color: white; cursor: pointer;';
            saveRawBtn.onclick = async () => {
                await this.saveRawConversation();
                confirmContainer.remove();
            };

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'btn btn-secondary';
            cancelBtn.style.cssText = 'padding: 10px 20px; border-radius: 8px; border: none; background: var(--surface); color: var(--text-primary); cursor: pointer;';
            cancelBtn.onclick = () => {
                confirmContainer.remove();
                // Don't clear chat history on cancel
            };

            confirmContainer.appendChild(saveRawBtn);
            confirmContainer.appendChild(cancelBtn);

            // Add buttons to chat container
            this.chatContainer.element.appendChild(confirmContainer);
        }
    }

    /**
     * Save raw conversation as fallback
     */
    async saveRawConversation() {
        const entry = {
            date: new Date().toISOString(),
            content: this.chatHistory,
            mood: this.currentMood,
            summary: this.chatHistory
                .filter(m => m.role === 'user')
                .map(m => m.text)
                .join(' ')
                .substring(0, 200) + '...'
        };

        await this.storage.addEntry(entry);
        this.chatHistory = [];
        this.setGreeting();
        this.switchView('view-journal');
    }

    /**
     * Load journal entries
     */
    async loadJournal() {
        const list = document.getElementById('journal-list');
        list.innerHTML = '';
        const entries = await this.storage.getEntries();

        if (entries.length === 0) {
            list.innerHTML = '<div style="text-align:center; color:var(--text-secondary); max-width:640px; margin:0 auto;">No entries yet. Start chatting!</div>';
            return;
        }

        entries.forEach((entry, i) => {
            const entryEl = JournalEntry.create(
                entry,
                (e) => this.downloadEntry(e),
                i
            );
            list.appendChild(entryEl);
        });
    }

    /**
     * Download a journal entry as markdown
     * @param {Object} entry - Journal entry
     */
    downloadEntry(entry) {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        let md = `# Journal Entry - ${dateStr}\n\n`;
        md += `**Mood:** ${entry.mood || 'N/A'}\n\n`;

        // Check if entry has AI summary or raw content
        if (entry.content) {
            // Legacy format with raw conversation
            md += `## Conversation\n\n`;
            entry.content.forEach(msg => {
                const role = msg.role === 'ai' ? 'Solace' : 'Me';
                md += `**${role}:** ${msg.text}\n\n`;
            });
        } else {
            // New format with AI-generated summary
            md += `## Reflection\n\n`;
            md += entry.summary + '\n\n';
        }

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `journal-${dateStr}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
