const CACHE_NAME = 'md2pdf-v1.0.0';
const RUNTIME_CACHE = 'md2pdf-runtime';

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/web/index.html',
  '/merge-web/index.html',
  '/katex-web/index.html',
  '/pwa/manifest.json',
  '/pwa/icons/icon-192x192.png',
  '/pwa/icons/icon-512x512.png',
  '/assets/katex/katex.min.css'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中..');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 缓存静态资源');
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, {
          cache: 'reload'
        })));
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[Service Worker] 缓存失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] 删除旧缓存', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非HTTP(S) 请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API 请求使用网络优先策略
  if (url.pathname.startsWith('/api/') || request.method !== 'GET') {
    event.respondWith(networkFirst(request));
    return;
  }

  // 静态资源使用缓存优先策略
  event.respondWith(cacheFirst(request));
});

// 缓存优先策略
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[Service Worker] 从缓存返回', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    // 只缓存成功的响应
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] 获取失败:', request.url, error);
    
    // 返回离线页面
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// 网络优先策略
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    // 缓存成功的响应
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] 网络请求失败，尝试从缓存返回:', request.url);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 后台同步:', event.tag);
  if (event.tag === 'sync-conversions') {
    event.waitUntil(syncConversions());
  }
});

async function syncConversions() {
  // 这里可以实现后台同步转换任务的逻辑
  console.log('[Service Worker] 执行后台同步');
}

// 推送通知
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 收到推送消息');
  
  const options = {
    body: event.data ? event.data.text() : '转换完成!',
    icon: '/pwa/icons/icon-192x192.png',
    badge: '/pwa/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('MD2PDF 通知', options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知被点击');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
