import { Button } from '../atoms/Button.js';

/**
 * JournalSearch Component
 * Search input and controls for the journal
 */
export class JournalSearch {
    /**
     * Create journal search component
     * @param {Function} onSearch - Callback when search is triggered
     * @param {Function} onClear - Callback when search is cleared
     * @returns {HTMLElement}
     */
    static create(onSearch, onClear) {
        const container = document.createElement('div');
        container.className = 'search-container';
        container.style.marginBottom = '16px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'journal-search';
        searchInput.placeholder = 'Search entries...';
        searchInput.className = 'form-input';
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onSearch(e.target.value);
            }
        });

        const searchBtn = document.createElement('button');
        searchBtn.textContent = 'Search';
        searchBtn.className = 'btn-primary';
        searchBtn.style.width = 'auto';
        searchBtn.style.padding = '10px 20px';
        searchBtn.style.marginLeft = '8px';
        searchBtn.onclick = () => onSearch(searchInput.value);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.className = 'btn-secondary';
        clearBtn.style.width = 'auto';
        clearBtn.style.padding = '10px 20px';
        clearBtn.style.marginLeft = '8px';
        clearBtn.style.marginTop = '0';
        clearBtn.onclick = () => {
            searchInput.value = '';
            onClear();
        };

        container.appendChild(searchInput);
        container.appendChild(searchBtn);
        container.appendChild(clearBtn);

        return container;
    }
}
