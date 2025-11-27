import { Button } from '../atoms/Button.js';
import { MarkdownParser } from '../../utils/MarkdownParser.js';

/**
 * JournalEntry Component - Journal entry card
 */
export class JournalEntry {
    /**
     * Create a journal entry element
     * @param {Object} entry - Entry data
     * @param {Function} onExport - Export handler
     * @param {number} index - Index for animation delay
     * @returns {HTMLDivElement}
     */
    static create(entry, onExport, index = 0) {
        const div = document.createElement('div');
        div.className = 'journal-entry';
        div.style.animationDelay = `${index * 0.1}s`;

        const date = new Date(entry.date).toLocaleString();

        const header = document.createElement('div');
        header.className = 'entry-header';

        const dateEl = document.createElement('div');
        dateEl.className = 'entry-date';
        dateEl.textContent = date;

        const exportBtn = Button.export(() => onExport(entry));

        header.appendChild(dateEl);
        header.appendChild(exportBtn);

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
