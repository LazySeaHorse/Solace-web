import { CalendarDay } from '../atoms/CalendarDay.js';

/**
 * CalendarGrid Molecule - Grid of calendar days
 */
export class CalendarGrid {
    /**
     * Create calendar grid
     * @param {Object} props
     * @param {Date} props.currentDate - Currently displayed month
     * @param {Array} props.entries - All journal entries
     * @param {Function} props.onDayClick - Day click handler
     * @returns {HTMLElement}
     */
    static create({ currentDate, entries, onDayClick }) {
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // Weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-weekdays';
        weekdays.forEach(day => {
            const el = document.createElement('div');
            el.className = 'weekday-label';
            el.textContent = day;
            headerRow.appendChild(el);
        });
        grid.appendChild(headerRow);

        // Days grid
        const daysContainer = document.createElement('div');
        daysContainer.className = 'calendar-days';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Start date (go back to Sunday)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        // End date (go forward to Saturday to complete 6 rows usually)
        // We want 42 days (6 weeks) to ensure consistent height
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 41);

        let iterDate = new Date(startDate);

        while (iterDate <= endDate) {
            const isCurrentMonth = iterDate.getMonth() === month;
            const isToday = new Date().toDateString() === iterDate.toDateString();

            // Find entries for this day
            const dayEntries = entries.filter(e => {
                const entryDate = new Date(e.date);
                return entryDate.toDateString() === iterDate.toDateString();
            });

            const dayEl = CalendarDay.create({
                date: new Date(iterDate),
                isCurrentMonth,
                isToday,
                entries: dayEntries,
                onClick: onDayClick
            });

            daysContainer.appendChild(dayEl);

            // Next day
            iterDate.setDate(iterDate.getDate() + 1);
        }

        grid.appendChild(daysContainer);
        return grid;
    }
}
