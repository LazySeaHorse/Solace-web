/**
 * StorageManager - Handles all data persistence
 * Uses IndexedDB for journal entries and localStorage for settings
 */
export class StorageManager {
    constructor() {
        this.dbName = 'SolaceDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDB();
    }

    /**
     * Initialize IndexedDB
     * @returns {Promise<IDBDatabase>}
     */
    initDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (e) => console.error("DB Error", e);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('entries')) {
                    const store = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('date', 'date', { unique: false });
                }
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
        });
    }

    /**
     * Get a setting from localStorage
     * @param {string} key - Setting key
     * @returns {string|null}
     */
    getSetting(key) {
        return localStorage.getItem(key);
    }

    /**
     * Save a setting to localStorage
     * @param {string} key - Setting key
     * @param {string} val - Setting value
     */
    setSetting(key, val) {
        localStorage.setItem(key, val);
    }

    /**
     * Add a journal entry to IndexedDB
     * @param {Object} entry - Journal entry object
     * @returns {Promise<number>} Entry ID
     */
    async addEntry(entry) {
        if (!this.db) await this.initDB();
        return new Promise((resolve) => {
            const tx = this.db.transaction(['entries'], 'readwrite');
            const req = tx.objectStore('entries').add(entry);
            req.onsuccess = () => resolve(req.result);
        });
    }

    /**
     * Get all journal entries from IndexedDB
     * @returns {Promise<Array>} Array of entries (reversed)
     */
    async getEntries() {
        if (!this.db) await this.initDB();
        return new Promise((resolve) => {
            const tx = this.db.transaction(['entries'], 'readonly');
            const req = tx.objectStore('entries').getAll();
            req.onsuccess = () => resolve(req.result.reverse());
        });
    }

    /**
 * Update an existing entry
 * @param {Object} entry - Updated entry object
 */
    async updateEntry(entry) {
        if (!this.db) await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');
            const req = store.put(entry);

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    /**
     * Delete an entry by ID
     * @param {number} id - Entry ID
     */
    async deleteEntry(id) {
        if (!this.db) await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');
            const req = store.delete(id);

            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    /**
     * Import multiple entries
     * @param {Array} entries - Array of entry objects
     */
    async importEntries(entries) {
        if (!this.db) await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['entries'], 'readwrite');
            const store = tx.objectStore('entries');

            let completed = 0;
            let errors = 0;

            tx.oncomplete = () => resolve({ completed, errors });
            tx.onerror = () => reject(tx.error);

            entries.forEach(entry => {
                // Remove ID to let DB assign a new one to avoid conflicts
                const { id, ...entryData } = entry;
                const req = store.add(entryData);
                req.onsuccess = () => completed++;
                req.onerror = () => errors++;
            });
        });
    }
}
