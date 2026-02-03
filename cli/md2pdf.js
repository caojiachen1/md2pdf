#!/usr/bin/env node

/**
 * Markdown LaTeX to PDF Converter - 主入口文�?
 * 
 * 功能：将包含LaTeX数学公式的Markdown文件转换为PDF
 * 使用：node md2pdf.js <markdown文件路径> [输出PDF路径]
 */

import { runCLI } from '../src/cli.js';

// 运行CLI应用
runCLI();
