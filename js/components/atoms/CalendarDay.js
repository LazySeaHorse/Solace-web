/**
 * CalendarDay Atom - Individual day cell in the calendar
 */
export class CalendarDay {
    /**
     * Create a calendar day element
     * @param {Object} props
     * @param {Date} props.date - The date object for this day
     * @param {boolean} props.isCurrentMonth - Whether the day belongs to the current month
     * @param {boolean} props.isToday - Whether the day is today
     * @param {boolean} props.isSelected - Whether the day is selected
     * @param {Array} props.entries - Array of journal entries for this day
     * @param {Function} props.onClick - Click handler
     * @returns {HTMLElement}
     */
    static create({ date, isCurrentMonth, isToday, isSelected, entries = [], onClick }) {
        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;

        // Date number
        const numberEl = document.createElement('span');
        numberEl.className = 'day-number';
        numberEl.textContent = date.getDate();
        dayEl.appendChild(numberEl);

        // Mood dots container
        if (entries.length > 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'mood-dots';

            // Take up to 3 entries to show dots for
            const displayEntries = entries.slice(0, 3);

            displayEntries.forEach(entry => {
                const dot = document.createElement('div');
                dot.className = 'mood-dot';
                dot.style.backgroundColor = this.getMoodColor(entry.mood);
                dotsContainer.appendChild(dot);
            });

            if (entries.length > 3) {
                const plus = document.createElement('div');
                plus.className = 'mood-plus';
                plus.textContent = '+';
                dotsContainer.appendChild(plus);
            }

            dayEl.appendChild(dotsContainer);
        }

        dayEl.onclick = () => onClick(date);

        return dayEl;
    }

    /**
     * Get color for mood
     * @param {string} mood 
     * @returns {string}
     */
    static getMoodColor(mood) {
        const colors = {
            'happy': '#10b981', // Happy - Emerald
            'calm': '#3b82f6', // Calm - Blue
            'sad': '#f59e0b', // Sad - Amber
            'anxious': '#ef4444', // Anxious - Red
            'neutral': '#6b7280', // Neutral - Gray
            'angry': '#dc2626', // Angry - Dark Red
            'tired': '#8b5cf6', // Tired - Purple
            'excited': '#f472b6', // Excited - Pink
            'crying': '#1e40af', // Crying - Dark Blue
        };
        return colors[mood] || '#cbd5e1'; // Default gray
    }
}
