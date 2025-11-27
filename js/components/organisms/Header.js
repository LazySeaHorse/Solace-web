import { Button } from '../atoms/Button.js';
import { Input } from '../atoms/Input.js';
import { Icon } from '../atoms/Icon.js';

/**
 * Header Component - App header with logo, mode selector, and settings
 */
export class Header {
    /**
     * Create header element
     * @param {Object} options - Header options
     * @param {Function} options.onSettingsClick - Settings button handler
     * @param {Function} options.onModeChange - Mode change handler
     * @param {string} options.currentMode - Current mode value
     * @returns {HTMLElement}
     */
    static create({ onSettingsClick, onModeChange, currentMode = 'default' }) {
        const header = document.createElement('header');

        // Logo
        const logo = document.createElement('div');
        logo.className = 'logo';
        logo.textContent = 'Solace';

        // Controls container
        const controls = document.createElement('div');
        controls.className = 'header-controls';

        // Mode selector
        const modeSelect = Input.select({
            id: 'mode-select',
            value: currentMode,
            options: [
                { value: 'default', text: 'Default' },
                { value: 'gratitude', text: 'Gratitude' },
                { value: 'reflection', text: 'Reflection' }
            ],
            onChange: onModeChange
        });

        // Settings button
        const settingsBtn = Button.icon(
            Icon.render('settings'),
            onSettingsClick,
            'settings-btn',
            'settings-btn'
        );

        controls.appendChild(modeSelect);
        controls.appendChild(settingsBtn);

        header.appendChild(logo);
        header.appendChild(controls);

        return header;
    }
}
