#!/usr/bin/env node

/**
 * 通用GUI启动器
 * 支持启动不同的GUI服务器
 */

import { startGUI } from './src/gui.js';
import { startKatexCheckGUI } from './src/katex-gui.js';
import chalk from 'chalk';

// 获取命令行参数
const args = process.argv.slice(2);
const command = args[0];

const USAGE = `
使用方法:
  node gui-launcher.js <command> [options]

命令:
  pdf         启动 Markdown to PDF GUI (端口 3000)
  katex       启动 KaTeX 检查 GUI (端口 3001)
  merge       启动合并 GUI (端口 3001)
  check       启动编号检查 GUI (端口 3002)

选项:
  --port <port>  指定端口号
  --help         显示此帮助信息
`;

async function main() {
  if (!command || command === '--help' || command === '-h') {
    console.log(USAGE);
    process.exit(0);
  }

  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 ? parseInt(args[portIndex + 1]) : null;

  try {
    switch (command) {
      case 'pdf':
        console.log(chalk.cyan.bold(`
┌─────────────────────────────────────────┐
│  🌐 Markdown PDF 可视化界面启动器        │
│  📄→📁 直观转换 | 🔍 实时预览 | 📚 历史管理   │
└─────────────────────────────────────────┘
`));
        await startGUI({ port: port || 3000 });
        console.log(chalk.green('\n✨ PDF GUI服务器启动成功!'));
        console.log(chalk.yellow(`🌍 请在浏览器中访问: http://localhost:${port || 3000}`));
        break;

      case 'katex':
        console.log(chalk.cyan.bold(`
┌─────────────────────────────────────────┐
│  📐 LaTeX公式修复助手 GUI 启动器         │
│  🔧 自动纠错 | 📊 错误统计 | 🎯 精准修复     │
└─────────────────────────────────────────┘
`));
        const katexGui = await startKatexCheckGUI({ port: port || 3001 });
        console.log(chalk.green('\n✨ KaTeX GUI服务器启动成功!'));
        console.log(chalk.yellow(`🌍 请在浏览器中访问: http://localhost:${port || 3001}`));
        break;

      case 'merge':
        console.log(chalk.red('合并GUI需要单独的服务器文件，请使用: node merge-gui-server.js'));
        process.exit(1);
        break;

      case 'check':
        console.log(chalk.red('编号检查GUI需要单独的服务器文件，请使用: node check-missing-numbers-gui-server.js'));
        process.exit(1);
        break;

      default:
        console.error(chalk.red(`未知命令: ${command}`));
        console.log(USAGE);
        process.exit(1);
    }

    console.log(chalk.gray('\n按 Ctrl+C 停止服务器\n'));

    // 优雅地处理退出
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 正在关闭服务器...'));
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red('❌ 启动失败:'), error.message);
    process.exit(1);
  }
}

main();