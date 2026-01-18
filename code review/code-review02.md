# 🔍 Code Review Report - Wood Match 游戏

> 作为 10 年高级前端开发工程师的专业代码审查

---

## 📊 总体评价

| 评估维度 | 评分 | 说明 |
|---------|------|------|
| 代码结构 | ⭐⭐⭐⭐ | 组件拆分合理，hooks 封装得当 |
| 可维护性 | ⭐⭐⭐ | 存在一些可改进的地方 |
| 性能 | ⭐⭐⭐ | 有优化空间 |
| 类型安全 | ⭐⭐ | 缺少 TypeScript |
| 测试覆盖 | ⭐ | 未发现测试文件 |

---

## 🚨 严重问题 (P0)

### 1. React 状态时序问题
**文件**: `src/components/Game.jsx` (第 67-72 行)

```javascript
const handleNextLevel = useCallback(() => {
    actions.nextLevel();
    setTimeout(() => actions.startGame(), 500);  // ⚠️ 依赖 setTimeout 不可靠
}, [actions]);
```

**问题**: 使用 `setTimeout` 等待状态更新是**反模式**。React 状态更新时机不可预测，500ms 在某些设备上可能不够。

**建议方案**:
```javascript
// 方案 A: 使用 useEffect 监听 currentLevel 变化
useEffect(() => {
    if (shouldStartNextLevel) {
        actions.startGame();
    }
}, [state.currentLevel]);

// 方案 B: 让 nextLevel 接受回调
actions.nextLevel(() => actions.startGame());
```

---

### 2. 转盘旋转计算逻辑混乱
**文件**: `src/hooks/useGameState.js` (第 509-531 行)

**问题**: 转盘角度计算多次修改仍有问题，说明缺乏**单元测试**和**清晰的数学模型文档**。

**建议**:
1. 抽取为独立纯函数，便于测试:
```javascript
// utils/wheelCalculation.js
export function calculateWheelRotation(prizeIndex, totalPrizes, baseSpins) {
    const segmentAngle = 360 / totalPrizes;
    return baseSpins * 360 + prizeIndex * segmentAngle;
}
```
2. 添加单元测试验证各种边界情况

---

## ⚠️ 重要问题 (P1)

### 3. useCallback 依赖项不完整
**文件**: `src/hooks/useGameState.js` (第 486-541 行)

```javascript
const spinWheel = useCallback(() => {
    // 使用了 state.isSpinning, state.wonPrizes, state.wheelResult
    // ...
    const prizeIndex = WHEEL_PRIZES.findIndex(...);  // ⚠️ WHEEL_PRIZES 未在依赖中
}, [state.isSpinning, state.wonPrizes, state.wheelResult]);
```

虽然 `WHEEL_PRIZES` 是常量不会变化，但 ESLint 规则可能会报警告。

---

### 4. 重复的 Helper 函数
**文件**: `src/hooks/useGameState.js`

```javascript
// 第 81-93 行: checkBlockedTilesHelper (模块级)
function checkBlockedTilesHelper(tileList) { ... }

// 第 325-337 行: checkBlockedTiles (hook 内 useCallback)
const checkBlockedTiles = useCallback((tileList) => { ... }, []);
```

**问题**: 两个函数**完全相同**！一个在 reducer 中使用，一个在 hook 中使用。应该统一。

**建议**: 只保留模块级函数，删除 hook 内的重复定义。

---

### 5. Magic Numbers
**文件**: `src/hooks/useGameState.js` (第 87-89 行)

```javascript
const overlapX = Math.abs(tile.x - otherTile.x) < 40;  // ⚠️ 40 是什么？
const overlapY = Math.abs(tile.y - otherTile.y) < 50;  // ⚠️ 50 是什么？
```

这些数字应该提取到 `GAME_CONSTANTS` 中:
```javascript
TILE_OVERLAP_THRESHOLD_X: 40,
TILE_OVERLAP_THRESHOLD_Y: 50,
```

---

## 💡 改进建议 (P2)

### 6. 缺少 TypeScript
整个项目使用 JavaScript，缺少类型安全。对于游戏逻辑这种复杂场景，TypeScript 可以:
- 防止 `tile.type` vs `tile.id` 混淆
- 明确 `WHEEL_PRIZES` 的结构
- 减少运行时错误

---

### 7. 缺少测试
未发现任何测试文件。建议添加:
- **单元测试**: 转盘计算、碰撞检测、匹配逻辑
- **组件测试**: 关键交互流程
- **E2E 测试**: 完整游戏流程

---

### 8. localStorage 错误处理可以更健壮
**文件**: `src/utils/storage.js`

```javascript
getLang: () => {
    const lang = localStorage.getItem(STORAGE_KEYS.LANG);
    return (lang === 'id' || lang === 'zh') ? lang : 'id';
},
```

**建议**: 增加 try-catch，某些浏览器隐私模式下 localStorage 可能抛出异常。

```javascript
getLang: () => {
    try {
        const lang = localStorage.getItem(STORAGE_KEYS.LANG);
        return (lang === 'id' || lang === 'zh') ? lang : 'id';
    } catch {
        return 'id';
    }
},
```

---

### 9. UUID 生成器可以使用原生 API
**文件**: `src/utils/helpers.js`

```javascript
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ...);
}
```

现代浏览器支持 `crypto.randomUUID()`:
```javascript
export function generateUUID() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // fallback...
}
```

---

### 10. 组件 Props 解构位置不一致
某些组件在函数参数中解构，某些在函数体内。建议统一风格。

---

## ✅ 做得好的地方

1. **状态管理**: 使用 `useReducer` 管理复杂状态，action types 定义清晰
2. **配置分离**: 关卡、奖品、翻译等配置独立文件
3. **样式封装**: `styles` 对象集中管理 Tailwind 类名组合
4. **存储层抽象**: `storage.js` 封装了所有 localStorage 操作

---

## 📝 优先级行动计划

| 优先级 | 问题 | 建议行动 |
|--------|------|----------|
| P0 | 状态时序问题 | 重构为 useEffect 监听模式 |
| P0 | 转盘计算 | 抽取纯函数 + 添加单元测试 |
| P1 | 重复代码 | 删除 hook 内重复的 helper |
| P1 | Magic Numbers | 提取到 constants |
| P2 | TypeScript | 逐步迁移 |
| P2 | 测试 | 从核心逻辑开始添加 |

---

*Code Review by Senior Frontend Engineer | 2026-01-18*
