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

## 🚀 快速开始

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
