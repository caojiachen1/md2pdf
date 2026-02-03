# PWA 相关文件

此目录包含 Progressive Web App (PWA) 的所有相关文件。

## 文件说明

- `manifest.json` - PWA 应用清单，定义应用名称、图标、启动URL等
- `service-worker.js` - Service Worker 脚本，负责缓存和离线功能
- `pwa-register.js` - PWA 注册脚本，在浏览器中注册 Service Worker
- `icons/` - PWA 应用图标，各种尺寸的 PNG 文件

## 使用方法

在 HTML 文件中添加以下标签来启用 PWA：

```html
<!-- 在 <head> 中 -->
<link rel="manifest" href="/pwa/manifest.json">

<!-- 在 </body> 之前 -->
<script src="/pwa/pwa-register.js"></script>
```

## 图标生成

图标文件由 `generate-icons.js` 脚本生成，存储在 `icons/` 目录中。