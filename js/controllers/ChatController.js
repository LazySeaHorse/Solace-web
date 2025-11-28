/**
 * ChatController
 * Manages chat logic and interaction with Gemini
 */
export class ChatController {
    constructor(view, gemini, storage, themeManager, onJournalEntryCreated) {
        this.view = view;
        this.gemini = gemini;
        this.storage = storage;
        this.themeManager = themeManager;
        this.onJournalEntryCreated = onJournalEntryCreated;

        this.chatHistory = [];
        this.currentMood = null;
    }

    /**
     * Initialize chat with greeting
     */
    initialize() {
        this.setGreeting();
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

        const mode = this.themeManager.getMode();
        if (mode === 'gratitude') greeting += " What are you grateful for today?";
        else if (mode === 'reflection') greeting += " What's on your mind?";
        else greeting += " How was your day?";

        this.view.clearChat();
        this.view.addMessage(greeting, 'ai');
        this.chatHistory = [{ role: 'ai', text: greeting }];
    }

    /**
     * Handle sending a message
     * @param {string} textOverride - Optional text to send
     */
    async handleSendMessage(textOverride = null) {
        const input = this.view.getInput();
        const text = textOverride || input.value.trim();
        if (!text) return;

        this.view.clearSuggestions();
        this.view.addMessage(text, 'user');
        this.chatHistory.push({ role: 'user', text });
        input.value = '';

        try {
            const model = this.storage.getSetting('gemini_model') || 'gemini-flash-latest';
            const loadingId = this.view.addTypingIndicator();

            let response = await this.gemini.generateContent(model, text, this.chatHistory);

            let suggestions = [];
            if (response.includes('|')) {
                const parts = response.split('|');
                if (parts.length >= 4) {
                    response = parts.slice(0, parts.length - 3).join('|').trim();
                    suggestions = parts.slice(-3).map(s => s.trim()).filter(s => s);
                }
            }

            this.view.removeElement(loadingId);
            this.view.addMessage(response, 'ai');
            this.chatHistory.push({ role: 'ai', text: response });

            this.view.setSuggestions(suggestions);

        } catch (error) {
            this.view.addMessage("Error: " + error.message, 'ai');
        }
    }

    /**
     * End conversation and save to journal
     * @param {string} mood 
     */
    async endConversation(mood) {
        this.currentMood = mood;
        await this.saveSessionToJournal();
    }

    /**
     * Save current chat session to journal
     */
    async saveSessionToJournal() {
        if (this.chatHistory.length <= 1) return;

        // Show loading indicator in chat
        const loadingId = this.view.addTypingIndicator();
        this.view.addMessage('Generating your journal entry...', 'ai');

        try {
            const model = this.storage.getSetting('gemini_model') || 'gemini-flash-latest';

            // Generate AI summary
            const summary = await this.gemini.generateJournalSummary(
                this.chatHistory,
                this.currentMood,
                model
            );

            // Remove loading indicator
            this.view.removeElement(loadingId);

            // Save entry with AI-generated summary
            const entry = {
                date: new Date().toISOString(),
                summary: summary,
                mood: this.currentMood
            };

            await this.storage.addEntry(entry);

            // Clear chat and notify
            this.chatHistory = [];
            this.setGreeting();

            if (this.onJournalEntryCreated) {
                this.onJournalEntryCreated();
            }

        } catch (error) {
            // Remove loading indicator
            this.view.removeElement(loadingId);

            // Show error message and ask for confirmation
            const errorMsg = `Failed to generate journal summary: ${error.message}\n\nWould you like to save the raw conversation instead?`;
            this.view.addMessage(errorMsg, 'ai');

            // We need to handle the confirmation UI here or in the view
            // For simplicity, we'll just auto-save raw if summary fails for now, 
            // or we could implement the confirmation buttons in the View.
            // Let's implement a simple fallback for now to keep it clean.
            await this.saveRawConversation();
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

        if (this.onJournalEntryCreated) {
            this.onJournalEntryCreated();
        }
    }
}
