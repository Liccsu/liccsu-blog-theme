# 主题切换功能增强设计文档

## 概述

为当前主题切换功能添加"跟随系统"选项，将默认值改为"跟随系统"，并将 UI 交互从点击循环切换改为下拉菜单三选一形式。

## 需求

1. 添加"跟随系统"（Follow System）选项到现有的浅色/深色主题切换
2. 将"跟随系统"设为默认值
3. 将 UI 从点击按钮循环切换改为下拉菜单三选一

## 设计决策

| 决策项 | 选择 | 说明 |
|--------|------|------|
| UI 形式 | 下拉菜单 | 清晰展示三个选项，符合常见设计模式 |
| 系统主题变化响应 | 实时响应 | 监听系统主题变化，自动切换 |
| 选项顺序 | 浅色 → 深色 → 跟随系统 | 手动选项在前，自动选项在后 |
| "跟随系统"图标 | 固定电脑图标 | 使用 computer-desktop 图标，明确表示当前模式 |

## 数据模型与状态管理

### 模式值

- `light` - 浅色模式
- `dark` - 深色模式
- `system` - 跟随系统

### localStorage 存储

- Key: `theme-mode`
- Value: `'light'` | `'dark'` | `'system'`

### Alpine.js 状态

```javascript
{
  mode: 'system',           // 当前模式
  isDark: false,            // 当前是否为深色（计算值）
  isDropdownOpen: false,    // 下拉菜单是否展开
  lightTheme: '',           // 浅色主题名称（从 data 属性读取）
  darkTheme: ''             // 深色主题名称（从 data 属性读取）
}
```

### 系统主题检测

```javascript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const systemIsDark = mediaQuery.matches;

// 实时监听系统主题变化
mediaQuery.addEventListener('change', (e) => {
  if (this.mode === 'system') {
    this.isDark = e.matches;
    this.applyTheme();
  }
});
```

## UI 组件设计

### 下拉菜单结构

```
┌─────────────────┐
│ [图标] ▼        │  ← 触发按钮
├─────────────────┤
│ ☀️ 浅色模式     │
│ 🌙 深色模式     │
│ 💻 跟随系统 ✓   │  ← 当前选中项显示勾选
└─────────────────┘
```

### 图标映射

| 模式 | 图标 | Heroicons 名称 |
|------|------|----------------|
| 浅色 | ☀️ | sun |
| 深色 | 🌙 | moon |
| 跟随系统 | 💻 | computer-desktop |

### 样式

- 复用现有 DaisyUI dropdown 组件样式
- 选中项显示勾选标记或高亮背景
- 保持与导航栏其他按钮一致的尺寸和间距

## 初始化脚本与闪烁防护

### theme-script.html 逻辑

```javascript
(function() {
  const savedMode = localStorage.getItem('theme-mode');
  const showThemeToggle = /* 从配置读取 */;
  const defaultTheme = /* 从配置读取 */;

  // 向后兼容：旧值映射
  let mode = savedMode;
  if (savedMode === 'light_theme') mode = 'light';
  if (savedMode === 'dark_theme') mode = 'dark';

  // 新用户默认使用 system
  if (!mode) {
    mode = defaultTheme === 'system' ? 'system' :
           defaultTheme === 'dark_theme' ? 'dark' : 'light';
  }

  // 计算实际主题
  let isDark;
  if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = mode === 'dark';
  }

  // 应用主题
  const theme = isDark ? darkTheme : lightTheme;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
})();
```

### 向后兼容

| 旧 localStorage 值 | 新值 |
|-------------------|------|
| `light_theme` | `light` |
| `dark_theme` | `dark` |
| (无) | `system`（新用户默认） |

## 文件变更清单

### 1. `src/common/js/alpine-modules.js`

**变更内容**：重构 `createThemeToggle()` 函数

- 将 `isDark: boolean` 改为 `mode: 'light' | 'dark' | 'system'`
- 添加 `isDropdownOpen` 状态
- 添加 `setMode(mode)` 方法替代 `toggleTheme()`
- 添加系统主题变化监听器
- 更新 `init()` 方法处理三种模式和向后兼容

### 2. `templates/modules/theme-script.html`

**变更内容**：更新内联脚本

- 处理三种模式值
- 添加向后兼容逻辑
- 支持 `system` 模式的系统主题检测

### 3. `templates/modules/nav.html`

**变更内容**：将按钮改为下拉菜单

- 移除原有的单按钮切换 UI
- 添加 DaisyUI dropdown 组件
- 三个选项：浅色、深色、跟随系统
- 显示当前选中状态

### 4. `settings.yaml`

**变更内容**：更新 `default_theme` 配置

- 添加 `system` 选项
- 将 `system` 设为默认值
- 更新选项标签

```yaml
default_theme:
  name: default_theme
  label: 默认主题
  type: select
  default: system
  options:
    - label: 跟随系统
      value: system
    - label: 浅色主题
      value: light_theme
    - label: 深色主题
      value: dark_theme
```

### 5. `example-config.json`

**变更内容**：同步配置示例

- 将 `theme_settings.default_theme` 从 `"light_theme"` 改为 `"system"`

## 测试要点

1. **模式切换**：三种模式之间切换正常
2. **持久化**：刷新页面后保持用户选择
3. **系统跟随**：选择"跟随系统"后，修改系统主题能实时响应
4. **向后兼容**：旧用户的 localStorage 值能正确迁移
5. **闪烁防护**：页面加载时无主题闪烁
6. **新用户默认**：新用户默认使用"跟随系统"模式
