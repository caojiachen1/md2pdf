# GUI 服务器

此目录包含所有图形用户界面 (GUI) 服务器。

## 文件说明

- `gui-launcher.js` - GUI启动器，支持启动不同的GUI服务器
- `merge-gui-server.js` - 合并Markdown文件的GUI服务器
- `check-missing-numbers-gui-server.js` - 检查缺失编号的GUI服务器

## 使用方法

```bash
# 启动主GUI (PDF转换)
node gui/gui-launcher.js pdf

# 启动LaTeX检查GUI
node gui/gui-launcher.js katex

# 启动合并GUI
node gui/merge-gui-server.js

# 启动编号检查GUI
node gui/check-missing-numbers-gui-server.js
```

或者使用npm scripts：

```bash
npm run gui          # 启动PDF转换GUI
npm run latex-fix    # 启动LaTeX检查GUI
npm run merge-gui    # 启动合并GUI
npm run check-numbers-gui  # 启动编号检查GUI
```

## 端口说明

- PDF转换GUI: http://localhost:3000
- LaTeX检查GUI: http://localhost:3001
- 合并GUI: http://localhost:3001
- 编号检查GUI: http://localhost:3002