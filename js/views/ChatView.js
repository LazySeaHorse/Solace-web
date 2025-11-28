import { ChatContainer } from '../components/organisms/ChatContainer.js';
import { InputArea } from '../components/molecules/InputArea.js';

/**
 * ChatView
 * Manages the Chat UI
 */
export class ChatView {
    constructor(onSendMessage) {
        this.onSendMessage = onSendMessage;
        this.container = null;
        this.chatContainer = null;
        this.suggestionsContainer = null;
        this.inputArea = null;
    }

    /**
     * Initialize and return the view element
     * @returns {HTMLElement}
     */
    render() {
        this.container = document.createElement('div');
        this.container.id = 'view-chat';
        this.container.className = 'view active';

        // Chat components
        this.chatContainer = ChatContainer.create();
        this.suggestionsContainer = ChatContainer.createSuggestionsContainer(
            (text) => this.onSendMessage(text)
        );
        this.inputArea = InputArea.create(() => this.onSendMessage());

        // Assemble UI
        this.container.appendChild(this.chatContainer.element);

        const spacer = document.createElement('div');
        spacer.style.height = '140px';
        this.container.appendChild(spacer);

        return this.container;
    }

    /**
     * Get the chat controls element (to be placed outside the view if needed, 
     * or we can just append it to the main app container like before)
     * In the original App.js, chat-controls was a sibling of main.
     * We'll provide a method to get it.
     */
    getControls() {
        const chatControls = document.createElement('div');
        chatControls.className = 'chat-controls';
        chatControls.id = 'chat-controls';
        chatControls.appendChild(this.suggestionsContainer.element);
        chatControls.appendChild(this.inputArea);
        return chatControls;
    }

    addMessage(text, role) {
        return this.chatContainer.addMessage(text, role);
    }

    addTypingIndicator() {
        return this.chatContainer.addTypingIndicator();
    }

    removeElement(id) {
        this.chatContainer.removeElement(id);
    }

    setSuggestions(suggestions) {
        this.suggestionsContainer.setSuggestions(suggestions);
    }

    clearSuggestions() {
        this.suggestionsContainer.clear();
    }

    clearChat() {
        this.chatContainer.clear();
    }

    getInput() {
        return document.getElementById('chat-input');
    }
}
