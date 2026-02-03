# CLI 工具

此目录包含所有命令行界面 (CLI) 工具。

## 文件说明

- `md2pdf.js` - 主CLI工具，将Markdown文件转换为PDF
- `merge-md-to-pdf.js` - 合并文件夹中的Markdown文件并转换为PDF
- `katex-check.js` - 检查和修复LaTeX数学公式错误

## 使用方法

```bash
# 转换单个文件
node cli/md2pdf.js input.md

# 合并文件夹
node cli/merge-md-to-pdf.js ./docs

# 检查LaTeX公式
node cli/katex-check.js ./docs
```

或者使用npm scripts：

```bash
npm run convert
npm run merge
```