# Markdown LaTeX to PDF Converter

Convert Markdown files with LaTeX math formulas to beautiful PDFs.

## Features

- LaTeX math formulas (inline and block)
- KaTeX local rendering (fonts inlined)
- Auto fallback to MathJax when KaTeX fails (or force MathJax), fully local (no CDN)
- **KaTeX formula validation and auto-correction with LLM integration**
- Professional PDF formatting
- Code syntax highlighting
- **Font size customization (small, medium, large, xlarge or custom values)**
- **Chinese font support (宋体、黑体、楷体、仿宋、微软雅黑等)**
- **Font weight control (light, normal, medium, semibold, bold, black)**
- **Line spacing control (tight, normal, loose, relaxed or custom values)**
- **Paragraph spacing control (tight, normal, loose, relaxed or custom values)**
- **Math formula spacing control (tight, normal, loose, relaxed or custom values)**
- Modular architecture
- CLI and programmatic usage
- **📱 PWA support - Install on mobile devices, work offline**
- **🌐 Visual web interface with drag & drop**

## Installation

```bash
npm install
```

## KaTeX Formula Validation

Before converting your Markdown to PDF, you can validate and auto-correct LaTeX formulas using our KaTeX checker.

### Basic Usage

```bash
# Check a single file
node cli/katex-check.js document.md

# Check multiple files
node cli/katex-check.js file1.md file2.md file3.md

# Check a directory
node cli/katex-check.js ./docs

# Mixed mode (directory + files)
node cli/katex-check.js ./docs README.md CHANGELOG.md
```

### Advanced Options

```bash
# Quick check (no detailed error info)
node cli/katex-check.js document.md --quick

# Detailed error information
node cli/katex-check.js document.md --detailed

# Auto-fix with LLM (requires LMStudio)
node cli/katex-check.js document.md --auto-fix

# Auto-fix with auto-confirmation
node cli/katex-check.js document.md --auto-fix --auto-confirm

# Non-recursive directory scan
node cli/katex-check.js ./docs --no-recursive

# Custom concurrency
node cli/katex-check.js ./docs --concurrency=8

# Combined options
# Auto-fix with LLM (requires LMStudio or Ollama)
node cli/katex-check.js ./docs README.md --detailed --auto-fix --concurrency=4
```

### LLM Auto-Correction Setup

The auto-correction feature supports both LMStudio and Ollama:

