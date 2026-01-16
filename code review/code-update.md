# 代码更新日志

## 2026-01-16 PremiumShareCard 分享功能

### 功能概述

添加了一个高级游戏分享卡片组件，支持二维码分享功能。用户可以在游戏主页点击分享按钮，弹出专业的分享卡片，截图后分享给好友。

### 设计特性

| 特性 | 说明 |
|------|------|
| 🪵 圆角卡片 | 24px 圆角设计 |
| 🖼️ 游戏背景 | 使用 `/images/background.jpg` 作为卡片背景 |
| ✨ 磨砂玻璃效果 | backdrop-blur 模糊 + 半透明渐变叠加层 |
| 📱 嵌入式二维码 | 内阴影营造凹陷浮雕效果，看起来像"嵌"进去 |
| 🎯 悬停动画 | 鼠标悬停时背景图缓慢放大 1.1 倍 |
| 🎨 木纹主题 | 与游戏整体视觉风格一致 |

---

### 新增文件

#### 1. `src/components/PremiumShareCard.jsx`

高级分享卡片核心组件，包含：
- 游戏背景图层（带悬停放大动画）
- 磨砂玻璃叠加层
- 标题区域（木头 emoji + "Wood Match" 标题）
- 二维码框架（浮雕嵌入效果）
- 底部副标题

**Props:**
```jsx
<PremiumShareCard 
  shareUrl="https://your-url.com"  // 二维码链接
  title="Wood Match"               // 卡片标题
  subtitle="🪵 扫码一起玩"          // 底部副标题
/>
```

#### 2. `src/components/modals/ShareModal.jsx`

分享弹窗组件，包装 PremiumShareCard，提供：
- 半透明背景遮罩
- 关闭按钮（右上角 X）
- 点击遮罩关闭功能
- 底部截图分享提示

**Props:**
```jsx
<ShareModal
  t={t}                    // 翻译函数
  shareUrl="https://..."   // 分享链接
  onClose={() => {}}       // 关闭回调
/>
```

#### 3. `src/pages/share-card-demo.astro`

PremiumShareCard 预览演示页面，访问 `/share-card-demo` 可查看组件效果。

---

### 修改文件

#### 1. `src/components/Game.jsx`

- 导入 `ShareModal` 组件
- 添加 `state.activeModal === 'share'` 条件渲染 ShareModal
- 向 StartScreen 传递 `onShare` prop

#### 2. `src/components/StartScreen.jsx`

- 新增 `onShare` prop
- 添加「📲 分享」按钮（位于开始游戏按钮下方）
- 使用 glass 样式的次要按钮样式

#### 3. `src/config/translations.js`

添加分享相关的多语言翻译：

| Key | ID (印尼语) | ZH (中文) | EN (英语) |
|-----|------------|----------|----------|
| `share` | Bagikan | 分享 | Share |
| `scanToPlay` | 🪵 Scan untuk main bersama | 🪵 扫码一起玩 | 🪵 Scan to play together |
| `screenshotToShare` | Screenshot untuk dibagikan ke teman | 截图分享给好友 | Screenshot to share with friends |
| `inviteFriends` | Ajak teman bermain bersama | 邀请好友一起来玩 | Invite friends to play |

---

### 新增依赖

```bash
npm install qrcode.react
```

用于生成二维码的 React 组件库。

---

### 使用流程

1. 用户在游戏主页看到「📲 分享」按钮
2. 点击按钮弹出 ShareModal
3. 弹窗中显示 PremiumShareCard（带二维码）
4. 用户截图后可分享给好友
5. 好友扫描二维码即可访问游戏

---

### 效果预览

- 悬停卡片时背景会缓慢放大，增加动感
- 二维码有凹陷嵌入效果，看起来非常专业
- 支持三语言（印尼语、中文、英语）
