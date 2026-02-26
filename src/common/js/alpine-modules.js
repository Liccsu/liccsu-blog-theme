/**
 * Sky Theme Components - JavaScript 组件模块
 * 只包含模板中实际使用的功能
 */

/* global Alpine */

/**
 * 悬浮 Dock 控制器
 * 模板使用：templates/modules/floating-dock.html, templates/modules/post/floating-dock.html
 */
function createFloatingDock() {
  return {
    isVisible: true,
    isCommentDrawerOpen: false,
    scrollTimeout: null,
    scrollPercent: 0,

    init() {
      this.updateVisibility();

      let ticking = false;

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.updateVisibility();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    },

    updateVisibility() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // 只在页面最顶部（< 50px）时隐藏
      this.isVisible = scrollTop >= 50;
      this.scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // 文章页专用方法
    openShareModal() {
      const checkbox = document.getElementById("share-drawer");
      if (checkbox) {
        checkbox.checked = true;
        // 触发 Alpine 的响应式更新
        checkbox.dispatchEvent(new Event("change"));
      }
    },

    toggleCommentDrawer() {
      this.isCommentDrawerOpen = !this.isCommentDrawerOpen;
      const checkbox = document.getElementById("comment-drawer");
      if (checkbox) {
        checkbox.checked = this.isCommentDrawerOpen;
      }
    },
  };
}

/**
 * 分享抽屉控制器
 * 模板使用：templates/modules/post/floating-dock.html
 * 参考 theme-earth 的优雅设计：预设平台 + ID 过滤模式
 */
/**
 * 通用分享弹窗组件
 * 模板使用：templates/modules/share-modal.html
 *
 * 支持的 data 属性：
 * - data-share-url: 分享链接
 * - data-share-title: 分享标题
 * - data-share-item-ids: 启用的平台ID列表（逗号分隔）
 *
 * 触发方式：$dispatch('open-share-modal')
 */
