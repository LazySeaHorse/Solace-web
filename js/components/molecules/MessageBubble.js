import { MarkdownParser } from '../../utils/MarkdownParser.js';

/**
 * MessageBubble Component - Displays a chat message
 */
export class MessageBubble {
    /**
     * Create a message bubble element
     * @param {string} text - Message text
     * @param {string} role - Message role ('user' or 'ai')
     * @returns {HTMLDivElement}
     */
    static create(text, role) {
        const div = document.createElement('div');
        div.className = `message ${role}`;
        div.innerHTML = MarkdownParser.parse(text);
        div.id = 'msg-' + Date.now();
        return div;
    }

    /**
     * Create a typing indicator
     * @returns {HTMLDivElement}
     */
    static createTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'message ai';
        div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        div.id = 'typing-' + Date.now();
        return div;
    }
}
