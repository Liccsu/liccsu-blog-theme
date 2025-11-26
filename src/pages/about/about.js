/**
 * 关于页面脚本
 */
import './about.css';

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
  // 数字动画效果
  initCounterAnimation();
  
  // 懒加载图片错误处理
  initImageErrorHandler();
});

/**
 * 统计数字动画
 */
function initCounterAnimation() {
  const statValues = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalValue = parseInt(el.textContent) || 0;
        
        if (finalValue > 0) {
          animateCounter(el, 0, finalValue, 1000);
        }
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(stat => observer.observe(stat));
}

/**
 * 数字递增动画
 */
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * 图片加载错误处理
 */
function initImageErrorHandler() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      
      // 创建占位提示
      const placeholder = document.createElement('div');
      placeholder.className = 'flex items-center justify-center p-8 text-base-content/50 text-sm';
      placeholder.textContent = '图片加载失败';
      img.parentNode.appendChild(placeholder);
    });
  });
}
