# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Liccsu Blog Theme 是基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 的 Halo 2.0 博客主题衍生版本，采用 Vite + Tailwind CSS v4 + DaisyUI 5 + Alpine.js 技术栈。

## 常用命令

```bash
pnpm install    # 安装依赖
pnpm dev        # 开发模式（热更新）- 执行 vite build --watch
pnpm build      # 完整构建 - 执行 tsc && vite build && theme-package
pnpm build-only # 仅构建前端 - 执行 tsc && vite build
pnpm lint       # ESLint 检查
pnpm prettier   # 代码格式化
```

## 架构概览

### 构建流程

```
源码 (src/) → Vite 构建 → 构建产物 (templates/assets/) → Gradle 打包 → 主题包 (dist/*.zip)
```

### 入口点规则

- **公共入口**: `src/common/main.js` → `templates/assets/js/main.js` + `templates/assets/css/main.css`
- **页面入口**: `src/pages/*/[页面名].js` → `templates/assets/{js,css}/[页面名].{js,css}`
- 每个页面 JS 必须导入对应 CSS: `import './[页面名].css'`

### 目录结构

```
src/
├── common/           # 公共资源
│   ├── main.js       # 入口文件（导入所有 CSS 和 JS）
│   ├── css/          # 公共样式（tailwind.css, base.css 等）
│   └── js/           # 公共脚本（alpine-modules.js, base.js）
├── pages/            # 页面特定资源（index/, post/, about/ 等）
└── static/           # 静态资源

templates/
├── assets/           # 构建产物（自动生成，不手动修改）
├── modules/          # 模板模块（nav.html, footer.html, widgets/ 等）
└── *.html            # 页面模板
```

### Alpine.js 组件

公共组件定义在 `src/common/js/alpine-modules.js`，主要包括：
- `floatingDock` - 悬浮控制栏
- `shareModal` - 分享弹窗
- `commentDrawer` - 评论抽屉
- `headerController` - 首页头部控制器
- `navbarController` - 导航栏控制器
- `createThemeToggle` - 主题切换

### 样式优先级

Tailwind 原子类 > DaisyUI 组件 > 自定义 CSS（BEM 命名）

## 开发规范

### 新增页面流程

1. 创建 `src/pages/[页面名]/` 目录
2. 创建 `[页面名].js` 和 `[页面名].css`
3. 在 JS 中导入 CSS: `import './[页面名].css'`
4. 运行 `pnpm build` 自动构建

### 文档规则

- 所有 Markdown 文档必须放在 `docs/` 目录下
- 禁止在项目根目录创建 `.md` 文件（README.md 除外）

### Git 提交规范

遵循 Conventional Commits：`<类型>(<范围>): <描述>`

类型：`feat`, `fix`, `refactor`, `style`, `perf`, `docs`, `build`, `chore`

## 同步检查清单

### 版本号同步

修改版本号时，必须同步更新以下文件：

- `package.json` - `version` 字段
- `theme.yaml` - `version` 字段
- `example-config.json` - `version` 字段

### 配置项同步

修改 `settings.yaml` 中的配置项时，检查是否需要同步更新：

- `example-config.json` - 示例配置文件，需保持与 settings.yaml 结构一致

### 文档同步

进行以下修改时，检查是否需要更新 `README.md` 和 `docs/` 目录下的相关文档：

- 新增功能或配置项
- 修改现有功能的行为
- 修改 API 或组件接口
- 修改构建流程或开发规范
- 修改环境要求或依赖版本

## 环境要求

- Node.js 20+
- pnpm 10+
- Java 21+ (Halo 运行环境)
- Halo 2.22.9+
