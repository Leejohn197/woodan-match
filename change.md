# Wood Match 迁移变更记录

## 迁移概要

从原生 HTML/CSS/JS 迁移到 Astro + React + Tailwind v4

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| `index.html` | `src/pages/index.astro` | 入口页面 |
| `styles.css` (1303行) | `src/styles/global.css` (95行) | 仅保留主题+动画 |
| `game.js` (886行) | `src/components/Game.jsx` (766行) | React 组件化 |
| `assets/images/*` | `public/images/*` | 静态资源 |

---

## 关键架构变更

### 1. 状态管理: `gameState` → `useState`

```javascript
// 原始 game.js
const gameState = {
    currentLevel: 1,
    currentLang: 'id',
    tiles: [],
    slots: [],
    soundEnabled: true,
    isGameOver: false,
    isVictory: false
};
```

```jsx
// 新 Game.jsx
const [currentLevel, setCurrentLevel] = useState(1);
const [currentLang, setCurrentLang] = useState('id');
const [tiles, setTiles] = useState([]);
const [slots, setSlots] = useState([]);
const [soundEnabled, setSoundEnabled] = useState(true);
const [isGameOver, setIsGameOver] = useState(false);
const [isVictory, setIsVictory] = useState(false);
// 新增
const [currentScreen, setCurrentScreen] = useState('start');
const [activeModal, setActiveModal] = useState(null);
const [exitingTiles, setExitingTiles] = useState(new Set());
const [removingSlots, setRemovingSlots] = useState(new Set());
```

### 2. DOM 操作 → JSX 声明式渲染

```javascript
// 原始: 命令式 DOM 创建
const tileEl = document.createElement('div');
tileEl.innerHTML = `<img src="${tile.image}">`;
elements.tileContainer.appendChild(tileEl);
```

```jsx
// 新: 声明式 JSX 映射
{tiles.map(tile => (
  <div key={tile.id}>
    <img src={tile.image} />
  </div>
))}
```

### 3. DOM 引用 → 条件渲染

```javascript
// 原始: 27个 DOM 引用
const elements = {
    startScreen: document.getElementById('start-screen'),
    victoryModal: document.getElementById('victory-modal'),
    // ...
};
elements.victoryModal.classList.add('active');
```

```jsx
// 新: 条件渲染
{currentScreen === 'start' && <StartScreen />}
{activeModal === 'victory' && <VictoryModal />}
```

### 4. 事件监听 → JSX 事件属性

```javascript
// 原始
elements.startBtn.addEventListener('click', startGame);
```

```jsx
// 新
<button onClick={startGame}>开始</button>
```

---

## 样式迁移: CSS → Tailwind

### global.css 保留内容
- `@theme` 配置 (颜色、间距、动画)
- `@keyframes` 动画定义 (无法用 Tailwind 实现)
- 基础 `body` 样式 (背景图)

### Game.jsx 样式对象

```jsx
const styles = {
  glass: 'bg-white/65 backdrop-blur-[10px] border border-[rgba(139,90,43,0.15)]',
  tile: 'bg-gradient-to-br from-tile-cream via-tile-beige to-tile-sand rounded-xl ...',
  tileBlocked: 'brightness-[0.7] cursor-not-allowed',
  btnPrimary: 'bg-gradient-to-br from-wood-golden to-wood-warm shadow-[...] ...',
  slot: 'bg-[rgba(139,90,43,0.08)] border-2 border-dashed border-[rgba(139,90,43,0.25)]',
  modal: 'bg-gradient-to-br from-tile-cream to-tile-beige shadow-[...] ...',
  textGradient: 'bg-gradient-to-br from-wood-dark via-wood-medium to-wood-warm bg-clip-text text-transparent',
};
```

---

## 新增功能

| 功能 | 实现方式 |
|------|----------|
| 动画状态追踪 | `exitingTiles`, `removingSlots` (Set) |
| 屏幕切换 | `currentScreen` state |
| 模态框控制 | `activeModal` state |

---

## 运行命令

```bash
cd my-game-refactor
npm install
npm run dev        # 开发 http://localhost:4321
npm run build      # 生产构建
```

---

## 文件结构

```
my-game-refactor/
├── public/
│   └── images/          # 游戏图片资源
├── src/
│   ├── components/
│   │   └── Game.jsx     # 主游戏组件
│   ├── pages/
│   │   └── index.astro  # 入口页面
│   └── styles/
│       └── global.css   # Tailwind 主题 + 动画
├── astro.config.mjs
└── package.json
```

---

## 2025-01-15: 幸运转盘重新设计

### 变更内容

废弃 `conic-gradient` 扇形布局，改用 **CSS Transform 绝对定位** 技巧：

| 修改项 | 原实现 | 新实现 |
|--------|--------|--------|
| 背景 | `conic-gradient` 扇形渐变 | 淡雅木色圆环 (`bg-tile-cream`) |
| 奖品布局 | 三角函数计算坐标 | `origin-bottom` + `rotate()` |
| 奖品展示 | 纯文字标签 | emoji 图标 + 文字 |
| 指针 | 简单三角形 | 增强阴影 + 基座装饰 |
| 中心按钮 | 从 `from-red-500 to-red-700` | 更强 CTA 效果 + 悬停放大 |

### 核心 CSS 技巧

```jsx
// 每个奖品是从圆心向外延伸的"长条"
<div
  className="absolute left-1/2 top-0 h-1/2 w-16 -translate-x-1/2 origin-bottom"
  style={{ transform: `translateX(-50%) rotate(${rotationAngle}deg)` }}
>
  {/* 图标需要反向旋转保持正立 */}
  <div style={{ transform: `rotate(-${rotationAngle}deg)` }}>
    🪑
  </div>
</div>
```

**原理解释**：
1. 创建大圆容器 (`relative w-72 h-72`)
2. 每个奖品元素是长条形 (`h-1/2`，即半径长度)，定位在圆顶部中心
3. 设置 `origin-bottom`（旋转轴心在底部/圆心）
4. 给每个元素赋予不同的 `rotate(N deg)`，像花瓣一样散开
5. 图标内容反向旋转以保持正立

### 视觉效果

| 元素 | 样式 |
|------|------|
| 外圈装饰 | 12个白色小圆点环绕 |
| 转盘背景 | `bg-tile-cream` 奶油色 |
| 奖品容器 | 白色圆角卡片 + 阴影 |
| 已获得奖品 | 灰度 + 删除线 |
| 分隔线 | 45度偏移的淡金色线条 |
| 中心按钮 | `from-red-500 via-red-600 to-red-700` 渐变 |
| 指针 | 红色三角 + 阴影 + 顶部基座 |
