/**
 * 浏览器端图标生成器 - 使用 Canvas API
 * 无需 Node.js 依赖，直接在浏览器中生成图标
 */

// 图标尺寸配置
const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 颜色配置
const COLORS = {
  gradient: {
    start: '#667eea',
    end: '#764ba2'
  },
  text: '#ffffff'
};

/**
 * 生成单个尺寸的图标
 */
function generateIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 绘制渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, COLORS.gradient.start);
  gradient.addColorStop(1, COLORS.gradient.end);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 可选：添加圆角效果
  // applyRoundedCorners(ctx, size);

  // 绘制文字
  drawText(ctx, size);

  return canvas;
}

/**
 * 绘制文字内容
 */
function drawText(ctx, size) {
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // "MD" 文字
  const largeFontSize = size * 0.35;
  ctx.font = `bold ${largeFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText('MD', size / 2, size / 2 - largeFontSize * 0.15);

  // "PDF" 文字
  const smallFontSize = size * 0.2;
  ctx.font = `600 ${smallFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText('PDF', size / 2, size / 2 + largeFontSize * 0.5);
}

/**
 * 应用圆角效果（可选）
 */
function applyRoundedCorners(ctx, size) {
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  const radius = size * 0.18;
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * 将 Canvas 转换为 Blob
 */
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

/**
 * 下载单个图标
 */
async function downloadIcon(canvas, size) {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `icon-${size}x${size}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 生成所有图标
 */
function generateAllIcons() {
  const canvases = {};
  
  ICON_SIZES.forEach(size => {
    const canvas = generateIcon(size);
    canvases[size] = canvas;
  });
  
  return canvases;
}

/**
 * 下载所有图标
 */
async function downloadAllIcons(canvases) {
  for (const [size, canvas] of Object.entries(canvases)) {
    await downloadIcon(canvas, size);
    // 添加延迟避免浏览器阻止多次下载
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * 创建预览元素
 */
function createPreviewElement(canvas, size) {
  const container = document.createElement('div');
  container.className = 'icon-preview';
  
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/png');
  img.alt = `Icon ${size}x${size}`;
  
  const label = document.createElement('div');
  label.className = 'icon-size';
  label.textContent = `${size}×${size}`;
  
  container.appendChild(img);
  container.appendChild(label);
  
  return container;
}

/**
 * 显示所有图标预览
 */
function displayPreviews(canvases, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  Object.entries(canvases).forEach(([size, canvas]) => {
    const preview = createPreviewElement(canvas, size);
    container.appendChild(preview);
  });
}

/**
 * 生成 favicon.ico
 * 注意：浏览器中无法直接生成 .ico 文件，建议使用在线工具转换
 */
function generateFavicon(canvas16, canvas32) {
  console.log('提示：浏览器无法直接生成 .ico 文件');
  console.log('请使用 16x16 和 32x32 的 PNG 图标，');
  console.log('并使用在线工具（如 https://www.favicon-generator.org/）转换为 .ico 格式');
}

/**
 * 导出为 ZIP（需要 JSZip 库）
 */
async function exportAsZip(canvases) {
  if (typeof JSZip === 'undefined') {
    console.error('需要 JSZip 库才能导出 ZIP 文件');
    return;
  }

  const zip = new JSZip();
  const iconsFolder = zip.folder('icons');

  for (const [size, canvas] of Object.entries(canvases)) {
    const blob = await canvasToBlob(canvas);
    iconsFolder.file(`icon-${size}x${size}.png`, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'md2pdf-icons.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateIcon,
    generateAllIcons,
    downloadIcon,
    downloadAllIcons,
    displayPreviews,
    exportAsZip
  };
}

// 浏览器全局变量
if (typeof window !== 'undefined') {
  window.IconGenerator = {
    generateIcon,
    generateAllIcons,
    downloadIcon,
    downloadAllIcons,
    displayPreviews,
    exportAsZip,
    ICON_SIZES
  };
}
