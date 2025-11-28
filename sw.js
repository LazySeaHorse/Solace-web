const CACHE_NAME = 'solace-v3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/reset.css',
    './css/tokens.css',
    './css/atoms.css',
    './css/molecules.css',
    './css/organisms.css',
    './css/animations.css',
    './css/calendar.css',
    './js/main.js',
    './js/App.js',
    // Services
    './js/services/StorageManager.js',
    './js/services/GeminiClient.js',
    './js/services/Router.js',
    './js/services/ThemeManager.js',
    // Controllers
    './js/controllers/ChatController.js',
    './js/controllers/JournalController.js',
    // Views
    './js/views/ChatView.js',
    './js/views/JournalView.js',
    './js/views/InsightsView.js',
    // Utils
    './js/utils/MarkdownParser.js',
    // Components - Atoms
    './js/components/atoms/Button.js',
    './js/components/atoms/Icon.js',
    './js/components/atoms/Input.js',
    // Components - Molecules
    './js/components/molecules/DayEntryList.js',
    './js/components/molecules/InputArea.js',
    './js/components/molecules/JournalEntry.js',
    './js/components/molecules/CalendarGrid.js',
    './js/components/molecules/CalendarHeader.js',
    './js/components/molecules/JournalSearch.js',
    './js/components/molecules/SearchResultCard.js',
    './js/components/molecules/MessageBubble.js',
    './js/components/molecules/NavItem.js',
    './js/components/molecules/SuggestionChip.js',
    // Components - Organisms
    './js/components/organisms/Calendar.js',
    './js/components/organisms/ChatContainer.js',
    './js/components/organisms/EmotionModal.js',
    './js/components/organisms/EntryDetailModal.js',
    './js/components/organisms/Header.js',
    './js/components/organisms/Navigation.js',
    './js/components/organisms/SettingsModal.js',
    './js/components/organisms/InsightsView.js'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Google Fonts or Gemini API)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise fetch from network
            return fetch(event.request).then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone response to cache it
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});