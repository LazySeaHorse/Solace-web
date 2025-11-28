/**
 * JournalController
 * Manages journal logic
 */
export class JournalController {
    constructor(view, storage) {
        this.view = view;
        this.storage = storage;
        this.filteredEntries = null;
    }

    /**
     * Load and display journal entries
     */
    async loadEntries() {
        const entries = await this.storage.getEntries();
        this.view.update(entries, this.filteredEntries);
    }

    /**
     * Filter journal entries
     * @param {string} query 
     */
    async filterJournal(query) {
        const allEntries = await this.storage.getEntries();

        if (!query.trim()) {
            this.filteredEntries = null;
            this.view.update(allEntries, null);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = allEntries.filter(entry => {
            if (entry.summary && entry.summary.toLowerCase().includes(lowerQuery)) return true;
            if (entry.mood && entry.mood.toLowerCase().includes(lowerQuery)) return true;
            const dateStr = new Date(entry.date).toLocaleDateString();
            if (dateStr.toLowerCase().includes(lowerQuery)) return true;
            if (entry.content && Array.isArray(entry.content)) {
                const contentText = entry.content.map(m => m.text).join(' ').toLowerCase();
                if (contentText.includes(lowerQuery)) return true;
            }
            return false;
        });

        this.filteredEntries = filtered;
        this.view.update(allEntries, filtered);
    }

    /**
     * Clear search filter
     */
    async clearSearch() {
        this.filteredEntries = null;
        await this.loadEntries();
    }

    /**
     * Update an entry
     * @param {Object} updatedEntry 
     */
    async updateEntry(updatedEntry) {
        await this.storage.updateEntry(updatedEntry);
        await this.loadEntries();
        this.view.closeModal();
    }

    /**
     * Delete an entry
     * @param {number} id 
     */
    async deleteEntry(id) {
        await this.storage.deleteEntry(id);
        await this.loadEntries();
        this.view.closeModal();
    }

    /**
     * Export a single entry
     * @param {Object} entry 
     */
    exportEntry(entry) {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        let md = `# Journal Entry - ${dateStr}\n\n`;
        md += `**Mood:** ${entry.mood || 'N/A'}\n\n`;

        if (entry.content) {
            md += `## Conversation\n\n`;
            entry.content.forEach(msg => {
                const role = msg.role === 'ai' ? 'Solace' : 'Me';
                md += `**${role}:** ${msg.text}\n\n`;
            });
        } else {
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

    /**
     * Export all entries
     */
    async exportAll() {
        const entries = await this.storage.getEntries();
        const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `solace-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import entries from file
     * @param {File} file 
     */
    async importEntries(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const entries = JSON.parse(e.target.result);
                if (!Array.isArray(entries)) throw new Error('Invalid backup file');

                const result = await this.storage.importEntries(entries);
                alert(`Imported ${result.completed} entries.`);
                await this.loadEntries();
            } catch (error) {
                alert('Failed to import: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}
