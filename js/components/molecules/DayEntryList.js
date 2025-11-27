import { JournalEntry } from './JournalEntry.js';
import { Button } from '../atoms/Button.js';
import { Icon } from '../atoms/Icon.js';

/**
 * DayEntryList Molecule - List of entries for a specific day
 */
export class DayEntryList {
    /**
     * Create day entry list
     * @param {Object} props
     * @param {Date} props.date - Selected date
     * @param {Array} props.entries - Entries for this day
     * @param {Function} props.onBack - Back button handler
     * @param {Function} props.onExport - Export handler
     * @returns {HTMLElement}
     */
    static create({ date, entries, onBack, onExport }) {
        const container = document.createElement('div');
        container.className = 'day-entry-list';

        // Header
        const header = document.createElement('div');
        header.className = 'day-list-header';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn-text';
        backBtn.innerHTML = `${Icon.render('arrowLeft')} Back to Calendar`;
        backBtn.onclick = onBack;

        const title = document.createElement('h3');
        title.textContent = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        header.appendChild(backBtn);
        header.appendChild(title);
        container.appendChild(header);

        // Entries list
        const list = document.createElement('div');
        list.className = 'entries-container';

        if (entries.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No entries for this day.';
            list.appendChild(empty);
        } else {
            entries.forEach((entry, index) => {
                const entryEl = JournalEntry.create(entry, onExport, index);
                list.appendChild(entryEl);
            });
        }

        container.appendChild(list);
        return container;
    }
}
