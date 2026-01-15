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
