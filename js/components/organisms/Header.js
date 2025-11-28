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
    static create({ onSettingsClick, onModeChange, onEndConversation, onThemeToggle, currentMode = 'default', currentTheme = 'light' }) {
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

        // NEW: End Conversation Button (Tick icon)
        const endConvBtn = Button.icon(
            Icon.render('check'),
            onEndConversation,
            'end-conv-btn',
            'settings-btn' // Re-using settings-btn class for consistent styling
        );
        // Add a small margin if needed, or rely on flex gap in CSS

        // Theme Toggle Button
        const themeIcon = currentTheme === 'dark' ? 'sun' : 'moon';
        const themeBtn = Button.icon(
            Icon.render(themeIcon),
            onThemeToggle,
            'theme-btn',
            'settings-btn'
        );

        // Settings button
        const settingsBtn = Button.icon(
            Icon.render('settings'),
            onSettingsClick,
            'settings-btn',
            'settings-btn'
        );

        controls.appendChild(modeSelect);
        controls.appendChild(endConvBtn); // Add the new button
        controls.appendChild(themeBtn); // Add the theme toggle button
        controls.appendChild(settingsBtn);

        header.appendChild(logo);
        header.appendChild(controls);

        return header;
    }
}
