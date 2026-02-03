/**
 * 通用工具函数模块
 */

import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getLocalKatexCssWithInlineFonts } from './katex-assets.js';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * HTML转义函数
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的HTML安全文本
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 正则表达式转义函数
 * @param {string} string - 需要转义的字符串
 * @returns {string} 转义后的正则表达式安全字符串
 */
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 生成输出文件路径
 * @param {string} inputPath - 输入文件路径
 * @param {string} extension - 输出文件扩展名
 * @returns {Promise<string>} 输出文件路径
 */
export async function getOutputPath(inputPath, extension) {
  const path = await import('path');
  const parsed = path.parse(inputPath);
  return path.join(parsed.dir, `${parsed.name}.${extension}`);
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 文件是否存在
 */
export async function fileExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath - 目录路径
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * 获取本地 KaTeX CSS 内容（使用内联字体）
 * @returns {Promise<string>} KaTeX CSS 内容
 */
export async function getLocalKatexCss() {
  return await getLocalKatexCssWithInlineFonts();
}

/**
 * 从文件名中提取数字
 * @param {string} filename - 文件名
 * @returns {Array} 数字数组
 */
export function extractNumbers(filename) {
  const numbers = filename.match(/\d+/g);
  return numbers ? numbers.map(num => parseInt(num, 10)) : [];
}

/**
 * 从文件名中提取主要数字（通常是第一个或最大的数字）
 * @param {string} filename - 文件名
 * @param {string} strategy - 提取策略: 'first' | 'max'
 * @returns {number|null} 主要数字
 */
export function extractMainNumber(filename, strategy = 'max') {
  const numbers = extractNumbers(filename);
  if (numbers.length === 0) return null;
  
  if (strategy === 'first') {
    return numbers[0];
  } else {
    return Math.max(...numbers);
  }
}

/**
 * 自然排序比较函数，正确处理数字顺序
 * @param {string} a - 第一个文件名
 * @param {string} b - 第二个文件名
 * @returns {number} 排序结果
 */
export function naturalSort(a, b) {
  // 将文件名分解为数字和非数字部分
  const regex = /(\d+|\D+)/g;
  const aParts = a.match(regex) || [];
  const bParts = b.match(regex) || [];
  
  const maxLength = Math.max(aParts.length, bParts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] || '';
    const bPart = bParts[i] || '';
    
    // 如果两个部分都是数字，按数字比较
    if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
      const numA = parseInt(aPart, 10);
      const numB = parseInt(bPart, 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      // 按字符串比较
      if (aPart !== bPart) {
        return aPart.localeCompare(bPart);
      }
    }
  }
  
  return 0;
}
