# Wood Match 代码审查问题清单

> 审查日期: 2026-01-16  
> 审查范围: 轮盘抽奖逻辑、状态管理、事件处理

---

## 🔴 已修复问题

### 1. ✅ 轮盘角度计算错误

| 属性 | 内容 |
|------|------|
| **文件** | `src/hooks/useGameState.js` |
| **行号** | 483-492 |
| **问题** | 指针在12点钟位置，但角度计算基于3点钟起点，缺少90°偏移 |
| **结果** | 指向"五折优惠"却显示"代金券" |
| **状态** | ✅ 已修复 |

```diff
- const finalAngle = 360 * BASE_SPINS + prizeCenter;
+ const targetAngle = 360 - prizeCenter + 90;
+ const finalAngle = 360 * BASE_SPINS + targetAngle;
```

---

### 2. ✅ 翻译文案不友好

| 属性 | 内容 |
|------|------|
| **文件** | `src/config/translations.js` |
| **行号** | 65, 135, 205 |
| **问题** | "所有奖品已领取！"文案过于生硬 |
| **状态** | ✅ 已修复 |

```diff
- allPrizesWon: '所有奖品已领取！'
+ allPrizesWon: '您已获得所有奖品，感谢您的参与！'
```

---

## 🔴 待修复问题 - 高优先级

### 3. ⚠️ setTimeout 过期状态闭包

| 属性 | 内容 |
|------|------|
| **文件** | `src/hooks/useGameState.js` |
| **行号** | 496-502 |
| **问题** | `state.wonPrizes` 在 setTimeout 回调中是闭包捕获时的旧值 |
| **影响** | 本地存储可能与状态不一致，奖品可能丢失 |
| **状态** | ❌ 待修复 |

```javascript
// 问题代码
setTimeout(() => {
    storage.setWonPrizes([...state.wonPrizes, selectedPrize.id]); // 使用过期状态
}, 6500);
```

**建议修复方案**:
```javascript
// 方案1: 在 reducer 中处理存储
case ActionTypes.COMPLETE_SPIN: {
    const newWonPrizes = [...state.wonPrizes, prizeId];
    storage.setWonPrizes(newWonPrizes);  // 同步保存
    return { ...state, wonPrizes: newWonPrizes };
}
```

---

### 4. ⚠️ setTimeout 缺少取消机制

| 属性 | 内容 |
|------|------|
| **文件** | `src/hooks/useGameState.js` |
| **行号** | 363-368, 396-401, 496-502 |
| **问题** | 用户快速返回主菜单时，定时器仍会执行 dispatch |
| **影响** | 可能导致状态不一致或错误的状态更新 |
| **状态** | ❌ 待修复 |

**涉及的 setTimeout**:
1. `handleTileClick` - 300ms 后移动瓷砖
2. `checkMatches` - 300ms 后清除匹配
3. `spinWheel` - 6500ms 后完成抽奖

**建议修复方案**:
```javascript
const timerRef = useRef(null);

// 设置定时器时保存引用
timerRef.current = setTimeout(() => { ... }, delay);

// 在 START_GAME 或 goToHome 时取消
useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
}, []);
```

---

## 🟠 待修复问题 - 中优先级

### 5. ⚠️ 双击竞态窗口

| 属性 | 内容 |
|------|------|
| **文件** | `src/components/SpinWheel.jsx` |
| **行号** | 112-113 |
| **问题** | 在 `isSpinning` 设置之前存在微小时间窗口 |
| **影响** | 快速双击可能触发两次抽奖 |
| **状态** | ❌ 待修复 |

**建议修复方案**:
```javascript
const isClickingRef = useRef(false);

const handleSpin = useCallback(() => {
    if (isClickingRef.current) return;
    isClickingRef.current = true;
    onSpin();
    setTimeout(() => { isClickingRef.current = false; }, 100);
}, [onSpin]);
```

---

## ✅ 已验证无问题

| 检查项 | 状态 |
|--------|------|
| 瓷砖重复点击保护 (`exitingTiles.has`) | ✅ 正常 |
| 匹配动画中阻止操作 (`isMatching`) | ✅ 正常 |
| 游戏结束状态保护 (`isGameOver`/`isVictory`) | ✅ 正常 |
| 轮盘转动中保护 (`isSpinning`) | ✅ 正常 |
| 奖品标签与颜色对齐 | ✅ 正常 |
| 扇区分割线位置 | ✅ 正常 |
| 瓷砖位置计算 | ✅ 正常 |
| 碰撞检测逻辑 | ✅ 正常 |
| 加权随机选择算法 | ✅ 正常 |

---

## 📊 问题统计

| 类别 | 数量 |
|------|------|
| 🔴 已修复 | 2 |
| 🔴 高优先级待修复 | 2 |
| 🟠 中优先级待修复 | 1 |
| 🟢 低优先级 | 0 |
| **总计** | **5** |
