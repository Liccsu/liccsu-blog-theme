/**
 * 作者归档页 JavaScript
 * 路由：/authors/:name
 * 功能：Tab 切换、瞬间统计、交互效果
 */

// 导入样式
import './author.css';

/**
 * Alpine.js Tab 切换组件
 */
function authorTabs() {
  return {
    activeTab: 'posts',
    
    init() {
      // 从 data 属性读取默认 Tab
      const defaultTab = this.$el.dataset.defaultTab;
      if (defaultTab && (defaultTab === 'posts' || defaultTab === 'moments')) {
        this.activeTab = defaultTab;
      }
    }
  };
}

// 注册到全局
window.authorTabs = authorTabs;

/**
 * 初始化作者页面
 */
function initAuthorPage() {
  // 统计瞬间数量并更新显示
  updateMomentsCount();
  
  // 检查瞬间是否为空
  checkMomentsEmpty();
  
  // 初始化图片预览
  initImagePreview();
}

/**
 * 统计并更新作者瞬间数量
 */
function updateMomentsCount() {
  const config = window.AUTHOR_PAGE_CONFIG;
  if (!config || !config.authorName) return;
  
  // 统计瞬间网格中属于该作者的瞬间数量
  const momentsGrid = document.querySelector('.author-moments-grid');
  if (!momentsGrid) return;
  
  const momentItems = momentsGrid.querySelectorAll('.author-moment-item');
  const momentsCount = momentItems.length;
  
  // 更新统计信息区域的瞬间数
  const countElements = document.querySelectorAll('.author-moments-count');
  countElements.forEach(el => {
    el.textContent = momentsCount;
  });
  
  // 更新 Tab 标签中的数量
  const tabCountEl = document.querySelector('.author-moments-tab-count');
  if (tabCountEl) {
    tabCountEl.textContent = `(${momentsCount})`;
  }
}

/**
 * 检查瞬间是否为空，显示空状态
 */
function checkMomentsEmpty() {
  const momentsGrid = document.querySelector('.author-moments-grid');
  const emptyState = document.querySelector('.author-moments-empty');
  
  if (!momentsGrid || !emptyState) return;
  
  const momentItems = momentsGrid.querySelectorAll('.author-moment-item');
  
  if (momentItems.length === 0) {
    momentsGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
  }
}

/**
 * 初始化图片预览功能
 */
function initImagePreview() {
  // 为瞬间中的图片添加点击预览
  const momentImages = document.querySelectorAll('.author-moment-item img');
  
  momentImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openImagePreview(img.src);
    });
  });
}

/**
 * 打开图片预览
 */
function openImagePreview(src) {
  // 检查是否已有预览模态框
  let modal = document.getElementById('author-image-preview-modal');
  
  if (!modal) {
    // 创建模态框
    modal = document.createElement('div');
    modal.id = 'author-image-preview-modal';
    modal.className = 'fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out';
    modal.innerHTML = `
      <img src="" alt="预览图片" class="max-w-full max-h-full object-contain rounded-lg" />
      <button class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    document.body.appendChild(modal);
    
    // 点击关闭
    modal.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
    
    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
  
  // 设置图片并显示
  const img = modal.querySelector('img');
  img.src = src;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initAuthorPage);

// 导出供外部使用
export { initAuthorPage, authorTabs };
