// PWA 注册和管理脚本
(function() {
  'use strict';

  // 检查浏览器是否支持 Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('当前浏览器不支持 Service Worker');
    return;
  }

  // 注册 Service Worker
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('✅ Service Worker 注册成功:', registration.scope);

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 发现新的 Service Worker');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新的 Service Worker 已安装，提示用户刷新
            showUpdateNotification(registration);
          }
        });
      });

      // 检查更新
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 每小时检查一次

    } catch (error) {
      console.error('❌ Service Worker 注册失败:', error);
    }
  }

  // 显示更新通知
  function showUpdateNotification(registration) {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-content">
        <span>📱 发现新版本！</span>
        <button class="pwa-update-btn">立即更新</button>
        <button class="pwa-dismiss-btn">稍后</button>
      </div>
    `;

    document.body.appendChild(notification);

    // 延迟显示动画
    setTimeout(() => notification.classList.add('show'), 100);

    // 更新按钮
    notification.querySelector('.pwa-update-btn').addEventListener('click', () => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });

    // 关闭按钮
    notification.querySelector('.pwa-dismiss-btn').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // 安装提示
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💾 可以安装 PWA');
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
  });

  // 显示安装提示
  function showInstallPromotion() {
    const installBanner = document.createElement('div');
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">📱</div>
        <div class="pwa-install-text">
          <div class="pwa-install-title">安装应用</div>
          <div class="pwa-install-desc">安装到主屏幕，获得更好的体验</div>
        </div>
        <button class="pwa-install-btn">安装</button>
        <button class="pwa-close-btn">×</button>
      </div>
    `;

    document.body.appendChild(installBanner);
    setTimeout(() => installBanner.classList.add('show'), 100);

    // 安装按钮
    installBanner.querySelector('.pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`用户选择: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('✅ 用户接受安装');
      } else {
        console.log('❌ 用户拒绝安装');
      }

      deferredPrompt = null;
      installBanner.classList.remove('show');
      setTimeout(() => installBanner.remove(), 300);
    });

    // 关闭按钮
    installBanner.querySelector('.pwa-close-btn').addEventListener('click', () => {
      installBanner.classList.remove('show');
      setTimeout(() => installBanner.remove(), 300);
    });
  }

  // 监听安装完成
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA 安装成功');
    deferredPrompt = null;
  });

  // 检测是否在 PWA 模式下运行
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  if (isStandalone()) {
    console.log('🚀 应用运行在独立模式');
    document.body.classList.add('pwa-standalone');
  }

  // 离线状态提示
  function updateOnlineStatus() {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.classList.toggle('pwa-offline', !navigator.onLine);
    
    if (!navigator.onLine) {
      showOfflineNotification();
    }
  }

  function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-offline-notification';
    notification.innerHTML = `
      <div class="pwa-offline-content">
        <span>📡 当前离线，使用缓存数据</span>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // 页面加载完成后注册
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
  } else {
    registerServiceWorker();
  }

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .pwa-update-notification,
    .pwa-install-banner,
    .pwa-offline-notification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      z-index: 10000;
      opacity: 0;
      transition: all 0.3s ease;
      max-width: 90%;
      width: 500px;
    }

    .pwa-update-notification.show,
    .pwa-install-banner.show,
    .pwa-offline-notification.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .pwa-update-content,
    .pwa-install-content,
    .pwa-offline-content {
      background: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .pwa-install-content {
      padding: 20px;
    }

    .pwa-install-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .pwa-install-text {
      flex: 1;
    }

    .pwa-install-title {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 4px;
      color: #333;
    }

    .pwa-install-desc {
      font-size: 0.9rem;
      color: #666;
    }

    .pwa-update-btn,
    .pwa-install-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .pwa-update-btn:hover,
    .pwa-install-btn:hover {
      transform: scale(1.05);
    }

    .pwa-dismiss-btn,
    .pwa-close-btn {
      background: #e2e8f0;
      color: #4a5568;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .pwa-close-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 1.5rem;
      line-height: 1;
    }

    .pwa-dismiss-btn:hover,
    .pwa-close-btn:hover {
      background: #cbd5e0;
    }

    .pwa-offline-content {
      background: #fef3c7;
      color: #92400e;
      justify-content: center;
      font-weight: 500;
    }

    .pwa-standalone .header {
      padding-top: max(20px, env(safe-area-inset-top));
    }

    .pwa-offline {
      filter: grayscale(0.3);
    }

    @media (max-width: 640px) {
      .pwa-update-notification,
      .pwa-install-banner,
      .pwa-offline-notification {
        width: calc(100% - 40px);
        top: 10px;
      }

      .pwa-install-content {
        flex-wrap: wrap;
      }

      .pwa-install-icon {
        font-size: 2rem;
      }

      .pwa-install-title {
        font-size: 1rem;
      }

      .pwa-install-desc {
        font-size: 0.85rem;
      }

      .pwa-update-btn,
      .pwa-install-btn,
      .pwa-dismiss-btn {
        padding: 8px 16px;
        font-size: 0.9rem;
      }
    }
  `;
  document.head.appendChild(style);

})();
