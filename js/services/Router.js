/**
 * Router Service
 * Handles view navigation
 */
export class Router {
    constructor(onRouteChange) {
        this.onRouteChange = onRouteChange;
        this.currentView = 'view-chat';
    }

    /**
     * Switch to a specific view
     * @param {string} viewId - The ID of the view to switch to
     */
    navigateTo(viewId) {
        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const viewElement = document.getElementById(viewId);
        if (viewElement) {
            viewElement.classList.add('active');
        }

        const navItem = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentView = viewId;

        // Notify listener
        if (this.onRouteChange) {
            this.onRouteChange(viewId);
        }
    }
}
