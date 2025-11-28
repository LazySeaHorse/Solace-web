import { InsightsView as InsightsOrganism } from '../components/organisms/InsightsView.js';

/**
 * InsightsView
 * Manages the Insights UI
 */
export class InsightsView {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        this.organism = null;
        this.container = null;
    }

    /**
     * Initialize and return the view element
     * @returns {HTMLElement}
     */
    render() {
        this.container = document.createElement('div');
        this.container.id = 'view-insights';
        this.container.className = 'view';

        this.organism = new InsightsOrganism(this.dataProvider);
        this.container.appendChild(this.organism.element);

        return this.container;
    }

    /**
     * Refresh the insights data
     */
    refresh() {
        if (this.organism) {
            this.organism.render();
        }
    }
}
