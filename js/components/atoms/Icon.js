/**
 * Icon Component - Renders SVG icons
 */
export class Icon {
    /**
     * Get SVG for a specific icon type
     * @param {string} type - Icon type
     * @param {string} className - Additional CSS classes
     * @returns {string} SVG HTML string
     */
    static render(type, className = 'icon') {
        const icons = {
            settings: `
                <svg class="${className}" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6m-13.36 0l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                </svg>
            `,
            send: `
                <svg class="${className}" viewBox="0 0 24 24" style="width:20px;height:20px;stroke-width:2.5">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `,
            chat: `
                <svg class="${className}" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            `,
            journal: `
                <svg class="${className}" viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
            `,
            check: `
                <svg class="${className}" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `,
            download: '⬇'
        };

        return icons[type] || '';
    }

    /**
     * Create an icon element
     * @param {string} type - Icon type
     * @param {string} className - Additional CSS classes
     * @returns {Element} Icon element
     */
    static create(type, className = 'icon') {
        const div = document.createElement('div');
        div.innerHTML = this.render(type, className);
        return div.firstElementChild || div;
    }
}
