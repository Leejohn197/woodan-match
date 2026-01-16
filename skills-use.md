# UI UX Pro Max Skill 使用指南

## 📦 已安装文件

```
.agent/workflows/ui-ux-pro-max.md
.shared/ui-ux-pro-max/
```

---

## 🚀 使用方法

### 方法一：Slash 命令（推荐）

```
/ui-ux-pro-max 你的需求描述
```

**示例：**
```
/ui-ux-pro-max Build a landing page for my SaaS product
/ui-ux-pro-max Create a dashboard for healthcare analytics
/ui-ux-pro-max Design a portfolio website with dark mode
/ui-ux-pro-max Make a mobile app UI for e-commerce
```

### 方法二：自然语言

直接描述 UI/UX 需求，Skill 会自动激活：

```
帮我设计一个现代化的登录页面
创建一个数据分析仪表盘
设计一个电商产品详情页
```

---

## 🎨 Skill 功能

| 功能 | 数量 |
|------|------|
| UI 风格 | 57 种 (Glassmorphism, Neumorphism, Bento Grid 等) |
| 配色方案 | 95 套 (SaaS、电商、医疗、金融等) |
| 字体搭配 | 56 组 (含 Google Fonts) |
| 图表类型 | 24 种 |
| 技术栈指南 | 11 种 |
| UX 最佳实践 | 98 条 |

---

## 🛠 支持的技术栈

- HTML + Tailwind (默认)
- React / Next.js / shadcn/ui
- Vue / Nuxt.js / Nuxt UI
- Svelte
- SwiftUI
- React Native
- Flutter

> 💡 在 prompt 中指定技术栈，例如：`/ui-ux-pro-max 用 React 创建一个登录页面`

---

## 📋 CLI 命令

```bash
# 查看可用版本
uipro versions

# 更新到最新版本
uipro update

# 安装特定版本
uipro init --version v1.0.0

# 为其他 AI 助手安装
uipro init --ai claude      # Claude Code
uipro init --ai cursor      # Cursor
uipro init --ai copilot     # GitHub Copilot
uipro init --ai all         # 所有助手
```
