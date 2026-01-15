/**
 * 公共文章内容处理脚本
 * 适用于所有使用 #article-content 的页面（post、about、page 等）
 */

/**
 * 图片懒加载设置
 * 跳过首屏前 N 张图片，后续图片添加 loading="lazy"
 */
export function setupContentLazyLoad() {
  const content = document.getElementById('article-content');
  if (!content) return;

  const images = content.querySelectorAll('img:not([loading])');
  const skipCount = 2; // 跳过前2张（首屏可能可见）

  images.forEach((img, index) => {
    if (index >= skipCount) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

/**
 * 外部链接处理
 * 为外部链接添加 target="_blank" 和 rel="noopener noreferrer"
 */
export function setupExternalLinks() {
  const content = document.getElementById('article-content');
  if (!content) return;

  const links = content.querySelectorAll('a[href^="http"]');
  links.forEach((link) => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * Admonition 鼠标跟随发光效果
 */
export function initAdmonitionGlow() {
  const admonitions = document.querySelectorAll('#article-content .admonition');

  admonitions.forEach(admonition => {
    admonition.addEventListener('mouseenter', () => {
      admonition.style.setProperty('--glow-opacity', '1');
    });

    admonition.addEventListener('mouseleave', () => {
      admonition.style.setProperty('--glow-opacity', '0');
    });

    admonition.addEventListener('mousemove', (e) => {
      const rect = admonition.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      admonition.style.setProperty('--glow-x', `${x}px`);
      admonition.style.setProperty('--glow-y', `${y}px`);
    });
  });
}

/**
 * 移除可能的内联 blur 样式
 */
export function removeBlurStyles() {
  const content = document.getElementById('article-content');
  if (!content) return;

  const inlineStyles = content.querySelectorAll('style');
  inlineStyles.forEach((style) => {
    if (style.textContent.includes('blur')) {
      style.remove();
    }
  });
}

/**
 * 初始化所有文章内容处理
 * 页面可以调用这个函数来初始化所有通用功能
 */
export function initArticleContent() {
  setupContentLazyLoad();
  setupExternalLinks();
  initAdmonitionGlow();
  removeBlurStyles();
}
