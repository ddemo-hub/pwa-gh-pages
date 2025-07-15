const CACHE_NAME = 'driver-frontend-cache-v1';
const FONT_STYLE_CACHE = 'google-fonts-stylesheets';
const FONT_FILE_CACHE = 'google-fonts-webfonts';

const urlsToCache = [
    // FILES
    './',
    './index.html',
    './src/index.js',

    './src/pages/main/main.html',
    './src/pages/main/main.js',
    './src/pages/send/send.html',
    './src/pages/send/send.js',

    './src/utils/database.js',

    './manifest.json',

    // ASSETS
    './assets/backgrounds/background1.jpg',
    './assets/backgrounds/background2.jpg',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',

    // FONT CSS (only CSS, fonts handled dynamically)
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Michroma&display=swap',
];

// ✅ Install: Cache essential app files + Google Fonts CSS
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// ✅ Fetch: Add runtime caching for Google Fonts
self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);

    // ✅ Google Fonts CSS (fonts.googleapis.com)
    if (requestURL.origin === 'https://fonts.googleapis.com') {
        event.respondWith(
            caches.open(FONT_STYLE_CACHE).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => cache.match(event.request));
            })
        );
        return; // Stop further processing
    }

    // ✅ Google Fonts font files (fonts.gstatic.com)
    if (requestURL.origin === 'https://fonts.gstatic.com') {
        event.respondWith(
            caches.open(FONT_FILE_CACHE).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => cache.match(event.request));
            })
        );
        return; // Stop further processing
    }

    // ✅ Default: Cache-first strategy for app assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// ✅ Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME, FONT_STYLE_CACHE, FONT_FILE_CACHE];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
