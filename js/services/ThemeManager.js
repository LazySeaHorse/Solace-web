/**
 * ThemeManager Service
 * Handles theme switching and application
 */
export class ThemeManager {
    constructor(storage) {
        this.storage = storage;
        this.theme = this.storage.getSetting('theme') || 'light';
        this.mode = 'default';

        // Apply initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    /**
     * Toggle between light and dark themes
     * @returns {string} The new theme
     */
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        this.storage.setSetting('theme', this.theme);
        return this.theme;
    }

    /**
     * Apply theme based on mode
     * @param {string} mode - Mode name
     */
    applyMode(mode) {
        this.mode = mode;
        const root = document.documentElement;
        if (mode === 'gratitude') {
            root.style.setProperty('--primary-color', 'var(--mode-gratitude)');
        } else if (mode === 'reflection') {
            root.style.setProperty('--primary-color', 'var(--mode-reflection)');
        } else {
            root.style.setProperty('--primary-color', '#7c3aed');
        }
    }

    getTheme() {
        return this.theme;
    }

    getMode() {
        return this.mode;
    }
}
