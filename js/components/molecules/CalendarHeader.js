import { Button } from '../atoms/Button.js';
import { Icon } from '../atoms/Icon.js';

/**
 * CalendarHeader Molecule - Month navigation and title
 */
export class CalendarHeader {
    /**
     * Create calendar header
     * @param {Object} props
     * @param {Date} props.currentDate - Currently displayed month
     * @param {Function} props.onPrev - Previous month handler
     * @param {Function} props.onNext - Next month handler
     * @returns {HTMLElement}
     */
    static create({ currentDate, onPrev, onNext }) {
        const container = document.createElement('div');
        container.className = 'calendar-header';

        const title = document.createElement('h3');
        title.className = 'calendar-title';
        title.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const controls = document.createElement('div');
        controls.className = 'calendar-controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn-icon';
        prevBtn.innerHTML = Icon.render('arrowLeft') || '&lt;';
        prevBtn.onclick = onPrev;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-icon';
        nextBtn.innerHTML = Icon.render('arrowRight') || '&gt;';
        nextBtn.onclick = onNext;

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);

        container.appendChild(title);
        container.appendChild(controls);

        return container;
    }
}
