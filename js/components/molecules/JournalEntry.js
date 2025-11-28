import { Button } from '../atoms/Button.js';
import { MarkdownParser } from '../../utils/MarkdownParser.js';

/**
 * JournalEntry Component - Journal entry card
 */
export class JournalEntry {
    /**
     * Create a journal entry element
     * @param {Object} entry - Entry data
     * @param {Function} onClick - Click handler
     * @param {number} index - Index for animation delay
     * @returns {HTMLDivElement}
     */
    static create(entry, onClick, index = 0) {
        const div = document.createElement('div');
        div.className = 'journal-entry';
        div.style.animationDelay = `${index * 0.1}s`;
        div.style.cursor = 'pointer'; // Make it look clickable

        // Add click handler
        div.onclick = () => onClick(entry);

        const date = new Date(entry.date).toLocaleString();

        const header = document.createElement('div');
        header.className = 'entry-header';

        const dateEl = document.createElement('div');
        dateEl.className = 'entry-date';
        dateEl.textContent = date;

        header.appendChild(dateEl);
        // Export button removed from here

        const preview = document.createElement('div');
        preview.className = 'entry-preview';
        preview.innerHTML = MarkdownParser.parse(entry.summary);

        div.appendChild(header);
        div.appendChild(preview);

        if (entry.mood) {
            const mood = document.createElement('div');
            mood.className = 'entry-mood';
            mood.textContent = entry.mood;
            div.appendChild(mood);
        }

        return div;
    }
}