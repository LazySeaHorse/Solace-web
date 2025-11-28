/**
 * SearchResultCard Component
 * Detailed card view for search results
 */
export class SearchResultCard {
    /**
     * Create a search result card
     * @param {Object} entry - Journal entry
     * @param {Function} onClick - Click handler
     * @returns {HTMLElement}
     */
    static create(entry, onClick) {
        const card = document.createElement('div');
        card.className = 'search-result-card';
        card.style.cssText = `
            background: var(--surface);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            padding: 16px;
            cursor: pointer;
            transition: all var(--transition-fast);
        `;

        // Date and mood
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';

        const date = document.createElement('span');
        date.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); font-weight: var(--font-weight-medium);';
        date.textContent = new Date(entry.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Convert mood text to emoji
        const moodEmoji = SearchResultCard.getMoodEmoji(entry.mood);
        if (moodEmoji) {
            const mood = document.createElement('span');
            mood.style.cssText = 'font-size: 1.5rem;';
            mood.textContent = moodEmoji;
            header.appendChild(date);
            header.appendChild(mood);
        } else {
            header.appendChild(date);
        }

        card.appendChild(header);

        // Summary preview with markdown rendering
        const summary = document.createElement('div');
        summary.style.cssText = 'color: var(--text-primary); font-size: var(--font-size-base); line-height: 1.5;';

        const summaryText = entry.summary || (entry.content ? 'Raw conversation' : 'No summary');
        const truncatedText = summaryText.length > 200 ? summaryText.substring(0, 200) + '...' : summaryText;

        // Render markdown
        // Assuming marked and DOMPurify are available globally as per original App.js
        const rawHtml = marked.parse(truncatedText);
        summary.innerHTML = DOMPurify.sanitize(rawHtml);

        card.appendChild(summary);

        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--primary-color)';
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border-color)';
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });

        // Click to open detail modal
        card.addEventListener('click', () => {
            onClick(entry);
        });

        return card;
    }

    /**
     * Convert mood text to emoji
     * @param {string} mood - Mood text
     * @returns {string|null} Emoji or null
     */
    static getMoodEmoji(mood) {
        if (!mood) return null;

        // If it's already an emoji, return it
        if (/\p{Emoji}/u.test(mood)) {
            return mood;
        }

        // Map mood text to emoji
        const moodMap = {
            'happy': '😊',
            'sad': '😢',
            'anxious': '😰',
            'calm': '😌',
            'excited': '🤩',
            'angry': '😠',
            'grateful': '🙏',
            'neutral': '😐',
            'tired': '😴',
            'energetic': '⚡',
            'confused': '😕',
            'content': '😊',
            'peaceful': '☮️',
            'stressed': '😫',
            'hopeful': '🌟'
        };

        return moodMap[mood.toLowerCase()] || null;
    }
}