function createShareModal() {
  return {
    // 页面信息
    permalink: "",
    title: "",

    // 状态
    isOpen: false,
    copied: false,

    // 启用的平台 ID 列表
    shareItemIds: [],

    // 预设的所有分享平台（含颜色）
    presetShareItems: [
      { id: "wechat", name: "微信", icon: "icon-[simple-icons--wechat]", color: "#07c160", type: "qrcode" },
      {
        id: "x",
        name: "X",
        icon: "icon-[simple-icons--x]",
        color: "#000000",
        type: "url",
        url: "https://twitter.com/intent/tweet?url={url}&text={title}",
      },
      {
        id: "telegram",
        name: "Telegram",
        icon: "icon-[simple-icons--telegram]",
        color: "#26a5e4",
        type: "url",
        url: "https://telegram.me/share/url?url={url}&text={title}",
      },
      {
        id: "facebook",
        name: "Facebook",
        icon: "icon-[simple-icons--facebook]",
        color: "#1877f2",
        type: "url",
        url: "https://facebook.com/sharer/sharer.php?u={url}",
      },
      {
        id: "qq",
        name: "QQ",
        icon: "icon-[simple-icons--tencentqq]",
        color: "#12b7f5",
        type: "url",
        url: "https://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}",
      },
      {
        id: "qzone",
        name: "QQ空间",
        icon: "icon-[simple-icons--qzone]",
        color: "#fece00",
        type: "url",
        url: "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}",
      },
      {
        id: "weibo",
        name: "微博",
        icon: "icon-[simple-icons--sinaweibo]",
        color: "#e6162d",
        type: "url",
        url: "https://service.weibo.com/share/share.php?url={url}&title={title}",
      },
      {
        id: "douban",
        name: "豆瓣",
        icon: "icon-[simple-icons--douban]",
        color: "#007722",
        type: "url",
        url: "https://www.douban.com/share/service?href={url}&name={title}",
      },
      { id: "native", name: "更多", icon: "icon-[heroicons--share]", color: "#6366f1", type: "native" },
    ],

    // 初始化
    init() {
      // 从 data 属性读取配置
      const shareUrl = this.$el.dataset.shareUrl || this.$el.dataset.postUrl || "";
      const shareTitle = this.$el.dataset.shareTitle || this.$el.dataset.postTitle || "";
      const shareItemIdsStr = this.$el.dataset.shareItemIds || "";

      this.shareItemIds = shareItemIdsStr ? shareItemIdsStr.split(",").map((s) => s.trim()) : [];
      this.title = shareTitle || document.title;

      // 设置分享链接（转换为绝对 URL）
      if (shareUrl) {
        if (shareUrl.startsWith("/")) {
          this.permalink = window.location.origin + shareUrl;
        } else if (shareUrl.startsWith("http")) {
          this.permalink = shareUrl;
        } else {
          this.permalink = window.location.href;
        }
      } else {
        this.permalink = window.location.href;
      }

      // 暴露到全局，供原生 onclick 调用（解决 teleport 后的作用域问题）
      window.__shareModal = this;
    },

    // 计算属性：过滤出启用的分享平台
    get activeShareItems() {
      if (!this.shareItemIds || this.shareItemIds.length === 0) {
        return this.presetShareItems;
      }
      return this.shareItemIds.map((id) => this.presetShareItems.find((item) => item.id === id)).filter(Boolean);
      // 注意：不再过滤 native 类型，让所有配置的平台都显示
      // 点击时再判断浏览器是否支持
    },

    // 打开弹窗
    openModal() {
      this.isOpen = true;
      document.body.style.overflow = "hidden";
    },

    // 关闭弹窗
    closeModal() {
      this.isOpen = false;
      document.body.style.overflow = "";
    },

    // 复制链接
    async copyUrl() {
      try {
        await navigator.clipboard.writeText(this.permalink);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (err) {
        // 复制失败静默处理
      }
    },

    // 处理分享 - 直接在点击事件中处理，确保用户手势有效
    handleShare(platformId) {
      const platform = this.activeShareItems.find((item) => item?.id === platformId);
      if (!platform) {
        return;
      }

      if (platform.type === "native") {
        // 原生分享必须在用户手势中直接调用
        if (navigator.share) {
          const self = this;
          navigator
            .share({
              title: this.title,
              url: this.permalink,
            })
            .then(() => {
              self.closeModal();
            })
            .catch((err) => {
              self.closeModal();
            });
        } else {
          // 不支持原生分享（非 HTTPS 或浏览器不支持）
          this.copyUrl();
          // 不关闭弹窗，让用户看到"已复制"提示
        }
      } else if (platform.type === "qrcode") {
        this.closeModal();
        this.shareToWeChat();
      } else {
        this.closeModal();
        this.shareToUrl(platform);
      }
    },

    // URL 分享
    shareToUrl(platform) {
      const shareUrl = platform.url
        .replace(/{url}/g, encodeURIComponent(this.permalink))
        .replace(/{title}/g, encodeURIComponent(this.title));
      const width = 600,
        height = 500;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      window.open(
        shareUrl,
        `分享到${platform.name}`,
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no,scrollbars=yes,resizable=yes`,
      );
    },

    // 微信二维码分享
    shareToWeChat() {
      const width = 400,
        height = 500;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      const qrcodePageUrl = `/themes/liccsu-blog-theme/assets/qrcode/qrcode-share.html?url=${encodeURIComponent(this.permalink)}`;
      window.open(
        qrcodePageUrl,
        "微信扫码分享",
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no,scrollbars=no,resizable=no`,
      );
    },
  };
}

/**
 * 评论抽屉控制器
 * 模板使用：templates/modules/post/floating-dock.html
 */
function createCommentDrawer() {
  return {
    isOpen: false,

    init() {
      // 监听抽屉状态
      const checkbox = document.getElementById("comment-drawer");
      if (checkbox) {
        checkbox.addEventListener("change", (e) => {
          this.isOpen = e.target.checked;
        });
      }

      // 监听关闭抽屉事件
      window.addEventListener("close-comment-drawer", () => {
        this.closeDrawer();
      });
    },

    closeDrawer() {
      this.isOpen = false;
      const checkbox = document.getElementById("comment-drawer");
      if (checkbox) {
        checkbox.checked = false;
      }
    },
  };
}

/**
 * 首页头部控制器
 * 模板使用：templates/modules/index/header.html
 */
function createHeaderController() {
  return {
    scrollOffset: 0,
    scrolled: false,
    showMoments: true,
    showPublishModal: false,
    isTablet: false,

    init() {
      // 检测设备类型
      this.detectDevice();

      // 监听窗口大小变化
      window.addEventListener("resize", () => {
        this.detectDevice();
      });

      // 监听滚动事件，使用节流优化性能
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.updateScrollOffset();
            ticking = false;
          });
          ticking = true;
        }
      });
    },

    detectDevice() {
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    },

    updateScrollOffset() {
      this.scrollOffset = window.scrollY;

      // 更新scrolled状态，用于背景蒙版透明度控制
      this.scrolled = this.scrollOffset > 50;

      // 平板端优化：减少视差效果强度
      if (this.isTablet) {
        this.scrollOffset *= 0.7;
      }
    },
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
      // 使用 requestAnimationFrame 节流的滚动监听
      let ticking = false;

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              const newScrolled = window.scrollY > 20;
              // 只在状态变化时更新 DOM
              if (this.scrolled !== newScrolled) {
                this.scrolled = newScrolled;
                const navbar = this.$el.querySelector(".navbar");
                if (navbar) {
                  navbar.classList.toggle("scrolled", this.scrolled);
                }
              }
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    },
  };
}

