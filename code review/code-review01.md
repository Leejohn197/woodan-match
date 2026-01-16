# Wood Match 项目代码审查报告

**审查日期**: 2026-01-16  
**审查人**: AI Assistant

---

## 🔍 审查范围
| 文件 | 行数 | 评估 |
|------|------|------|
| [Game.jsx](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx) | 1245 | 主要审查对象 |
| [global.css](file:///Users/lty/Documents/Wood%20match/src/styles/global.css) | 137 | ✅ 结构良好 |
| [index.astro](file:///Users/lty/Documents/Wood%20match/src/pages/index.astro) | 19 | ✅ 简洁清晰 |

---

## 🚨 核心问题总结

| 维度 | 评分 | 主要问题 |
|------|------|----------|
| 可读性 (Readable) | ⭐⭐☆☆☆ | 单文件1245行，缺乏模块化 |
| 可维护性 (Maintainable) | ⭐⭐☆☆☆ | 配置与逻辑混合，硬编码多 |
| 可扩展性 (Scalable) | ⭐⭐☆☆☆ | 添加新关卡/功能需修改多处 |
| 状态管理 (State) | ⭐⭐⭐☆☆ | useState过多，缺乏聚合 |

---

## 1️⃣ 可读性问题 (Readable)

### 问题 1.1: 单文件过大 (1245 行)
**位置**: [Game.jsx:1-1245](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx)

当前所有内容都在一个文件中：
- 翻译数据 (Lines 4-135)
- 主题配置 (Lines 138-163)
- 关卡配置 (Lines 166-206)
- 转盘奖品配置 (Lines 209-218)
- 样式常量 (Lines 223-260)
- 工具函数 (Lines 263-367)
- 主组件 (Lines 370-1244)

**建议重构目录结构**:
```
src/
├── components/
│   ├── Game.jsx           # 主游戏逻辑 (~300行)
│   ├── StartScreen.jsx    # 开始界面
│   ├── GameBoard.jsx      # 游戏面板
│   ├── SpinWheel.jsx      # 转盘组件
│   └── modals/
│       ├── VictoryModal.jsx
│       ├── GameOverModal.jsx
│       └── ClaimModal.jsx
├── config/
│   ├── translations.js    # 多语言配置
│   ├── levels.js          # 关卡配置
│   ├── prizes.js          # 奖品配置
│   └── themes.js          # 主题配置
├── hooks/
│   ├── useGameState.js    # 游戏状态 hook
│   └── useAudio.js        # 音频控制 hook
└── utils/
    ├── audio.js           # 音频函数
    └── helpers.js         # 工具函数
```

### 问题 1.2: 长 JSX 模板难以阅读
**位置**: [Game.jsx:750-1242](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L750-L1242)

单个 return 语句包含 ~500 行 JSX，包含多个条件渲染和复杂嵌套。

**建议**: 拆分为独立组件
```jsx
// 改进后
return (
  <div className="flex justify-center items-center min-h-screen">
    {currentScreen === 'start' && <StartScreen onStart={startGame} />}
    {currentScreen === 'game' && <GameBoard tiles={tiles} slots={slots} />}
    {activeModal && <ModalManager type={activeModal} />}
  </div>
);
```

---

## 2️⃣ 可维护性问题 (Maintainable)

### 问题 2.1: 硬编码魔法数字
**位置**: 多处

```jsx
// Line 459-461: 硬编码尺寸
const tileWidth = 60;
const tileHeight = 70;
const containerWidth = 320;

// Line 510: 硬编码冷却时间
const cooldown = 10000; // 10 seconds cooldown

// Line 625: 硬编码槽位限制
if (slots.length >= 7 && !isGameOver) { ... }
```

**建议**: 集中到配置文件
```javascript
// config/constants.js
export const GAME_CONSTANTS = {
  TILE_WIDTH: 60,
  TILE_HEIGHT: 70,
  SLOT_LIMIT: 7,
  COOLDOWN_MS: 10000,
  MATCH_COUNT: 3,
};
```

### 问题 2.2: CSS 类名与逻辑混合
**位置**: [Game.jsx:222-260](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L222-L260)

Tailwind 类名字符串直接定义在组件内部：
```jsx
const styles = {
  tile: `
    bg-gradient-to-br from-tile-cream via-tile-beige to-tile-sand
    rounded-xl select-none
    shadow-[0_6px_16px_rgba(139,90,43,0.20),...]
  `,
};
```

**建议**: 使用 CSS 模块或独立样式文件提高可维护性。

### 问题 2.3: 翻译数据与代码耦合
**位置**: [Game.jsx:4-135](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L4-L135)

130+ 行翻译数据直接写在组件文件中。

**建议**: 分离为独立的 i18n 文件
```javascript
// i18n/id.json, i18n/zh.json
export { TRANSLATIONS } from './i18n';
```

---

## 3️⃣ 可扩展性问题 (Scalable)

### 问题 3.1: 添加新关卡需修改多处
当前添加 Level 4 需要修改：
1. `LEVEL_CONFIGS` 对象
2. `FURNITURE_THEMES` 添加新主题
3. `TRANSLATIONS` 添加新的 key
4. `MAX_LEVEL` 常量
5. UI 中的关卡展示逻辑

**建议**: 使用配置驱动的设计
```javascript
// config/levels.js
export const levels = [
  { id: 1, theme: 'livingRoom', reward: 'consolation', ...config },
  { id: 2, theme: 'outdoor', reward: 'small', ...config },
  // 只需添加一行即可扩展
];
```

### 问题 3.2: 转盘奖品扩展困难
**位置**: [Game.jsx:209-218](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L209-L218) 和 [Lines 1011-1021](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L1011-L1021)

转盘扇区数量硬编码为 8，且 CSS 渐变直接写死：
```jsx
background: `conic-gradient(
  ${WHEEL_PRIZES[0].color} 0deg 45deg,
  ${WHEEL_PRIZES[1].color} 45deg 90deg,
  // ... 写死8个扇区
)`
```

**建议**: 动态生成
```javascript
const generateGradient = (prizes) => {
  const angle = 360 / prizes.length;
  return prizes.map((p, i) => 
    `${p.color} ${i * angle}deg ${(i + 1) * angle}deg`
  ).join(', ');
};
```

---

## 4️⃣ 状态管理问题 (State Management)

### 问题 4.1: 过多独立的 useState
**位置**: [Game.jsx:371-391](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L371-L391)

当前有 **17 个独立的 useState**：
```jsx
const [currentScreen, setCurrentScreen] = useState('start');
const [currentLevel, setCurrentLevel] = useState(1);
const [currentLang, setCurrentLang] = useState('id');
const [soundEnabled, setSoundEnabled] = useState(true);
const [tiles, setTiles] = useState([]);
const [slots, setSlots] = useState([]);
const [isGameOver, setIsGameOver] = useState(false);
const [isVictory, setIsVictory] = useState(false);
const [activeModal, setActiveModal] = useState(null);
const [exitingTiles, setExitingTiles] = useState(new Set());
const [removingSlots, setRemovingSlots] = useState(new Set());
const [isMatching, setIsMatching] = useState(false);
const [cooldownRemaining, setCooldownRemaining] = useState(0);
const [isSpinning, setIsSpinning] = useState(false);
const [wheelRotation, setWheelRotation] = useState(0);
const [wheelResult, setWheelResult] = useState(null);
const [claimedRewardLevel, setClaimedRewardLevel] = useState(null);
const [wonPrizes, setWonPrizes] = useState([]);
```

**建议**: 使用 useReducer 聚合相关状态
```javascript
// hooks/useGameState.js
const initialState = {
  screen: 'start',
  level: 1,
  tiles: [],
  slots: [],
  gameStatus: 'idle', // 'idle' | 'playing' | 'victory' | 'gameover'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': return { ...state, screen: 'game', ... };
    case 'TILE_CLICK': return { ...state, ... };
    case 'MATCH_FOUND': return { ...state, ... };
    // ...
  }
}

const [gameState, dispatch] = useReducer(gameReducer, initialState);
```

### 问题 4.2: 状态派生值可优化
**位置**: [Game.jsx:746-748](file:///Users/lty/Documents/Wood%20match/src/components/Game.jsx#L746-L748)

```jsx
const config = LEVEL_CONFIGS[currentLevel];
const totalTiles = config.types * config.tilesPerType;
const progress = ((totalTiles - tiles.length) / totalTiles) * 100;
```

**建议**: 使用 useMemo 缓存派生状态
```jsx
const { config, totalTiles, progress } = useMemo(() => {
  const config = LEVEL_CONFIGS[currentLevel];
  const totalTiles = config.types * config.tilesPerType;
  const progress = ((totalTiles - tiles.length) / totalTiles) * 100;
  return { config, totalTiles, progress };
}, [currentLevel, tiles.length]);
```

### 问题 4.3: localStorage 操作分散
**位置**: 多处分散的 localStorage 调用

```jsx
// Line 397-428: 加载语言和奖品
// Line 507-515: 检查冷却
// Line 519-522: 记录游戏会话
// Line 637-639: 保存语言
// Line 717-719: 保存已获奖品
```

**建议**: 创建统一的持久化层
```javascript
// utils/storage.js
const STORAGE_KEYS = {
  LANG: 'woodmatch_lang',
  WON_PRIZES: 'woodmatch_wonPrizes',
  LAST_PLAYED: 'woodmatch_lastPlayed',
  PRIZE_DATE: 'woodmatch_prizeDate',
};

export const storage = {
  getLang: () => localStorage.getItem(STORAGE_KEYS.LANG),
  setLang: (lang) => localStorage.setItem(STORAGE_KEYS.LANG, lang),
  // ...
};
```

---

## ✅ 代码亮点

1. **良好的音频/触感反馈实现** - Lines 274-367
2. **清晰的动画 CSS 定义** - global.css
3. **合理的 useCallback 使用** - 防止不必要的重渲染
4. **多语言支持架构** - 便于国际化扩展
5. **注释标记清晰** - `// =====` 分隔符易于导航

---

## 📋 重构优先级建议

| 优先级 | 任务 | 预估工时 |
|--------|------|----------|
| 🔴 P0 | 拆分 Game.jsx 为多个组件 | 4-6h |
| 🔴 P0 | 抽离配置数据到独立文件 | 2-3h |
| 🟡 P1 | 使用 useReducer 重构状态 | 3-4h |
| 🟡 P1 | 创建统一的 localStorage 管理 | 1-2h |
| 🟢 P2 | 提取常量消除魔法数字 | 1h |
| 🟢 P2 | 转盘组件动态化 | 2h |

---

## 总结

该项目作为一个游戏原型已经能够正常运行，但存在明显的**单文件单组件**问题。主要改进方向：

1. **模块化**: 将 1245 行的单文件拆分为职责清晰的模块
2. **配置分离**: 数据与逻辑解耦，便于非开发人员修改
3. **状态聚合**: 使用 useReducer 管理复杂游戏状态
4. **持久化封装**: 统一的存储访问层
