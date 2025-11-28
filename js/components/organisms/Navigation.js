import { NavItem } from '../molecules/NavItem.js';

/**
 * Navigation Component - Bottom navigation bar
 */
export class Navigation {
    /**
     * Create navigation element
     * @param {Function} onNavigate - Navigation handler
     * @param {string} activeView - Currently active view ID
     * @returns {HTMLElement}
     */
    static create(onNavigate, activeView = 'view-chat') {
        const nav = document.createElement('nav');

        const chatItem = NavItem.create({
            label: 'Chat',
            icon: 'chat',
            target: 'view-chat',
            active: activeView === 'view-chat',
            onClick: onNavigate
        });

        const journalItem = NavItem.create({
            label: 'Journal',
            icon: 'journal',
            target: 'view-journal',
            active: activeView === 'view-journal',
            onClick: onNavigate
        });

        const insightsItem = NavItem.create({
            label: 'Insights',
            icon: 'chart',
            target: 'view-insights',
            active: activeView === 'view-insights',
            onClick: onNavigate
        });

        nav.appendChild(chatItem);
        nav.appendChild(journalItem);
        nav.appendChild(insightsItem);

        return nav;
    }
}
