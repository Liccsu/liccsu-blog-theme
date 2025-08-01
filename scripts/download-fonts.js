/**
 * Google 字体下载脚本
 * 自动下载 Google Fonts 并转换为本地字体文件
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 要下载的字体配置
const fonts = [
  {
    name: 'Anton',
    family: 'Anton',
    weights: ['400'],
    url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap'
  },
  {
    name: 'Monoton',
    family: 'Monoton', 
    weights: ['400'],
    url: 'https://fonts.googleapis.com/css2?family=Monoton&display=swap'
  },
  {
    name: 'Titan One',
    family: 'Titan One',
    weights: ['400'],
    url: 'https://fonts.googleapis.com/css2?family=Titan+One&display=swap'
  }
];

// 创建字体目录
const fontsDir = path.join(__dirname, '../src/assets/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

/**
 * 下载字体 CSS 文件
 */
function downloadFontCSS(font) {
  return new Promise((resolve, reject) => {
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    
    const options = {
      headers: {
        'User-Agent': userAgent
      }
    };

    https.get(font.url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ 获取 ${font.name} CSS 成功`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * 解析 CSS 中的字体文件 URL
 */
function parseFontUrls(css) {
  const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
  const urls = [];
  let match;
  
  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

/**
 * 下载字体文件
 */
function downloadFontFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(fontsDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`📁 下载字体文件: ${filename}`);
        resolve();
      });
    }).on('error', reject);
  });
}

/**
 * 生成本地 CSS
 */
function generateLocalCSS(font, css, fontFiles) {
  let localCSS = css;
  
  // 替换 Google Fonts URL 为本地路径
  fontFiles.forEach((file, index) => {
    const originalUrl = parseFontUrls(css)[index];
    if (originalUrl) {
      const localPath = `/themes/theme-sky-blog-1/assets/fonts/${file}`;
      localCSS = localCSS.replace(originalUrl, localPath);
    }
  });
  
  return localCSS;
}

/**
 * 主下载函数
 */
async function downloadGoogleFonts() {
  console.log('🚀 开始下载 Google 字体...\n');
  
  let allCSS = '/**\n * Google 字体本地化版本\n * 自动生成，请勿手动修改\n */\n\n';
  
  for (const font of fonts) {
    try {
      console.log(`📥 处理字体: ${font.name}`);
      
      // 下载 CSS
      const css = await downloadFontCSS(font);
      
      // 解析字体文件 URL
      const fontUrls = parseFontUrls(css);
      const fontFiles = [];
      
      // 下载字体文件
      for (let i = 0; i < fontUrls.length; i++) {
        const url = fontUrls[i];
        const extension = url.includes('.woff2') ? 'woff2' : 'woff';
        const filename = `${font.name.toLowerCase().replace(/\s+/g, '-')}-${i}.${extension}`;
        
        await downloadFontFile(url, filename);
        fontFiles.push(filename);
      }
      
      // 生成本地 CSS
      const localCSS = generateLocalCSS(font, css, fontFiles);
      allCSS += `/* ${font.name} */\n${localCSS}\n\n`;
      
      console.log(`✅ ${font.name} 处理完成\n`);
      
    } catch (error) {
      console.error(`❌ 处理 ${font.name} 时出错:`, error.message);
    }
  }
  
  // 保存合并的 CSS 文件
  const cssPath = path.join(fontsDir, 'google-fonts-local.css');
  fs.writeFileSync(cssPath, allCSS);
  
  console.log('🎉 所有字体下载完成！');
  console.log(`📄 CSS 文件已保存到: ${cssPath}`);
}

// 执行下载
downloadGoogleFonts().catch(console.error);