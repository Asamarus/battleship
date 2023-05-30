var version = 1; //change version to update service worker
var cacheName = 'Battleship-app';
var filesToCache = [
	'/',
	'/static/apple-touch-icon.png',
	'/static/favicon.ico',
	'/dist/main.js',
	'/dist/main.css',
	'/assets/fonts/material/material.woff',
	'/assets/fonts/material/material.woff2',
	'/assets/fonts/material/material.ttf',
	'/assets/fonts/material/material.eot',
	'/assets/fonts/material/material.svg',
	'/img/icons/bonus_laser_horizontal.png',
	'/img/icons/penalty_mirror.png',
	'/img/icons/bonus_move_ship.png',
	'/img/icons/bonus_extra_shot_1.png',
	'/img/icons/bonus_radar.png',
	'/img/icons/bonus_superblast.png',
	'/img/icons/bonus_laser_vertical.png',
	'/img/icons/penalty_question.png',
	'/img/icons/bonus_repair_ship.png',
	'/img/icons/penalty_ricochet.png',
	'/img/icons/bonus_extra_shot_2.png',
	'/img/flags/ru.svg',
	'/img/flags/en.svg',
	'/img/flags/lv.svg',
	'/img/ships/vertical_1.png',
	'/img/ships/vertical_3.png',
	'/img/ships/vertical_4.png',
	'/img/ships/horizontal_4.png',
	'/img/ships/horizontal_1.png',
	'/img/ships/horizontal_2.png',
	'/img/ships/horizontal_3.png',
	'/img/ships/vertical_2.png',
	'/img/field/missed.png',
	'/img/field/fire.gif',
	'/img/misc/cross.png',
	'/sounds/radar.mp3',
	'/sounds/lose.mp3',
	'/sounds/killed.mp3',
	'/sounds/explosion.mp3',
	'/sounds/blast.mp3',
	'/sounds/win.mp3',
	'/sounds/shot.mp3',
	'/sounds/game_started.mp3',
];

self.addEventListener('install', function(event) {
	console.log('[ServiceWorker] Install');
	event.waitUntil(
		caches
			.open(cacheName)
			.then(function(cache) {
				console.log('[ServiceWorker] Caching app shell');
				//add all files to app cache ignoring (disk cache)
				return cache.addAll(
					filesToCache.map(url => new Request(url, { cache: 'no-cache' })),
				);
			})
			.then(function() {
				return self.skipWaiting(); //force to update service worker to new version
			}),
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
	//use app cache if available
	event.respondWith(
		caches.match(event.request, { ignoreSearch: true }).then(response => {
			return response || fetch(event.request);
		}),
	);
});
