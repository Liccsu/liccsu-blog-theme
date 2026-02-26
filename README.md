# Liccsu Blog Theme

<p align="center">
  <img src="logo.png" alt="Liccsu Blog Theme Logo" width="400">
</p>

> 基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 的 Halo 2.0 博客主题衍生版本

[![Halo](https://img.shields.io/badge/Halo-2.22.9+-blue)](https://halo.run)
[![License](https://img.shields.io/badge/License-GPL--3.0-green)](LICENSE)
[![Node](https://img.shields.io/badge/Node-20+-brightgreen)](https://nodejs.org)

**演示站点：[https://liccsu.com](https://liccsu.com)**

## 📖 简介

Liccsu Blog Theme 是一款基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 的 Halo 2.0 主题衍生版本，采用现代前端技术栈开发。

**本项目遵循 GPL-3.0 开源协议，感谢原作者 [sky](https://github.com/sky121666) 的贡献。**

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vite | 7.x | 构建工具 |
| Tailwind CSS | 4.x | 原子化 CSS |
| DaisyUI | 5.x | UI 组件库 |
| Alpine.js | 3.x | 响应式框架 |
| Thymeleaf | 3.x | 模板引擎 |
| TypeScript | 5.x | 类型安全 |

---

## 🔌 插件适配

主题已适配以下插件，开箱即用：

### 内容类

| 插件 | 应用市场 | GitHub | 主题支持 |
|------|---------|--------|---------|
| 瞬间管理 | [app-SnwWD](https://www.halo.run/store/apps/app-SnwWD) | [plugin-moments](https://github.com/halo-sigs/plugin-moments) | ✅ 前端发布、媒体上传 |
| 朋友圈 | [app-yISsV](https://www.halo.run/store/apps/app-yISsV) | [plugin-friends](https://github.com/halo-sigs/plugin-friends) | ✅ RSS 聚合展示 |
| Docsme 文档 | [app-yffxw](https://www.halo.run/store/apps/app-yffxw) | - | ✅ 知识库文档 |
| 图库管理 | [app-BmQJW](https://www.halo.run/store/apps/app-BmQJW) | [plugin-photos](https://github.com/halo-sigs/plugin-photos) | ✅ 瀑布流相册 |
| 链接管理 | [app-hfbQg](https://www.halo.run/store/apps/app-hfbQg) | [plugin-links](https://github.com/halo-sigs/plugin-links) | ✅ 友链书签 |
| 友链提交 | [app-glejqzwk](https://www.halo.run/store/apps/app-glejqzwk) | [plugin-link-submit](https://github.com/jiangqizheng/plugin-link-submit) | ✅ 自助申请 |

### 扩展类

| 插件 | 应用市场 | GitHub | 主题支持 |
|------|---------|--------|---------|
| Bilibili 追番 | [app-OTFPN](https://www.halo.run/store/apps/app-OTFPN) | [plugin-bilibili-bangumi](https://github.com/Roozenlz/plugin-bilibili-bangumi) | ✅ 追番列表、轮播卡片 |
| Steam 游戏库 | [app-0ojqyzfh](https://www.halo.run/store/apps/app-0ojqyzfh) | [plugin-steam](https://github.com/Tim0x0/halo-plugin-steam) | ✅ 游戏库展示、侧边栏卡片 |
| 投票管理 | [app-veyvzyhv](https://www.halo.run/store/apps/app-veyvzyhv) | [plugin-vote](https://github.com/chengzhongxue/plugin-vote) | ✅ CSS 变量适配 |
| 装备管理 | [app-ytygyqml](https://www.halo.run/store/apps/app-ytygyqml) | [plugin-equipment](https://github.com/chengzhongxue/plugin-equipment) | ✅ 装备展示/我的装备 |

### 工具类

| 插件 | 应用市场 | GitHub | 主题支持 |
|------|---------|--------|---------|
| Shiki 代码高亮 | [app-kzloktzn](https://www.halo.run/store/apps/app-kzloktzn) | [plugin-shiki](https://github.com/halo-sigs/plugin-shiki) | ✅ 代码块美化 |
| 搜索组件 | [app-DlacW](https://www.halo.run/store/apps/app-DlacW) | [plugin-search-widget](https://github.com/halo-sigs/plugin-search-widget) | ✅ 全局搜索 |
| 评论组件 | [app-YXyaD](https://www.halo.run/store/apps/app-YXyaD) | [plugin-comment-widget](https://github.com/halo-sigs/plugin-comment-widget) | ✅ 评论系统 |
| 文本绘图 | [app-ahBRi](https://www.halo.run/store/apps/app-ahBRi) | [plugin-text-diagram](https://github.com/halo-sigs/plugin-text-diagram) | ✅ Mermaid/PlantUML |
| lightgallery | [app-OoggD](https://www.halo.run/store/apps/app-OoggD) | [plugin-lightgallery](https://github.com/halo-sigs/plugin-lightgallery) | ✅ 图片灯箱 |
| Passkey 认证 | [app-g7tggrco](https://www.halo.run/store/apps/app-g7tggrco) | [plugin-auth-passkey](https://github.com/iLay1678/halo-plugin-auth-passkey) | ✅ 无密码登录/指纹/面部识别 |

### 存储类

> 瞬间前端发布功能需要配置存储策略

| 存储插件 | 图片 | 视频 | 音频 | 状态 | 说明 |
|---------|------|------|------|------|------|
| 本地存储 | ✅ | ✅ | ✅ | 推荐 | 内置，无需配置 |
| S3/OSS | ✅ | ✅ | ✅ | 推荐 | 云存储，支持 CDN |
| Lsky 图床 | ✅ | ❌ | ❌ | 可用 | 仅支持图片，有压缩 |
| Alist | ❌ | ❌ | ❌ | 暂不可用 | 等待官方修复 |

> **Alist 说明**：Halo 2.22.12 + Alist 插件存在已知 bug，已提交问题报告。临时方案：使用本地存储或 S3。

---

## 🚀 快速开始

### 安装主题

**方式 1：应用市场（推荐）**

1. Halo 后台 → 外观 → 主题
2. 点击右上角 "安装主题" → "从应用市场安装"
3. 搜索 "Sky Blog" 并安装

**方式 2：手动安装**

1. 从 [Releases](https://github.com/sky121666/halo-theme-sky-blog-1/releases) 下载最新版本
2. Halo 后台 → 外观 → 主题 → 安装主题
3. 上传 `.zip` 文件并启用

### 配置主题

1. 启用主题后，点击主题卡片的 "主题设置"
2. 根据需要配置各个模块（参考 [完整文档](https://5ee.net/docs/halo-theme-sky-blog-1/jianjie)）
3. 建议配置项：
   - 通用设置 → 选择主题和颜色
   - 首页设置 → 配置头部背景
   - 导航设置 → 配置菜单和 Logo

### 推荐插件

安装以下插件以获得完整体验：

- **必装**：搜索组件、评论组件
- **推荐**：瞬间、图库、友链提交、装备管理
- **可选**：Docsme 文档、朋友圈、追番、Steam、Passkey 认证

---

## 🔧 开发指南

### 环境要求

- Node.js 20+
- pnpm 10+
- Java 21+ (运行 Halo)
- Halo 2.22.9+

### 开发命令

```bash
pnpm install    # 安装依赖
pnpm dev        # 开发模式（热更新）
pnpm build      # 构建主题包
pnpm lint       # 代码检查
pnpm prettier   # 代码格式化
```

### 目录结构

```
liccsu-blog-theme/
├── src/              # 前端源码
│   ├── common/       # 公共资源（main.js, CSS, Alpine 组件）
│   ├── pages/        # 页面特定资源
│   └── static/       # 静态资源
├── templates/        # Halo 模板文件
│   ├── assets/       # 构建产物（自动生成）
│   └── modules/      # 模板模块
├── docs/             # 主题配置文档
├── theme.yaml        # 主题元数据
├── settings.yaml     # 后台配置表单
└── vite.config.ts    # Vite 构建配置
```

## 📚 文档

原项目文档请参考：[Sky Blog Theme 文档](https://5ee.net/docs/halo-theme-sky-blog-1/jianjie)

## 🙏 致谢

本项目基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 开发，感谢原作者 [sky](https://github.com/sky121666) 的开源贡献。

同时感谢以下开源项目：

- [Halo](https://github.com/halo-dev/halo) - 强大的博客系统
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [DaisyUI](https://daisyui.com/) - Tailwind CSS 组件库
- [Alpine.js](https://alpinejs.dev/) - 轻量级 JS 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具

## 📄 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证开源。

根据 GPL-3.0 协议要求，本项目：
- 基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 修改
- 原项目作者：[sky](https://github.com/sky121666)
- 必须以相同的 GPL-3.0 协议开源
- 必须公开源代码
