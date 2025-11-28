import { CalendarHeader } from '../molecules/CalendarHeader.js';
import { CalendarGrid } from '../molecules/CalendarGrid.js';
import { DayEntryList } from '../molecules/DayEntryList.js';

/**
 * Calendar Organism - Main calendar widget
 */
export class Calendar {
    constructor(entries, onEntryClick, getFilteredEntries = null) {
        this.entries = entries;
        this.onEntryClick = onEntryClick;
        this.getFilteredEntries = getFilteredEntries; // Function to get filtered entries
        this.currentDate = new Date();
        this.selectedDate = null;
        this.view = 'calendar'; // 'calendar' or 'day'
        this.element = document.createElement('div');
        this.element.className = 'calendar-widget';
        this.render();
    }

    /**
     * Update entries data
     * @param {Array} newEntries 
     */
    updateEntries(newEntries) {
        this.entries = newEntries;
        this.render();
    }

    /**
     * Render the calendar
     */
    render() {
        this.element.innerHTML = '';

        if (this.view === 'calendar') {
            this.renderCalendarView();
        } else {
            this.renderDayView();
        }
    }

    /**
     * Render calendar grid view
     */
    renderCalendarView() {
        // Header
        const header = CalendarHeader.create({
            currentDate: this.currentDate,
            onPrev: () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            },
            onNext: () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            }
        });

        // Grid
        const grid = CalendarGrid.create({
            currentDate: this.currentDate,
            entries: this.entries,
            onDayClick: (date) => {
                this.selectedDate = date;
                this.view = 'day';
                this.render();
            }
        });

        this.element.appendChild(header);
        this.element.appendChild(grid);
    }

    /**
     * Render day detail view
     */
    renderDayView() {
        // Use filtered entries if available, otherwise use all entries
        const sourceEntries = this.getFilteredEntries ? this.getFilteredEntries() : this.entries;
        const dayEntries = sourceEntries.filter(e =>
            new Date(e.date).toDateString() === this.selectedDate.toDateString()
        );

        const dayView = DayEntryList.create({
            date: this.selectedDate,
            entries: dayEntries,
            onBack: () => {
                this.view = 'calendar';
                this.render();
            },
            onEntryClick: this.onEntryClick
        });
        this.element.appendChild(dayView);
    }
}