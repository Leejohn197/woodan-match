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

## 🔴 已修复问题 - 高优先级

### 3. ✅ setTimeout 过期状态闭包

| 属性 | 内容 |
|------|------|
| **文件** | `src/hooks/useGameState.js` |
| **行号** | 496-502 |
| **问题** | `state.wonPrizes` 在 setTimeout 回调中是闭包捕获时的旧值 |
| **影响** | 本地存储可能与状态不一致，奖品可能丢失 |
| **状态** | ✅ 已修复 |

**修复方案**: 将存储逻辑移入 reducer 的 `COMPLETE_SPIN` case 中
```javascript
case ActionTypes.COMPLETE_SPIN: {
    const { prizeId } = action.payload;
    const newWonPrizes = [...state.wonPrizes, prizeId];
    storage.setWonPrizes(newWonPrizes);  // 同步保存
    return { ...state, wonPrizes: newWonPrizes };
}
```

---

### 4. ✅ setTimeout 缺少取消机制

| 属性 | 内容 |
|------|------|
| **文件** | `src/hooks/useGameState.js` |
| **行号** | 363-368, 396-401, 496-502 |
| **问题** | 用户快速返回主菜单时，定时器仍会执行 dispatch |
| **影响** | 可能导致状态不一致或错误的状态更新 |
| **状态** | ✅ 已修复 |

**修复方案**: 使用 `useRef` 追踪定时器，在 `goToHome` 中清理
```javascript
const spinTimerRef = useRef(null);
const matchTimerRef = useRef(null);
const tileTimerRef = useRef(null);

const clearAllTimers = useCallback(() => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
    if (tileTimerRef.current) clearTimeout(tileTimerRef.current);
}, []);

// goToHome 调用 clearAllTimers()
```

---

## 🟠 已修复问题 - 中优先级

### 5. ✅ 双击竞态窗口

| 属性 | 内容 |
|------|------|
| **文件** | `src/components/SpinWheel.jsx` |
| **行号** | 112-113 |
| **问题** | 在 `isSpinning` 设置之前存在微小时间窗口 |
| **影响** | 快速双击可能触发两次抽奖 |
| **状态** | ✅ 已修复 |

**修复方案**: 使用 `useRef` 添加同步点击保护
```javascript
const isClickingRef = useRef(false);

const handleSpin = useCallback(() => {
    if (isClickingRef.current || isSpinning || isAllWon) return;
    isClickingRef.current = true;
    onSpin();
    setTimeout(() => { isClickingRef.current = false; }, 100);
}, [onSpin, isSpinning, isAllWon]);
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
| 🔴 已修复 | 5 |
| 🔴 高优先级待修复 | 0 |
| 🟠 中优先级待修复 | 0 |
| 🟢 低优先级 | 0 |
| **总计** | **5** |
