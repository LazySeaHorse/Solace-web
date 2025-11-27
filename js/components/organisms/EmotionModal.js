import { Button } from '../atoms/Button.js';

/**
 * EmotionModal Component - Emotion selection modal
 */
export class EmotionModal {
    /**
     * Create emotion modal
     * @param {Function} onSelectEmotion - Emotion selection handler
     * @returns {Object} Modal element and methods
     */
    static create(onSelectEmotion) {
        const modal = document.createElement('div');
        modal.id = 'emotion-modal';
        modal.className = 'modal';

        const content = document.createElement('div');
        content.className = 'modal-content';

        // Title
        const title = document.createElement('h3');
        title.textContent = 'How are you feeling?';
        content.appendChild(title);

        // Emotion grid
        const grid = document.createElement('div');
        grid.className = 'emotion-grid';

        const emotions = [
            { emoji: '😊', mood: 'happy' },
            { emoji: '😌', mood: 'calm' },
            { emoji: '😐', mood: 'neutral' },
            { emoji: '😔', mood: 'sad' },
            { emoji: '😰', mood: 'anxious' },
            { emoji: '😠', mood: 'angry' }
        ];

        const buttons = [];
        emotions.forEach(({ emoji, mood }) => {
            const btn = Button.emotion(emoji, mood, (e) => {
                // Remove selection from all buttons
                buttons.forEach(b => b.classList.remove('selected'));
                // Select clicked button
                e.currentTarget.classList.add('selected');

                setTimeout(() => {
                    onSelectEmotion(mood);
                    modal.classList.remove('open');
                    // Clear selection
                    buttons.forEach(b => b.classList.remove('selected'));
                }, 300);
            });
            buttons.push(btn);
            grid.appendChild(btn);
        });

        content.appendChild(grid);
        modal.appendChild(content);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                buttons.forEach(b => b.classList.remove('selected'));
            }
        });

        return {
            element: modal,

            /**
             * Open the modal
             */
            open() {
                modal.classList.add('open');
            },

            /**
             * Close the modal
             */
            close() {
                modal.classList.remove('open');
                buttons.forEach(b => b.classList.remove('selected'));
            }
        };
    }
}
