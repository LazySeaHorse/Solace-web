import { Button } from '../atoms/Button.js';
import { Icon } from '../atoms/Icon.js';

/**
 * FAB Component - Floating Action Button
 */
export class FAB {
    /**
     * Create FAB element
     * @param {Function} onClick - Click handler
     * @returns {Object} FAB element and methods
     */
    static create(onClick) {
        const fab = Button.create({
            icon: Icon.render('check'),
            variant: '',
            onClick,
            className: 'fab'
        });
        fab.id = 'finish-chat-btn';
        fab.title = 'Save to Journal';

        return {
            element: fab,

            /**
             * Show the FAB
             */
            show() {
                fab.classList.remove('hidden');
            },

            /**
             * Hide the FAB
             */
            hide() {
                fab.classList.add('hidden');
            }
        };
    }
}
