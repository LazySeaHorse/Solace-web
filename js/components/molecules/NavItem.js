import { Icon } from '../atoms/Icon.js';

/**
 * NavItem Component - Navigation button with icon and label
 */
export class NavItem {
    /**
     * Create a navigation item
     * @param {Object} options - NavItem options
     * @param {string} options.label - Nav item label
     * @param {string} options.icon - Icon type
     * @param {string} options.target - Target view ID
     * @param {boolean} options.active - Is active
     * @param {Function} options.onClick - Click handler
     * @returns {HTMLDivElement}
     */
    static create({ label, icon, target, active = false, onClick }) {
        const div = document.createElement('div');
        div.className = `nav-item ${active ? 'active' : ''}`;
        div.setAttribute('data-target', target);

        div.innerHTML = `
            ${Icon.render(icon)}
            <span>${label}</span>
        `;

        if (onClick) {
            div.addEventListener('click', () => onClick(target));
        }

        return div;
    }
}