/**
 * 主题切换控制器
 * 模板使用：templates/modules/nav.html
 * 统一管理整个应用的主题状态
 * 支持三种模式：light（浅色）、dark（深色）、system（跟随系统）
 * 在 <html> 元素上添加 data-color-scheme 属性，便于 CSS 统一判断亮暗模式
 */
function createThemeToggle() {
  return {
    mode: "system",
    isDark: false,
    isDropdownOpen: false,
    lightTheme: "",
    darkTheme: "",
    mediaQuery: null,
    _safariBackdrop: null, // Safari 状态栏修复用的临时遮罩层引用

    init() {
      // 读取主题配置
      this.lightTheme = this.$el.dataset.lightTheme || "light";
      this.darkTheme = this.$el.dataset.darkTheme || "dark";
      const defaultTheme = this.$el.dataset.defaultTheme || "system";

      // 从 localStorage 读取用户偏好，并处理向后兼容
      let savedMode = localStorage.getItem("theme-mode");
      if (savedMode === "light_theme") savedMode = "light";
      if (savedMode === "dark_theme") savedMode = "dark";

      // 确定当前模式
      this.mode = savedMode || this.mapDefaultTheme(defaultTheme);

      // 计算 isDark 状态
      this.updateIsDark();

      // 监听系统主题变化（仅在 system 模式下响应）
      this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      this.mediaQuery.addEventListener("change", (e) => {
        if (this.mode === "system") {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });

      // 注意：不调用 applyTheme()，因为主题已经在 <head> 内联脚本中设置好了
      // 这里只是同步状态到组件，避免闪烁
    },

    /**
     * 映射默认主题配置值到模式
     */
    mapDefaultTheme(value) {
      if (value === "light_theme") return "light";
      if (value === "dark_theme") return "dark";
      return value; // 'system' 或其他
    },

    /**
     * 根据当前模式计算 isDark 状态
     */
    updateIsDark() {
      if (this.mode === "system") {
        this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        this.isDark = this.mode === "dark";
      }
    },

    /**
     * 设置主题模式
     */
    setMode(newMode) {
      this.mode = newMode;
      this.updateIsDark();
      localStorage.setItem("theme-mode", newMode);
      this.applyTheme();
      this.isDropdownOpen = false;
    },

    /**
     * 应用主题到 HTML 元素
     * 同时设置 data-theme（具体主题名）和 data-color-scheme（light/dark 标识）
     * 切换时临时禁用过渡，防止闪烁
     */
    applyTheme() {
      const themeName = this.isDark ? this.darkTheme : this.lightTheme;
      const themeMode = this.isDark ? "dark" : "light";
      const html = document.documentElement;

      // 临时禁用所有过渡
      html.classList.add("theme-transitioning");

      // 应用新主题
      html.setAttribute("data-theme", themeName);
      html.setAttribute("data-color-scheme", themeMode);

      // 下一帧恢复过渡
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html.classList.remove("theme-transitioning");
        });
      });

      // 更新移动端状态栏颜色
      this.updateThemeColor();

      // Safari 状态栏颜色修复：模拟 drawer-side 关闭
      this.triggerSafariStatusBarUpdate();
    },

    /**
     * 触发 Safari 状态栏颜色更新
     * 通过创建并移除临时遮罩层，触发 Safari 重新读取 theme-color
     */
    triggerSafariStatusBarUpdate() {
      // 如果已有遮罩层，先移除（防止竞态条件）
      if (this._safariBackdrop) {
        this._safariBackdrop.remove();
        this._safariBackdrop = null;
      }

      // 根据当前主题选择遮罩层颜色（浅色主题用白色，深色主题用黑色）
      const bgColor = this.isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";

      // 创建临时遮罩层
      const backdrop = document.createElement("div");
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 16px;
        z-index: 99999;
        background-color: ${bgColor};
        pointer-events: none;
      `;
      document.body.appendChild(backdrop);
      this._safariBackdrop = backdrop;

      // 延迟后移除遮罩层，触发 Safari 重新计算状态栏颜色
      setTimeout(() => {
        if (this._safariBackdrop === backdrop) {
          backdrop.remove();
          this._safariBackdrop = null;
        }
      }, 50);
    },

    /**
     * 更新移动端状态栏颜色
     * 通过 meta[name="theme-color"] 标签控制
     * Safari: 使用带 media 属性的 meta 标签跟随系统主题（JS 动态修改无效）
     * Chrome Android 等: 支持 JS 动态修改无 media 属性的 meta 标签
     */
    updateThemeColor() {
      requestAnimationFrame(() => {
        // 获取当前主题的背景色并转换为 HEX
        const hexColor = this.getThemeBackgroundColor();

        // 为支持动态更新的浏览器（如 Chrome Android）更新无 media 属性的 meta 标签
        let dynamicMeta = document.querySelector('meta[name="theme-color"]:not([media])');
        if (!dynamicMeta) {
          dynamicMeta = document.createElement("meta");
          dynamicMeta.name = "theme-color";
          document.head.appendChild(dynamicMeta);
        }
        dynamicMeta.content = hexColor;
      });
    },

    /**
     * 获取当前主题的背景色（HEX 格式）
     * 从 CSS 变量 --b1 获取 oklch 值并转换为 HEX
     */
    getThemeBackgroundColor() {
      // 创建临时元素获取计算后的颜色
      const temp = document.createElement("div");
      temp.style.cssText = "position:absolute;visibility:hidden;background-color:oklch(var(--b1))";
      document.body.appendChild(temp);
      const computedColor = getComputedStyle(temp).backgroundColor;
      temp.remove();

      // 将 rgb/rgba 转换为 HEX
      const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, "0");
        const g = parseInt(match[2]).toString(16).padStart(2, "0");
        const b = parseInt(match[3]).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
      }

      // 回退到默认颜色
      return this.isDark ? "#1f2937" : "#ffffff";
    },
  };
}

/**
 * 简单悬浮 Dock 控制器
 * 模板使用：templates/modules/doc/floating-dock.html (docs-dock, catalog-dock)
 * 与主站 floatingDock 保持一致：页面顶部隐藏，滚动后显示
 */
function createSimpleFloatingDock() {
  return {
    isVisible: false,

    init() {
      this.updateVisibility();

      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.updateVisibility();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    },

    updateVisibility() {
      // 滚动超过 50px 时显示
      this.isVisible = window.scrollY >= 50;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  };
}

/**
 * 文档页悬浮 Dock 控制器
 * 模板使用：templates/modules/doc/floating-dock.html (doc-dock)
 * 与主站 floatingDock 保持一致：页面顶部隐藏，滚动后显示
 */
function createDocFloatingDock() {
  return {
    isVisible: false,

    init() {
      this.updateVisibility();

      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.updateVisibility();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    },

    updateVisibility() {
      // 滚动超过 50px 时显示
      this.isVisible = window.scrollY >= 50;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    toggleCommentDrawer() {
      window.dispatchEvent(new CustomEvent("toggle-doc-comment-drawer"));
    },

    toggleTocDrawer() {
      window.dispatchEvent(new CustomEvent("toggle-doc-toc-drawer"));
    },

    toggleSidebarDrawer() {
      window.dispatchEvent(new CustomEvent("toggle-doc-sidebar-drawer"));
    },
  };
}

/**
 * 文档评论抽屉控制器
 * 模板使用：templates/modules/doc/floating-dock.html
 */
function createDocCommentDrawer() {
  return {
    isOpen: false,

    closeDrawer() {
      this.isOpen = false;
    },
  };
}

/**
 * 右侧可折叠悬浮 Dock 控制器
 * 模板使用：templates/modules/floating-dock-side.html
 */
function createSideFloatingDock() {
  return {
    isVisible: false,
    isExpanded: false,

    init() {
      this.updateVisibility();

      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.updateVisibility();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true },
      );
    },

    updateVisibility() {
      const newVisible = window.scrollY >= 50;
      // 滚动时自动收起展开的菜单
      if (!newVisible && this.isVisible) {
        this.isExpanded = false;
      }
      this.isVisible = newVisible;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  };
}

/**
 * 欢迎天气卡片
 * 模板使用：templates/modules/widgets/welcome-card.html
 */
function welcomeWeatherCard() {
  // 缓存配置（v12 版本 - 心知天气 Seniverse 支持）
  const CACHE_KEY = "sky_weather_cache_v12";
  const CACHE_DURATION = 30 * 60 * 1000; // 30 分钟缓存

  // 清除旧版本缓存
  try {
    const oldKeys = [
      "sky_weather_cache",
      "sky_weather_cache_v2",
      "sky_weather_cache_v3",
      "sky_weather_cache_v4",
      "sky_weather_cache_v5",
      "sky_weather_cache_v6",
      "sky_weather_cache_v7",
      "sky_weather_cache_v8",
      "sky_weather_cache_v9",
      "sky_weather_cache_v10",
      "sky_weather_cache_v11",
    ];
    oldKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    /* ignore */
  }

  return {
    loading: true,
    weather: null,
    location: "",
    errorMsg: "",
    greeting: "",
    currentDate: "",
    weatherIcon: "",
    weatherIconSvg: "",
    weatherBg: "",

    init() {
      this.updateGreeting();
      this.updateDate();
      // 延迟加载天气，不阻塞首屏渲染
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => this.loadWeather(), { timeout: 2000 });
      } else {
        setTimeout(() => this.loadWeather(), 100);
      }

      // 监听天气刷新请求（来自首页天气效果的定时刷新）
      window.addEventListener("sky-weather-refresh-request", () => {
        this.forceRefreshWeather();
      });
    },

    /**
     * 强制刷新天气（忽略缓存）
     */
    async forceRefreshWeather() {
      try {
        // 清除缓存
        localStorage.removeItem(CACHE_KEY);
        // 重新获取天气
        await this.fetchWeatherByIP();
      } catch (e) {
        // Silent fail
      }
    },

    updateGreeting() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 9) {
        this.greeting = "早上好 ☀️";
      } else if (hour >= 9 && hour < 12) {
        this.greeting = "上午好 🌤️";
      } else if (hour >= 12 && hour < 14) {
        this.greeting = "中午好 🌞";
      } else if (hour >= 14 && hour < 18) {
        this.greeting = "下午好 ⛅";
      } else if (hour >= 18 && hour < 22) {
        this.greeting = "晚上好 🌙";
      } else {
        this.greeting = "夜深了 🌟";
      }
    },

    updateDate() {
      const now = new Date();
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      this.currentDate = `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
    },

    // 默认天气数据（北京）
    getDefaultWeather() {
      return {
        location: "北京",
        weather: { temp: "--", description: "加载中...", humidity: "--", wind: "--" },
        weatherIcon: "https://basmilius.github.io/weather-icons/production/fill/all/clear-day.svg",
        weatherBg: "sunny",
      };
    },

    // 从缓存加载或请求新数据
    async loadWeather() {
      console.log("[Weather] 开始加载天气...");
      // 1. 优先使用缓存
      const cached = this.getCache();
      if (cached) {
        console.log("[Weather] 命中缓存，城市:", cached.location);
        this.applyWeatherData(cached);
        this.loading = false;
        return;
      }

      console.log("[Weather] 无缓存，显示默认数据，后台获取真实天气");
      // 2. 无缓存时，立即显示默认数据
      this.applyWeatherData(this.getDefaultWeather());
      this.loading = false;

      // 3. 后台获取真实天气
      try {
        await this.fetchWeatherByIP();
      } catch (e) {
        console.warn("[Weather] IP 定位或天气获取失败:", e.message);
      }
    },

    // 通过 IP 获取城市名，然后查询天气
    async fetchWeatherByIP() {
      console.log("[Weather] 开始 IP 定位...");
      const locationData = await this.getLocationFromIP();
      const cityName = locationData.city;
      console.log(
        "[Weather] IP 定位结果:",
        cityName,
        "(来源:",
        locationData.source + ")",
      );

      if (!cityName || cityName === "未知") {
        throw new Error("无法获取城市名");
      }

      await this.fetchWeatherByCity(cityName);
    },

    // 带超时的 fetch 封装
    fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(url, { ...options, signal: controller.signal }).finally(() =>
        clearTimeout(timer),
      );
    },

    // IP 定位：只用 pconline（CF Worker 代理），直接获取真实运营商 IP
    // 备用 API（ip-api.com 等）会因代理/CDN 路由问题返回错误城市，已放弃
    async getLocationFromIP() {
      console.log("[Weather] 通过 pconline CF Worker 获取位置...");
      try {
        const data = await this.fetchWithTimeout(
          "https://pconline.xoku.cn/",
          {},
          6000,
        ).then((res) => res.json());

        const rawCity = data.city || data.addr || "";
        const city = rawCity.replace("市", "").trim() || "未知";
        console.log("[Weather] pconline 返回城市:", city, "原始数据:", data);

        // 如果用户开启了代理、iCloud 专用代理等，会定位到奇怪的地方
        const isAbnormalCity =
          city.includes("美国") ||
          city.includes("CloudFlare") ||
          city.includes("节点") ||
          city === "未知";

        if (city && !isAbnormalCity) {
          return { city, source: "pconline" };
        }

        console.warn("[Weather] pconline 返回异常城市或使用了代理，降级为默认");
        return { city: "未知", source: "fallback" };
      } catch (e) {
        console.warn(
          "[Weather] pconline 请求失败:",
          e.message,
          "，降级为默认城市",
        );
        return { city: "未知", source: "fallback" };
      }
    },

    // 城市名英中映射
    translateCity(cityName) {
      const cityMap = {
        Beijing: "北京",
        Shanghai: "上海",
        Guangzhou: "广州",
        Shenzhen: "深圳",
        Hangzhou: "杭州",
        Nanjing: "南京",
        Chengdu: "成都",
        Wuhan: "武汉",
        "Xi'an": "西安",
        Xian: "西安",
        Chongqing: "重庆",
        Tianjin: "天津",
        Suzhou: "苏州",
        Qingdao: "青岛",
        Dalian: "大连",
        Xiamen: "厦门",
        Ningbo: "宁波",
        Dongguan: "东莞",
        Shenyang: "沈阳",
        Zhengzhou: "郑州",
        Changsha: "长沙",
        Jinan: "济南",
        Harbin: "哈尔滨",
        Fuzhou: "福州",
        Kunming: "昆明",
        Hefei: "合肥",
        Nanchang: "南昌",
        Shijiazhuang: "石家庄",
        Taiyuan: "太原",
        Changchun: "长春",
        Lanzhou: "兰州",
        Guiyang: "贵阳",
        Nanning: "南宁",
        Urumqi: "乌鲁木齐",
        Hohhot: "呼和浩特",
        Lhasa: "拉萨",
        Xining: "西宁",
        Yinchuan: "银川",
        Haikou: "海口",
        Macau: "澳门",
        "Hong Kong": "香港",
        Zhuhai: "珠海",
        Foshan: "佛山",
        Wuxi: "无锡",
        Wenzhou: "温州",
        Huizhou: "惠州",
        Zhongshan: "中山",
        Jiaxing: "嘉兴",
        Nantong: "南通",
        Changzhou: "常州",
        Yangzhou: "扬州",
        Zhenjiang: "镇江",
      };
      return cityMap[cityName] || cityName.replace("市", "");
    },

    // 根据城市名获取天气
    async fetchWeatherByCity(cityName) {
      // 优先使用用户在主题设置中配置的 Key，留空则使用内置默认 Key
      const DEFAULT_KEY = "SWMR1Zeyn0TCbArs1";
      const SENIVERSE_KEY = this.$el?.dataset?.weatherKey || DEFAULT_KEY;

      // 1. 尝试心知天气 (基础数据：温度、天气描述)
      try {
        const url = `https://api.seniverse.com/v3/weather/now.json?key=${SENIVERSE_KEY}&location=${encodeURIComponent(cityName)}&language=zh-Hans&unit=c`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Seniverse API error: ${res.status}`);

        const data = await res.json();

        const now = data.results?.[0]?.now;
        const location = data.results?.[0]?.location;
        if (!now) throw new Error("No weather data");

        const code = parseInt(now.code);
        const weatherData = {
          location: location?.name || cityName,
          weather: {
            temp: parseFloat(now.temperature),
            feels_like: parseFloat(now.temperature),
            humidity: 0,
            description: now.text,
            wind: 0,
          },
          weatherIcon: this.getWeatherIconFromSeniverse(code),
          weatherBg: this.getWeatherBgFromSeniverse(code),
        };

        await this.loadSvgIcon(weatherData.weatherIcon);
        weatherData.weatherIconSvg = this.weatherIconSvg;

        // 2. 并行请求 wttr.in 补充湿度和风速 (不阻塞主流程)
        this.fetchExtraWeatherData(cityName);

        this.applyWeatherData(weatherData);
        this.setCache(weatherData);
        return;
      } catch (e) {
        // Fallback to wttr.in
      }

      // 2. 降级到 wttr.in
      try {
        const url = `https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=zh`;

        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("wttr.in error");

        const data = await res.json();
        const current = data.current_condition?.[0];
        if (!current) throw new Error("No weather data");

        const weatherCode = parseInt(current.weatherCode);
        const weatherData = {
          location: cityName,
          weather: {
            temp: parseFloat(current.temp_C),
            feels_like: parseFloat(current.FeelsLikeC),
            humidity: parseInt(current.humidity),
            description: current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || "未知",
            wind: parseFloat(current.windspeedKmph),
          },
          weatherIcon: this.getWeatherIconFromWttr(weatherCode),
          weatherBg: this.getWeatherBgFromWttr(weatherCode),
        };

        await this.loadSvgIcon(weatherData.weatherIcon);
        weatherData.weatherIconSvg = this.weatherIconSvg;

        this.applyWeatherData(weatherData);
        this.setCache(weatherData);
      } catch (e) {
        // Silent fail
      }
    },

    // 补充获取湿度和风速 (从 wttr.in，不阻塞主流程)
    async fetchExtraWeatherData(cityName) {
      try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(cityName)}?format=j1&lang=zh`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;

        const data = await res.json();
        const current = data.current_condition?.[0];
        if (!current) return;

        // 直接更新 Alpine 响应式属性
        this.weather.humidity = parseInt(current.humidity || 0);
        this.weather.wind = parseFloat(current.windspeedKmph || 0);
        this.weather.feels_like = parseFloat(current.FeelsLikeC || this.weather.temp);

        // 更新缓存
        this.setCache({
          location: this.location,
          weather: this.weather,
          weatherIcon: this.weatherIcon,
          weatherBg: this.weatherBg,
          weatherIconSvg: this.weatherIconSvg,
        });
      } catch (e) {
        // Silent fail
      }
    },

    // 心知天气代码映射图标 (返回完整 URL)
    getWeatherIconFromSeniverse(code) {
      const baseUrl = "https://basmilius.github.io/weather-icons/production/fill/all/";
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      // https://seniverse.yuque.com/hyper_data/api_2018/yev2c3
      let icon = "not-available";
      if (code === 0 || code === 38)
        icon = isNight ? "clear-night" : "clear-day"; // 晴/热
      else if (code >= 1 && code <= 3)
        icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day"; // 晴间多云
      else if (code >= 4 && code <= 9)
        icon = "cloudy"; // 多云/阴
      else if (code >= 10 && code <= 19)
        icon = "rain"; // 各种雨
      else if (code >= 20 && code <= 25)
        icon = "snow"; // 各种雪
      else if (code >= 26 && code <= 31)
        icon = "fog"; // 雾/霾
      else if (code >= 32 && code <= 36)
        icon = "wind"; // 风
      else if (code === 37)
        icon = "snow"; // 冷
      else icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day";

      return `${baseUrl}${icon}.svg`;
    },

    // 心知天气代码映射背景
    // 代码参考: https://seniverse.yuque.com/hyper_data/api_2018/yev2c3
    // 0: 晴, 1-3: 晴间多云, 4-9: 多云/阴, 10-12: 阵雨/雷阵雨, 13-19: 各种雨
    // 20-25: 各种雪, 26-31: 雾/霾, 32-36: 风, 37: 冷, 38: 热, 99: 未知
    getWeatherBgFromSeniverse(code) {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      // 晴天
      if (code === 0 || code === 38) return isNight ? "night-clear" : "sunny";
      // 晴间多云
      if (code >= 1 && code <= 3) return isNight ? "night-cloudy" : "cloudy";
      // 多云/阴
      if (code >= 4 && code <= 9) return isNight ? "night-cloudy" : "cloudy";
      // 雷阵雨 (10-12 包含雷暴)
      if (code >= 10 && code <= 12) return "stormy";
      // 各种雨 (13-19)
      if (code >= 13 && code <= 19) return "rainy";
      // 各种雪
      if (code >= 20 && code <= 25) return "snowy";
      // 雾/霾
      if (code >= 26 && code <= 31) return "foggy";
      // 风/冷 - 按多云处理
      if (code >= 32 && code <= 37) return isNight ? "night-cloudy" : "cloudy";
      // 默认
      return isNight ? "night-cloudy" : "cloudy";
    },

    // 获取缓存
    getCache() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const cacheAge = Date.now() - data.timestamp;
        if (cacheAge > CACHE_DURATION) {
          localStorage.removeItem(CACHE_KEY);
          return null;
        }

        return data;
      } catch (e) {
        return null;
      }
    },

    // 保存缓存
    // 用于追踪上次触发的天气类型，避免重复事件
    _lastDispatchedBg: null,

    setCache(data) {
      try {
        const cacheData = { ...data, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        // 只在 weatherBg 真正变化时触发事件，避免重复
        if (data.weatherBg && data.weatherBg !== this._lastDispatchedBg) {
          this._lastDispatchedBg = data.weatherBg;
          window.dispatchEvent(
            new CustomEvent("sky-weather-updated", {
              detail: { weatherBg: data.weatherBg, location: data.location },
            }),
          );
        }
      } catch (e) {
        /* ignore */
      }
    },

    // 应用天气数据到组件
    applyWeatherData(data) {
      this.location = data.location;
      this.weather = data.weather;
      this.weatherIcon = data.weatherIcon;
      this.weatherIconSvg = data.weatherIconSvg || "";
      this.weatherBg = data.weatherBg || "sunny";
    },

    // 加载 SVG 图标内容
    async loadSvgIcon(url) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          let svg = await res.text();
          svg = svg.replace(/<\?xml[^>]*\?>/g, "");
          svg = svg.replace(/<svg/, '<svg class="w-full h-full"');
          this.weatherIconSvg = svg;
        } else {
          this.weatherIconSvg = "";
        }
      } catch (e) {
        this.weatherIconSvg = "";
      }
    },

    // wttr.in 天气代码转图标 URL
    getWeatherIconFromWttr(code) {
      const baseUrl = "https://basmilius.github.io/weather-icons/production/fill/all/";
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      let icon = "not-available";
      // wttr.in 使用 WWO (World Weather Online) 代码
      // 参考: https://www.worldweatheronline.com/developer/api/docs/weather-icons.aspx
      if (code === 113)
        icon = isNight ? "clear-night" : "clear-day"; // 晴
      else if (code === 116)
        icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day"; // 局部多云
      else if (code === 119 || code === 122)
        icon = "cloudy"; // 多云/阴
      else if (code === 143 || code === 248 || code === 260)
        icon = "fog"; // 雾
      else if (code === 176 || code === 263 || code === 266)
        icon = "drizzle"; // 毛毛雨
      else if (code >= 293 && code <= 314)
        icon = "rain"; // 雨
      else if (code >= 179 && code <= 230)
        icon = "snow"; // 雪
      else if (code >= 350 && code <= 377)
        icon = "sleet"; // 冰雹/雨夹雪
      else if (code >= 386 && code <= 395)
        icon = "thunderstorms"; // 雷暴
      else if (code >= 320 && code <= 338)
        icon = "snow"; // 雪
      else icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day";

      return `${baseUrl}${icon}.svg`;
    },

    // wttr.in 天气代码转背景类型
    getWeatherBgFromWttr(code) {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      if (code === 113) return isNight ? "night-clear" : "sunny"; // 晴
      if (code === 116 || code === 119 || code === 122) return isNight ? "night-cloudy" : "cloudy"; // 多云
      if (code === 143 || code === 248 || code === 260) return "foggy"; // 雾
      if ((code >= 176 && code <= 230) || (code >= 320 && code <= 338)) return "snowy"; // 雪
      if ((code >= 263 && code <= 314) || (code >= 350 && code <= 377)) return "rainy"; // 雨
      if (code >= 386 && code <= 395) return "stormy"; // 雷暴
      return isNight ? "night-cloudy" : "cloudy";
    },

    // WMO 天气代码转描述（保留用于兼容）
    getWeatherDescription(code) {
      const descriptions = {
        0: "晴朗",
        1: "大部晴朗",
        2: "局部多云",
        3: "多云",
        45: "有雾",
        48: "雾凇",
        51: "小毛毛雨",
        53: "毛毛雨",
        55: "大毛毛雨",
        56: "冻毛毛雨",
        57: "大冻毛毛雨",
        61: "小雨",
        63: "中雨",
        65: "大雨",
        66: "小冻雨",
        67: "大冻雨",
        71: "小雪",
        73: "中雪",
        75: "大雪",
        77: "雪粒",
        80: "小阵雨",
        81: "阵雨",
        82: "大阵雨",
        85: "小阵雪",
        86: "大阵雪",
        95: "雷暴",
        96: "雷暴伴小冰雹",
        99: "雷暴伴大冰雹",
      };
      return descriptions[code] || "未知";
    },

    // WMO 天气代码转 Meteocons SVG URL（动态天气图标）
    getWeatherIcon(code) {
      const baseUrl = "https://basmilius.github.io/weather-icons/production/fill/all/";
      // 判断是否为夜间（18:00-06:00）
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      let icon = "not-available";
      if (code === 0) icon = isNight ? "clear-night" : "clear-day";
      else if (code === 1) icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day";
      else if (code === 2) icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day";
      else if (code === 3) icon = "cloudy";
      else if (code <= 48) icon = "fog";
      else if (code <= 57) icon = "drizzle";
      else if (code <= 65) icon = "rain";
      else if (code <= 67) icon = "sleet";
      else if (code <= 77) icon = "snow";
      else if (code <= 82) icon = isNight ? "partly-cloudy-night-rain" : "partly-cloudy-day-rain";
      else if (code <= 86) icon = isNight ? "partly-cloudy-night-snow" : "partly-cloudy-day-snow";
      else if (code >= 95) icon = "thunderstorms";
      else icon = isNight ? "partly-cloudy-night" : "partly-cloudy-day";

      return `${baseUrl}${icon}.svg`;
    },

    // 根据天气代码获取背景类型
    getWeatherBg(code) {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;

      if (code === 0) return isNight ? "night-clear" : "sunny";
      if (code <= 3) return isNight ? "night-cloudy" : "cloudy";
      if (code <= 48) return "foggy";
      if (code <= 67) return "rainy";
      if (code <= 77) return "snowy";
      if (code <= 86) return "snowy";
      if (code >= 95) return "stormy";
      return isNight ? "night-cloudy" : "cloudy";
    },
  };
}
/**
 * 初始化所有组件
 * 注册模板中实际使用的 Alpine.js 组件
 */
function initializeAll() {
  // 注册模板中使用的组件
  Alpine.data("floatingDock", createFloatingDock);
  Alpine.data("shareModal", createShareModal);
  Alpine.data("commentDrawer", createCommentDrawer);
  Alpine.data("headerController", createHeaderController);
  Alpine.data("navbarController", createNavbarController);
  Alpine.data("createThemeToggle", createThemeToggle);
  Alpine.data("sideFloatingDock", createSideFloatingDock);

  // 文档页组件
  Alpine.data("simpleFloatingDock", createSimpleFloatingDock);
  Alpine.data("docFloatingDock", createDocFloatingDock);
  Alpine.data("docCommentDrawer", createDocCommentDrawer);

  // 小工具组件
  Alpine.data("welcomeWeatherCard", welcomeWeatherCard);
}

export {
  initializeAll,
  createFloatingDock,
  createShareModal,
  createCommentDrawer,
  createHeaderController,
  createNavbarController,
  createThemeToggle,
  createSideFloatingDock,
  createSimpleFloatingDock,
  createDocFloatingDock,
  createDocCommentDrawer,
  welcomeWeatherCard,
};
