/**
 * 单页面脚本
 * 模板位置：templates/page.html
 */

// 导入页面样式
import './page.css';

// 导入公共文章内容处理脚本
import { initArticleContent } from '../../common/js/article-content.js';

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 使用公共的文章内容初始化（包含图片懒加载、外部链接、blur移除等）
  initArticleContent();
});
