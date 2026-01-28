const CACHE_NAME = 'inventory-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear:', err))
  );
  self.skipWaiting();
});

// Activar el Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network First, Fall back to Cache
self.addEventListener('fetch', event => {
  // No cachear solicitudes POST, DELETE, PUT
  if (event.request.method !== 'GET') {
    return;
  }

  // Para APIs de Supabase, usar Network First
  if (event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cachear respuestas exitosas
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla, intentar desde cache
          return caches.match(event.request)
            .then(response => response || new Response('Offline - No hay datos en caché', { status: 503 }));
        })
    );
    return;
  }

  // Para otros recursos, usar Cache First
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            return caches.match('/index.html');
          });
      })
  );
});

// Sincronización en background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-inventory') {
    event.waitUntil(syncInventory());
  }
});

async function syncInventory() {
  try {
    // Aquí iría la lógica para sincronizar datos cuando vuelva la conexión
    console.log('Sincronizando inventario...');
  } catch (error) {
    console.error('Error al sincronizar:', error);
  }
}

// Notificaciones push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: 'inventory-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Gestor de Inventario', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
