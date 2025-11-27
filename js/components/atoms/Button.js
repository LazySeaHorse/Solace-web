/**
 * Button Component - Various button types
 */
export class Button {
    /**
     * Create a button element
     * @param {Object} options - Button options
     * @param {string} options.text - Button text
     * @param {string} options.variant - Button variant (primary, secondary, icon, send, emotion, export)
     * @param {Function} options.onClick - Click handler
     * @param {string} options.icon - Icon HTML (optional)
     * @param {string} options.id - Element ID (optional)
     * @param {string} options.className - Additional CSS classes (optional)
     * @returns {HTMLButtonElement}
     */
    static create({ text = '', variant = 'primary', onClick = null, icon = '', id = '', className = '' }) {
        const button = document.createElement('button');

        // Set base class and variant class
        const variantClass = variant ? `btn-${variant}` : 'btn';
        button.className = `${variantClass} ${className}`.trim();

        if (id) button.id = id;

        // Add content
        if (icon) {
            button.innerHTML = icon;
        } else {
            button.textContent = text;
        }

        // Add click handler
        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * Create a primary button
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {string} id - Element ID (optional)
     * @returns {HTMLButtonElement}
     */
    static primary(text, onClick, id = '') {
        return this.create({ text, variant: 'primary', onClick, id });
    }

    /**
     * Create a secondary button
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {string} id - Element ID (optional)
     * @returns {HTMLButtonElement}
     */
    static secondary(text, onClick, id = '') {
        return this.create({ text, variant: 'secondary', onClick, id });
    }

    /**
     * Create an icon button
     * @param {string} icon - Icon HTML
     * @param {Function} onClick - Click handler
     * @param {string} id - Element ID (optional)
     * @param {string} className - Additional CSS classes (optional)
     * @returns {HTMLButtonElement}
     */
    static icon(icon, onClick, id = '', className = '') {
        return this.create({ icon, variant: 'icon', onClick, id, className });
    }

    /**
     * Create a send button
     * @param {Function} onClick - Click handler
     * @param {string} icon - Icon HTML
     * @returns {HTMLButtonElement}
     */
    static send(onClick, icon) {
        return this.create({ icon, variant: 'send', onClick });
    }

    /**
     * Create an emotion button
     * @param {string} emoji - Emoji character
     * @param {string} mood - Mood data attribute
     * @param {Function} onClick - Click handler
     * @returns {HTMLButtonElement}
     */
    static emotion(emoji, mood, onClick) {
        const button = this.create({ text: emoji, variant: 'emotion', onClick });
        button.setAttribute('data-mood', mood);
        return button;
    }

    /**
     * Create an export button
     * @param {Function} onClick - Click handler
     * @returns {HTMLButtonElement}
     */
    static export(onClick) {
        return this.create({ text: '⬇ MD', variant: 'export', onClick });
    }
}
