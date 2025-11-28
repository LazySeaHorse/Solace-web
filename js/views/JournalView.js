import { JournalSearch } from '../components/molecules/JournalSearch.js';
import { SearchResultCard } from '../components/molecules/SearchResultCard.js';
import { Calendar } from '../components/organisms/Calendar.js';
import { EntryDetailModal } from '../components/organisms/EntryDetailModal.js';

/**
 * JournalView
 * Manages the Journal UI
 */
export class JournalView {
    constructor(callbacks) {
        this.callbacks = callbacks; // onSearch, onClear, onEntryUpdate, onEntryDelete, onEntryExport
        this.container = null;
        this.calendar = null;
        this.entryDetailModal = null;
        this.journalList = null;
    }

    /**
     * Initialize and return the view element
     * @returns {HTMLElement}
     */
    render() {
        this.container = document.createElement('div');
        this.container.id = 'view-journal';
        this.container.className = 'view';

        const journalTitle = document.createElement('h2');
        journalTitle.textContent = 'Journal';
        journalTitle.className = 'page-title';

        // Search Component
        const searchComponent = JournalSearch.create(
            (query) => this.callbacks.onSearch(query),
            () => this.callbacks.onClear()
        );

        // Journal List Container (for results or calendar)
        this.journalList = document.createElement('div');
        this.journalList.id = 'journal-list';

        // Entry Detail Modal
        this.entryDetailModal = EntryDetailModal.create({
            onUpdate: this.callbacks.onEntryUpdate,
            onDelete: this.callbacks.onEntryDelete,
            onExport: this.callbacks.onEntryExport,
            onClose: () => this.entryDetailModal.close()
        });
        // We need to append the modal to the body or app, but here we just return the view.
        // The modal element should probably be appended to the main app container.
        // We'll expose it via a getter.

        // Calendar
        this.calendar = new Calendar(
            [], // Initial entries, will be updated
            (entry) => this.entryDetailModal.open(entry),
            () => this.callbacks.getFilteredEntries()
        );

        this.container.appendChild(journalTitle);
        this.container.appendChild(searchComponent);
        this.container.appendChild(this.journalList);

        return this.container;
    }

    getModalElement() {
        return this.entryDetailModal.element;
    }

    /**
     * Update the view with entries
     * @param {Array} entries - All entries
     * @param {Array|null} filteredEntries - Filtered entries if search is active
     */
    update(entries, filteredEntries = null) {
        this.journalList.innerHTML = '';

        if (filteredEntries) {
            // Show search results
            if (filteredEntries.length === 0) {
                const noResults = document.createElement('div');
                noResults.style.cssText = 'text-align: center; padding: 40px; color: var(--text-secondary);';
                noResults.textContent = 'No entries found';
                this.journalList.appendChild(noResults);
            } else {
                const resultsContainer = document.createElement('div');
                resultsContainer.className = 'search-results';
                resultsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

                const resultCount = document.createElement('p');
                resultCount.style.cssText = 'color: var(--text-secondary); font-size: var(--font-size-sm); margin-bottom: 8px;';
                resultCount.textContent = `Found ${filteredEntries.length} ${filteredEntries.length === 1 ? 'entry' : 'entries'}`;
                resultsContainer.appendChild(resultCount);

                filteredEntries.forEach(entry => {
                    const card = SearchResultCard.create(entry, (e) => this.entryDetailModal.open(e));
                    resultsContainer.appendChild(card);
                });

                this.journalList.appendChild(resultsContainer);
            }
        } else {
            // Show calendar
            this.calendar.updateEntries(entries);
            this.journalList.appendChild(this.calendar.element);
        }
    }

    closeModal() {
        this.entryDetailModal.close();
    }
}
