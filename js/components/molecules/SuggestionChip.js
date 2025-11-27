/**
 * SuggestionChip Component - Quick reply suggestion chip
 */
export class SuggestionChip {
    /**
     * Create a suggestion chip
     * @param {string} text - Chip text
     * @param {Function} onClick - Click handler
     * @param {number} index - Index for animation delay
     * @returns {HTMLDivElement}
     */
    static create(text, onClick, index = 0) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = text;
        chip.style.animationDelay = `${index * 0.1}s`;
        chip.addEventListener('click', () => onClick(text));
        return chip;
    }
}
