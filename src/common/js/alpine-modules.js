/**
 * Sky Theme Components - JavaScript 组件模块
 * 只包含模板中实际使用的功能
 */

/**
 * 回到顶部控制器
 * 模板使用：templates/modules/footer.html
 */
function createBackToTop() {
  return {
    isVisible: false,
    progress: 0,
    progressStroke: '0 113',
    
    init() {
      // 监听滚动事件
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        this.isVisible = scrollTop > 300;
        
        // 计算进度条
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / maxScroll, 1);
        const circumference = 2 * Math.PI * 18; // r=18
        const strokeDasharray = circumference * progress;
        this.progressStroke = `${strokeDasharray} ${circumference}`;
      });
    },
    
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
}

/**
 * 首页头部控制器
 * 模板使用：templates/modules/index/header.html
 */
function createHeaderController() {
  return {
    scrolled: false,
    scrollOffset: 0,
    progressStroke: '0 113',
    
    init() {
      // 滚动监听
      window.addEventListener('scroll', () => {
        this.scrollOffset = window.scrollY;
        this.scrolled = this.scrollOffset > 20;
        
        // 计算进度条
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(this.scrollOffset / maxScroll, 1);
        const circumference = 2 * Math.PI * 18; // r=18
        const strokeDasharray = circumference * progress;
        this.progressStroke = `${strokeDasharray} ${circumference}`;
      });
      
      console.log('首页头部控制器已初始化');
    }
  };
}

/**
 * 导航栏控制器
 * 模板使用：templates/modules/nav.html
 */
function createNavbarController() {
  return {
    scrolled: false,
    
    init() {
      // 滚动监听
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 20;
        // 添加/移除 scrolled 类到 navbar
        const navbar = this.$el.querySelector('.navbar');
        if (navbar) {
          if (this.scrolled) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
      });
    }
  };
}

/**
 * 主题切换控制器
 * 模板使用：templates/modules/nav.html
 */
function createThemeToggle() {
  return {
    isDark: false,
    lightTheme: '',
    darkTheme: '',
    defaultTheme: '',
    
    init() {
      // 从 Thymeleaf 数据属性获取主题配置
      this.lightTheme = this.$el.dataset.lightTheme || 'light';
      this.darkTheme = this.$el.dataset.darkTheme || 'dark';
      this.defaultTheme = this.$el.dataset.defaultTheme || 'dark_theme';
      
      // 从 localStorage 读取用户选择
      const savedTheme = localStorage.getItem('theme-mode');
      
      if (savedTheme) {
        this.isDark = savedTheme === 'dark_theme';
      } else {
        // 使用后台配置的默认主题
        this.isDark = this.defaultTheme === 'dark_theme';
      }
      
      this.applyTheme();
    },
    
    toggleTheme() {
      this.isDark = !this.isDark;
      const themeMode = this.isDark ? 'dark_theme' : 'light_theme';
      localStorage.setItem('theme-mode', themeMode);
      this.applyTheme();
    },
    
    applyTheme() {
      // 应用具体的 DaisyUI 主题名称
      const themeName = this.isDark ? this.darkTheme : this.lightTheme;
      document.documentElement.setAttribute('data-theme', themeName);
    }
  };
}



/**
 * 初始化所有组件
 * 注册模板中实际使用的 Alpine.js 组件
 */
function initializeAll() {
  // 注册模板中使用的组件
  Alpine.data('backToTop', createBackToTop);
  Alpine.data('headerController', createHeaderController);
  Alpine.data('navbarController', createNavbarController);
  Alpine.data('createThemeToggle', createThemeToggle);
  
  console.log('Sky Theme - 模板组件已注册完成');
}


export {
  initializeAll,
  createBackToTop,
  createHeaderController,
  createNavbarController,
  createThemeToggle
};
