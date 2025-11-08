const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 图标尺寸
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 确保 icons 目录存在
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 开始生成 PWA 图标...\n');

// 生成每个尺寸的图标
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // 添加圆角效果（可选）
    // ctx.globalCompositeOperation = 'destination-in';
    // ctx.beginPath();
    // ctx.roundRect(0, 0, size, size, size * 0.2);
    // ctx.fill();
    // ctx.globalCompositeOperation = 'source-over';

    // 文字设置
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // MD 文字
    const fontSize = size * 0.35;
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText('MD', size / 2, size / 2 - fontSize * 0.15);

    // PDF 文字（更小）
    const smallFontSize = size * 0.2;
    ctx.font = `600 ${smallFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillText('PDF', size / 2, size / 2 + fontSize * 0.5);

    // 保存图标
    const fileName = `icon-${size}x${size}.png`;
    const filePath = path.join(iconsDir, fileName);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ 已生成: ${fileName}`);
});

console.log('\n🎉 所有图标生成完成！');
console.log(`📁 图标保存在: ${iconsDir}`);
