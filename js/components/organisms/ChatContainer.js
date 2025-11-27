import { MessageBubble } from '../molecules/MessageBubble.js';
import { SuggestionChip } from '../molecules/SuggestionChip.js';

/**
 * ChatContainer Component - Main chat area with messages and suggestions
 */
export class ChatContainer {
    /**
     * Create chat container structure
     * @returns {Object} Container elements
     */
    static create() {
        // Main container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';

        return {
            element: chatContainer,

            /**
             * Add a message to the chat
             * @param {string} text - Message text
             * @param {string} role - 'user' or 'ai'
             */
            addMessage(text, role) {
                const message = MessageBubble.create(text, role);
                chatContainer.appendChild(message);
                window.scrollTo(0, document.body.scrollHeight);
                return message.id;
            },

            /**
             * Add typing indicator
             * @returns {string} Indicator ID
             */
            addTypingIndicator() {
                const indicator = MessageBubble.createTypingIndicator();
                chatContainer.appendChild(indicator);
                window.scrollTo(0, document.body.scrollHeight);
                return indicator.id;
            },

            /**
             * Remove element by ID
             * @param {string} id - Element ID
             */
            removeElement(id) {
                const el = document.getElementById(id);
                if (el) el.remove();
            },

            /**
             * Clear all messages
             */
            clear() {
                chatContainer.innerHTML = '';
            }
        };
    }

    /**
     * Create suggestion chips container
     * @param {Function} onSuggestionClick - Suggestion click handler
     * @returns {Object} Chips container with methods
     */
    static createSuggestionsContainer(onSuggestionClick) {
        const container = document.createElement('div');
        container.className = 'suggestion-chips';
        container.id = 'suggestion-chips';

        return {
            element: container,

            /**
             * Set suggestions
             * @param {Array<string>} suggestions - Array of suggestion texts
             */
            setSuggestions(suggestions) {
                container.innerHTML = '';
                suggestions.forEach((text, i) => {
                    const chip = SuggestionChip.create(text, onSuggestionClick, i);
                    container.appendChild(chip);
                });
            },

            /**
             * Clear all suggestions
             */
            clear() {
                container.innerHTML = '';
            }
        };
    }
}
