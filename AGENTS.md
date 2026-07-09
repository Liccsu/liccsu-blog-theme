# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概述

Liccsu Blog Theme 是基于 [Sky Blog Theme](https://github.com/sky121666/halo-theme-sky-blog-1) 的 Halo 2 主题衍生版本，前端采用 Vite + Tailwind CSS v4 + DaisyUI 5 + Alpine.js，模板层使用 Thymeleaf 与 Halo 主题机制集成。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm build-only
pnpm lint
pnpm prettier
pnpm exec tsc --noEmit
```

- `pnpm dev` 实际执行 `vite build --watch`，不是 Vite dev server。
- `pnpm build` 执行 `tsc && vite build && theme-package`，用于生成可发布主题包。
- 项目当前没有独立测试框架；单文件/单测命令暂无。验证改动通常依赖：`pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build-only`，以及按需运行 `pnpm build`。

## 构建与产物

构建链路：`src/` 源码 → Vite 多入口构建 → `templates/assets/` 前端产物 → `theme-package` 打包主题。

`vite.config.ts` 的关键约束：
- 公共入口固定为 `src/common/main.js`，产出 `templates/assets/js/main.js` 与 `templates/assets/css/main.css`。
- 页面入口通过扫描 `src/pages/**/[name].js` 自动生成，只有目录名与文件名一致的页面脚本才会被打包。
- 认证页入口单独从 `src/pages/auth/themes/{default,split,centered}.js` 映射为 `auth-*` 产物。
- `src/static/` 会在构建结束后复制到 `templates/assets/`，但 `src/static/css/article-content.css` 与 `src/static/js/article-content.js` 被显式排除，因为它们应由页面入口通过 import 纳入构建。

## 架构概览

### 前端源码与模板是双层结构

- `src/` 负责 JS/CSS 逻辑与构建。
- `templates/` 负责 Halo/Thymeleaf 页面结构与片段拼装。
- 修改页面功能时，通常要同时检查对应的 `src/pages/...` 入口和 `templates/modules/...` 模板片段是否同步。

### 公共层与页面层分离

- `src/common/main.js` 负责导入全局 CSS、基础 JS、并启动 Alpine。
- `src/common/js/alpine-modules.js` 是公共 Alpine 组件注册中心；模板中的 `x-data` 大多依赖这里。
- `src/pages/*` 下每个页面目录通常是一对 `页面名.js + 页面名.css`，页面脚本必须显式 `import './页面名.css'`，否则对应 CSS 不会产出。

### Halo 主题配置由多个文件共同决定

- `theme.yaml`：主题元数据、版本、Halo 兼容范围、自定义模板声明。
- `settings.yaml`：后台主题设置表单的主定义。
- `annotation-setting.yaml`：MenuItem、Category、Tag、Equipment 等注解扩展配置。
- 改主题版本时，至少同步检查 `package.json`、`theme.yaml`、`example-config.json`。
- 改 `settings.yaml` 配置结构时，同步检查 `example-config.json` 和 `docs/` 里的相关文档。

### 文章内容样式不是普通静态拷贝资源

`src/static/css/article-content.css` 与 `src/static/js/article-content.js` 不会被原样复制到 `templates/assets/`，而是通过页面入口间接纳入构建；修改文章内容、代码高亮、行内代码或富文本样式时，要同时确认引用它们的页面入口与最终模板是否仍然生效。

## 目录级别约束

- `templates/assets/` 是构建产物，优先通过修改 `src/` 和模板源文件后重新构建，不要手改产物。
- 所有 Markdown 文档放在 `docs/`，不要在仓库根目录新增说明文档（`README.md` 除外）。
- 新增页面时，遵循 `src/pages/[page]/[page].js` 与 `[page].css` 的命名约定，否则 `vite.config.ts` 不会将其识别为入口。

## 已有规范与外部规则

来自 `.cursor/rules/project.mdc` 与现有仓库约定：
- 文档集中放在 `docs/`。
- 提交信息遵循 Conventional Commits：`feat|fix|refactor|style|perf|docs|build|chore`。

来自 `.cursor/rules/daisyui.mdc`：
- 项目基于 Tailwind CSS 4 + DaisyUI 5，不使用 `tailwind.config.js` 旧式配置。
- 优先使用 DaisyUI 语义色与 Tailwind 工具类，尽量避免为已有组件场景新增大量自定义 CSS。
- 深浅色主题优先依赖 DaisyUI 主题变量，不要默认写死仅适配浅色主题的颜色。

## 对现有 AGENTS.md 的改进建议

当前仓库里的 AGENTS.md 已覆盖基础命令和目录说明，但还建议保留/补充以下信息：
- 明确 `pnpm dev` 是 watch build，不会启动本地开发服务器。
- 明确本项目暂无独立测试框架，常用验证手段是 `tsc` / `lint` / `build-only`。
- 强调 `vite.config.ts` 的自动入口命名规则与 `src/static/` 的排除复制逻辑。
- 强调 `templates/assets/` 属于构建产物，应通过源码重建而不是直接编辑。
- 强调文章内容样式（如高亮、inline code）来自构建链路，不是简单静态文件替换。
