# Icons Directory

This directory contains PWA application icons in various sizes.

## Required Sizes
- 16x16 - Browser favicon
- 32x32 - Browser favicon
- 72x72 - iOS icon
- 96x96 - Standard icon
- 128x128 - Android icon
- 144x144 - Windows tile
- 152x152 - iOS icon (recommended)
- 192x192 - Android icon (recommended)
- 384x384 - Large icon
- 512x512 - Splash screen

## Generate Icons

### Method 1: Browser-based (Recommended)
1. Start the server
2. Visit `http://localhost:PORT/icon-generator.html`
3. Click "生成图标" (Generate Icons)
4. Click "下载所有图标" (Download All Icons)
5. Place downloaded icons in this directory

### Method 2: Node.js Script
```bash
npm install canvas
node generate-icons.js
```

## Icon Requirements
- Format: PNG
- Background: Gradient (#667eea to #764ba2)
- Content: "MD" text on top, "PDF" text below
- Style: Modern, clean design
