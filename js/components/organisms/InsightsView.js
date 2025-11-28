import { Icon } from '../atoms/Icon.js';

export class InsightsView {
    constructor(getEntriesFn) {
        this.getEntries = getEntriesFn;
        this.element = document.createElement('div');
        this.element.className = 'view-content';
        this.element.style.padding = '20px';
        this.element.style.maxWidth = '800px';
        this.element.style.margin = '0 auto';
    }

    async render() {
        this.element.innerHTML = '';
        const entries = await this.getEntries();

        // Title
        const title = document.createElement('h2');
        title.textContent = 'Insights';
        title.style.marginBottom = '24px';
        this.element.appendChild(title);

        if (entries.length === 0) {
            this.element.innerHTML += '<p style="color:var(--text-secondary)">No entries yet. Start journaling to see your insights!</p>';
            return;
        }

        // Stats Grid
        const statsGrid = document.createElement('div');
        statsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 32px;';

        const totalEntries = entries.length;
        const uniqueDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;

        statsGrid.appendChild(this.createStatCard('Total Entries', totalEntries));
        statsGrid.appendChild(this.createStatCard('Journaling Days', uniqueDays));

        this.element.appendChild(statsGrid);

        // Mood Chart
        const moodCounts = {};
        entries.forEach(e => {
            if (e.mood) {
                const mood = e.mood.toLowerCase();
                moodCounts[mood] = (moodCounts[mood] || 0) + 1;
            }
        });

        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = 'background: var(--surface-color); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border-color);';

        const chartTitle = document.createElement('h3');
        chartTitle.textContent = 'Mood Distribution';
        chartTitle.style.marginBottom = '16px';
        chartContainer.appendChild(chartTitle);

        // Simple CSS Bar Chart
        const maxCount = Math.max(...Object.values(moodCounts), 1);

        Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by frequency
            .forEach(([mood, count]) => {
                const row = document.createElement('div');
                row.style.cssText = 'display: flex; align-items: center; margin-bottom: 12px;';

                const label = document.createElement('div');
                label.style.cssText = 'width: 100px; text-transform: capitalize; font-size: var(--font-size-sm);';
                label.textContent = mood;

                const barContainer = document.createElement('div');
                barContainer.style.cssText = 'flex: 1; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;';

                const bar = document.createElement('div');
                const width = (count / maxCount) * 100;
                bar.style.cssText = `width: ${width}%; height: 100%; background: var(--primary-color); border-radius: 4px;`;

                const countLabel = document.createElement('div');
                countLabel.style.cssText = 'width: 30px; text-align: right; font-size: var(--font-size-xs); color: var(--text-secondary); margin-left: 8px;';
                countLabel.textContent = count;

                barContainer.appendChild(bar);
                row.appendChild(label);
                row.appendChild(barContainer);
                row.appendChild(countLabel);
                chartContainer.appendChild(row);
            });

        this.element.appendChild(chartContainer);
    }

    createStatCard(label, value) {
        const card = document.createElement('div');
        card.style.cssText = 'background: var(--surface-color); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); text-align: center;';

        const valEl = document.createElement('div');
        valEl.textContent = value;
        valEl.style.cssText = 'font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 4px;';

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';

        card.appendChild(valEl);
        card.appendChild(labelEl);
        return card;
    }
}