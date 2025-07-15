const CACHE_NAME = 'driver-frontend-cache-v1';
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

	// FONTS
	
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}
				return fetch(event.request);
			})
	);
});

self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
}); 