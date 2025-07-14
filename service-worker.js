const CACHE_NAME = 'driver-frontend-cache-v1';
const urlsToCache = [
	// FILES
	'./',
	'./index.html',
	'./src/index.js',
	'./src/main/main.html',
	'./src/main/main.js',
	'./src/send/send.html',
	'./src/send/send.js',

	'./manifest.json',

	// ASSETS
	'./assets/backgrounds/background1.jpg',
	'./assets/backgrounds/background2.jpg',
	'./assets/icons/icon-192x192.png',
	'./assets/icons/icon-512x512.png',

	// FONTS
	'https://fonts.googleapis.com/css2?family=Manufacturing+Consent&display=swap',
	'https://fonts.gstatic.com/s/manufacturingconsent/v1/N0bL2TVONuFkPkuHfiECSLCwuZS-D-IsakikRw.ttf'
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