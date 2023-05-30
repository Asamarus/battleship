var version = 1; //change version to update service worker
var cacheName = 'Battleship-app';
var filesToCache = [
  '/battleship',
  '/battleship/static/apple-touch-icon.png',
  '/battleship/static/favicon.ico',
  '/battleship/dist/main.js',
  '/battleship/dist/main.css',
  '/battleship/assets/fonts/material/material.woff',
  '/battleship/assets/fonts/material/material.woff2',
  '/battleship/assets/fonts/material/material.ttf',
  '/battleship/assets/fonts/material/material.eot',
  '/battleship/assets/fonts/material/material.svg',
  '/battleship/img/icons/bonus_laser_horizontal.png',
  '/battleship/img/icons/penalty_mirror.png',
  '/battleship/img/icons/bonus_move_ship.png',
  '/battleship/img/icons/bonus_extra_shot_1.png',
  '/battleship/img/icons/bonus_radar.png',
  '/battleship/img/icons/bonus_superblast.png',
  '/battleship/img/icons/bonus_laser_vertical.png',
  '/battleship/img/icons/penalty_question.png',
  '/battleship/img/icons/bonus_repair_ship.png',
  '/battleship/img/icons/penalty_ricochet.png',
  '/battleship/img/icons/bonus_extra_shot_2.png',
  '/battleship/img/flags/ru.svg',
  '/battleship/img/flags/en.svg',
  '/battleship/img/flags/lv.svg',
  '/battleship/img/ships/vertical_1.png',
  '/battleship/img/ships/vertical_3.png',
  '/battleship/img/ships/vertical_4.png',
  '/battleship/img/ships/horizontal_4.png',
  '/battleship/img/ships/horizontal_1.png',
  '/battleship/img/ships/horizontal_2.png',
  '/battleship/img/ships/horizontal_3.png',
  '/battleship/img/ships/vertical_2.png',
  '/battleship/img/field/missed.png',
  '/battleship/img/field/fire.gif',
  '/battleship/img/misc/cross.png',
  '/battleship/sounds/radar.mp3',
  '/battleship/sounds/lose.mp3',
  '/battleship/sounds/killed.mp3',
  '/battleship/sounds/explosion.mp3',
  '/battleship/sounds/blast.mp3',
  '/battleship/sounds/win.mp3',
  '/battleship/sounds/shot.mp3',
  '/battleship/sounds/game_started.mp3',
];

self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches
      .open(cacheName)
      .then(function (cache) {
        console.log('[ServiceWorker] Caching app shell');
        //add all files to app cache ignoring (disk cache)
        return cache.addAll(
          filesToCache.map((url) => new Request(url, { cache: 'no-cache' })),
        );
      })
      .then(function () {
        return self.skipWaiting(); //force to update service worker to new version
      }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  //use app cache if available
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