#### Option 1: LMStudio
1. Install and run [LMStudio](https://lmstudio.ai/)
2. Load a thinking model (e.g., `qwen/qwen3-4b-thinking-2507`)
3. Start the local server at `http://localhost:1234`

#### Option 2: Ollama (Recommended)
1. Install [Ollama](https://ollama.ai/)
2. Download a model: `ollama pull qwen2.5:7b`
3. Start the service: `ollama serve` (runs on `http://localhost:11434`)

The system will automatically detect available providers and use the best option. The LLM will analyze LaTeX errors and suggest corrections, which you can review and apply.

**Supported Models:**
- Ollama: `qwen2.5:7b`, `llama3.1:8b`, `gemma2:9b`, etc.
- LMStudio: `qwen/qwen3-4b-thinking-2507`, etc.
```

### GUI & Web Interfaces

This repository includes visual web UIs and PWA support for interactive workflows.

- `katex-web/` - KaTeX 公式修复的单页 Web UI（可直接打开 `katex-web/index.html` 或通过静态服务器访问）。
- `merge-web/` - Markdown 合并与预览的 Web UI。
- `web/` - 主站点与轻量 GUI（包含文件上传与转换演示）。

常用脚本：

- 启动 PDF GUI：

```bash
npm run gui
```

- 启动合并 GUI：

```bash
npm run merge-gui
```

- 启动或打开 KaTeX 公式修复界面（通过 GUI Launcher）：

```bash
npm run latex-fix
# 或
npm run formula-fix
```

PWA：在启动任一 GUI 服务器并打开页面后，可在浏览器中安装为应用（Add to Home Screen / Install）。

## CLI Usage

```bash
# Basic conversion
node cli/md2pdf.js input.md

# Custom output
node cli/md2pdf.js input.md output.pdf

# HTML output
node cli/md2pdf.js input.md --format html

# Choose math engine
node cli/md2pdf.js input.md output.pdf --math-engine auto     # default, KaTeX first, fallback to MathJax
node cli/md2pdf.js input.md output.pdf --math-engine katex    # force KaTeX (offline)
node cli/md2pdf.js input.md output.pdf --math-engine mathjax  # force MathJax (higher compatibility)

# MathJax is rendered locally on Node side; no CDN needed

# Custom margins
node cli/md2pdf.js input.md --margin 25mm

# Landscape orientation
node cli/md2pdf.js input.md --landscape

# Font size options
node cli/md2pdf.js input.md --font-size small    # 12px
node cli/md2pdf.js input.md --font-size medium   # 14px (default)
node cli/md2pdf.js input.md --font-size large    # 16px
node cli/md2pdf.js input.md --font-size xlarge   # 18px
node cli/md2pdf.js input.md --font-size 20px     # Custom size

# Chinese font options
node cli/md2pdf.js input.md --chinese-font auto      # Auto selection (default)
node cli/md2pdf.js input.md --chinese-font simsun    # 宋体 (SimSun)
node cli/md2pdf.js input.md --chinese-font simhei    # 黑体 (SimHei)
node cli/md2pdf.js input.md --chinese-font simkai    # 楷体 (KaiTi)
node cli/md2pdf.js input.md --chinese-font fangsong  # 仿宋 (FangSong)
node cli/md2pdf.js input.md --chinese-font yahei     # 微软雅黑 (Microsoft YaHei)

# Font weight options
node cli/md2pdf.js input.md --font-weight light      # 细体 (300)
node cli/md2pdf.js input.md --font-weight normal     # 正常 (400, default)
node cli/md2pdf.js input.md --font-weight medium     # 中等 (500)
node cli/md2pdf.js input.md --font-weight semibold   # 半粗体(600)
node cli/md2pdf.js input.md --font-weight bold       # 粗体 (700)
node cli/md2pdf.js input.md --font-weight black      # 超粗体(900)
node cli/md2pdf.js input.md --font-weight 600        # Custom weight

# Line spacing options
node cli/md2pdf.js input.md --line-spacing tight     # 紧密行间距(1.2)
node cli/md2pdf.js input.md --line-spacing normal    # 正常行间距(1.6, default)
node cli/md2pdf.js input.md --line-spacing loose     # 宽松行间距(2.0)
node cli/md2pdf.js input.md --line-spacing relaxed   # 极宽松行间距 (2.4)
node cli/md2pdf.js input.md --line-spacing 1.8       # Custom line height

# Paragraph spacing options
node cli/md2pdf.js input.md --paragraph-spacing tight     # 紧密段落间距 (0.5em)
node cli/md2pdf.js input.md --paragraph-spacing normal    # 正常段落间距 (1em, default)
node cli/md2pdf.js input.md --paragraph-spacing loose     # 宽松段落间距 (1.5em)
node cli/md2pdf.js input.md --paragraph-spacing relaxed   # 极宽松段落间距(2em)
node cli/md2pdf.js input.md --paragraph-spacing 1.2em     # Custom spacing

# Math formula spacing options
node cli/md2pdf.js input.md --math-spacing tight     # 紧密公式间距 (10px)
node cli/md2pdf.js input.md --math-spacing normal    # 正常公式间距 (20px, default)
node cli/md2pdf.js input.md --math-spacing loose     # 宽松公式间距 (30px)
node cli/md2pdf.js input.md --math-spacing relaxed   # 极宽松公式间距(40px)
node cli/md2pdf.js input.md --math-spacing 25px      # Custom spacing

# Combined options
node cli/md2pdf.js input.md --font-size large --chinese-font yahei --font-weight semibold --line-spacing loose --paragraph-spacing relaxed --math-spacing loose --margin 30mm

# Help
node cli/md2pdf.js --help
```

## Programmatic Usage

### Simple conversion

```javascript
import { convertMarkdownToPdf, convertMarkdownToHtml } from './src/index.js';

// Convert to PDF
await convertMarkdownToPdf('input.md', 'output.pdf');

// Convert to HTML
await convertMarkdownToHtml('input.md', 'output.html');
```

### Advanced usage

```javascript
import { MarkdownToPdfConverter } from './src/index.js';

const converter = new MarkdownToPdfConverter();

await converter.convert({
  input: 'input.md',
  output: 'output.pdf',
  format: 'pdf',
  pdfOptions: {
    format: 'A4',
    margin: { top: '25mm', bottom: '25mm' },
    landscape: false
  },
  styleOptions: {
    fontSize: '16px',
    chineseFont: 'yahei',
    fontWeight: 'medium',
    lineSpacing: 'loose',
    paragraphSpacing: '1.5em',
    mathSpacing: '25px',
    mathEngine: 'auto'
  }
});

await converter.close();
```

## Math Formula Support

- **Inline**: `$E = mc^2$` or `\(E = mc^2\)`
- **Block**: `$$E = mc^2$$` or `\[E = mc^2\]`

### KaTeX Validation
Before converting to PDF, use the KaTeX checker to validate your formulas:
- Detects syntax errors and unsupported commands
- Provides detailed error messages with line numbers
- Supports auto-correction with LLM integration (LMStudio & Ollama)
- Handles single files, multiple files, or entire directories

### Fallback behavior
- When KaTeX throws on unsupported commands, we render with MathJax (server-side) and embed CHTML directly.
- No network required; PDF export only waits a small delay for layout stabilization.

## 📱 PWA Support

This application now supports Progressive Web App (PWA) features:

### Features
- **📲 Install to home screen** - Works like a native app on mobile devices
- **🔄 Offline support** - Continue working without internet connection
- **⚡Fast loading** - Cached resources load instantly
- **🎨 Native feel** - Full-screen experience without browser UI
- **🔔 Notifications** - (Coming soon) Get notified when conversions complete

### Installation

#### Mobile (iOS/Android)
1. Start any GUI server (e.g., `npm run gui`)
2. Open in browser (Chrome/Safari)
3. Tap "Install" banner or "Add to Home Screen"

#### Desktop (Chrome/Edge)
1. Start any GUI server
2. Click the install icon (🔗) in the address bar
3. Click "Install"

### Generate PWA Icons
```bash
# Method 1: Browser-based (no dependencies)
npm run gui
# Visit http://localhost:3000/icon-generator.html
# Click "生成图标" and "下载所有图标"

# Method 2: Node.js script (requires canvas)
npm install canvas
node generate-icons.js
```

For detailed PWA documentation, see [PWA-README.md](./PWA-README.md)

## Project Structure

```
LICENSE
package.json
README.md
assets/                # 打包的静态资源（KaTeX 字体等）
cli/                   # 命令行工具与脚本
gui/                   # GUI 启动器与服务脚本
katex-web/             # KaTeX 公式修复的单页 Web UI
merge-web/             # Markdown 合并/预览 Web UI
PWA/                   # PWA 相关文件与资源
src/                   # 核心转换模块（converter、renderer、template 等）
web/                   # 主站点示例与轻量前端
```
