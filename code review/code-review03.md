# 代码审查报告 - 转盘抽奖功能

**审查日期**: 2026-01-18  
**审查范围**: 转盘抽奖相关功能代码  
**审查人**: AI Code Assistant

---

## 📋 审查文件

| 文件 | 功能 |
|------|------|
| `src/hooks/useGameState.js` | 转盘状态管理、抽奖逻辑 |
| `src/components/SpinWheel.jsx` | 转盘UI组件 |
| `src/components/modals/VictoryModal.jsx` | 胜利弹窗、结果展示 |
| `src/config/prizes.js` | 奖品配置、渐变生成 |
| `src/utils/storage.js` | 本地存储管理 |

---

## 🔴 严重问题（已修复）

### 1. 旋转方向计算错误

**问题描述**：  
原代码使用 `prizeIndex * segmentAngle` 计算旋转角度，导致指针停在错误位置。

**根因分析**：  
当轮盘顺时针旋转时，顶部的奖品会向右移动。原公式让目标奖品**远离**指针而不是**移向**指针。

**原代码**：
```javascript
const rotationToReachTop = prizeIndex * segmentAngle;
```

**修复后**：
```javascript
const targetAngle = ((WHEEL_PRIZES.length - prizeIndex) % WHEEL_PRIZES.length) * segmentAngle;
```

**修复文件**: `src/hooks/useGameState.js`

---

### 2. 累积旋转角度缺失

**问题描述**：  
每次抽奖使用绝对角度而不是累积角度，当新角度小于当前角度时，轮盘会逆时针旋转，停在错误位置。

**问题场景**：
| 抽奖次数 | 中奖索引 | 计算角度 | 实际行为 |
|---------|---------|---------|---------|
| 第1次 | index=2 | 3150° | ✅ 顺时针旋转 |
| 第2次 | index=4 | 3060° | ❌ **逆时针旋转** |

**原代码**：
```javascript
const finalAngle = baseRotation + rotationToReachTop;
```

**修复后**：
```javascript
// 计算从当前位置到目标位置需要额外旋转多少度
const currentNormalizedAngle = state.wheelRotation % 360;
let additionalToTarget = targetAngle - currentNormalizedAngle;
if (additionalToTarget <= 0) {
    additionalToTarget += 360;  // 确保始终顺时针
}
const finalAngle = state.wheelRotation + baseRotation + additionalToTarget;
```

**修复文件**: `src/hooks/useGameState.js`

---

### 3. useCallback 依赖数组不完整

**问题描述**：  
`spinWheel` 函数使用了 `state.wheelRotation`，但依赖数组中未包含它，导致闭包捕获过时的值。

**原代码**：
```javascript
}, [state.isSpinning, state.wonPrizes, state.wheelResult]);
```

**修复后**：
```javascript
}, [state.isSpinning, state.wonPrizes, state.wheelResult, state.wheelRotation]);
```

**修复文件**: `src/hooks/useGameState.js`

---

## 🟢 功能增强（已实现）

### 添加"已获得奖品不参与抽奖"提示

**位置**: 转盘下方  
**条件**: 当有已获得奖品但未全部获得时显示

**新增代码** (`SpinWheel.jsx`):
```jsx
{wonPrizes.length > 0 && !isAllWon && (
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center">
        <span className="text-xs text-wood-dark/60 bg-white/80 px-2 py-0.5 rounded-full">
            {t('wonPrizesExcluded')}
        </span>
    </div>
)}
```

**新增翻译** (`translations.js`):
- 印尼语: `'✓ Hadiah yang sudah didapat tidak ikut undian'`
- 中文: `'✓ 已获得的奖品不参与本次抽奖'`
- 英文: `'✓ Won prizes are excluded from this draw'`

---

## ⚠️ 潜在问题（建议关注）

### 1. wheelRotation 不持久化

**风险等级**: 🟡 中等

**问题描述**：  
刷新页面后 `wheelRotation` 重置为 0，导致转盘视觉位置突然跳变。

**当前代码**：
```javascript
// storage.js 只保存 wonPrizes，不保存 wheelRotation
// useGameState.js 初始化
wheelRotation: 0,  // 每次刷新都重置为 0
```

**建议**：  
考虑保存 `wheelRotation % 360` 到 localStorage，页面加载时恢复。

---

### 2. 奖品数量变化时的浮点精度

**风险等级**: 🟢 低

**当前状态**：  
8 个奖品，`segmentAngle = 45°`，为整数，无精度问题。

**潜在风险**：  
如果奖品数量变为 7 个，`segmentAngle = 51.428...°`，可能产生浮点误差。

---

### 3. 权重为 0 的边界情况

**风险等级**: 🟢 低

**代码位置**:
```javascript
const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0);
let random = Math.random() * totalWeight;  // 如果 totalWeight = 0
```

**当前状态**：所有奖品权重 > 0，不会触发。

**建议**：添加防护或配置校验。

---

### 4. 奖品 ID 唯一性

**风险等级**: 🟢 低

**问题**：如果手动添加重复的 `id`，会导致抽奖逻辑异常。

**建议**：开发时添加校验确保 id 唯一。

---

## 📊 抽奖流程完整性检查

```
┌─────────────────────────────────────────────────────────┐
│ 1. 防护检查                                               │
│    ├─ isSpinning 防止重复点击               ✅            │
│    ├─ wheelResult 防止未领取就再抽          ✅            │
│    └─ availablePrizes.length === 0 检查     ✅            │
├─────────────────────────────────────────────────────────┤
│ 2. 奖品选择                                               │
│    ├─ 过滤已获得奖品                        ✅            │
│    ├─ 权重随机选择                          ✅            │
│    └─ 默认选第一个可用奖品                  ✅            │
├─────────────────────────────────────────────────────────┤
│ 3. 旋转计算                                               │
│    ├─ 累积模式（修复后）                    ✅            │
│    ├─ 始终顺时针                            ✅            │
│    └─ 正确计算目标位置                      ✅            │
├─────────────────────────────────────────────────────────┤
│ 4. 结果处理                                               │
│    ├─ 延时显示结果                          ✅            │
│    ├─ 添加到 wonPrizes                      ✅            │
│    ├─ 同步保存到 storage                    ✅            │
│    └─ 设置 wheelResult 显示结果             ✅            │
├─────────────────────────────────────────────────────────┤
│ 5. UI 反馈                                                │
│    ├─ 已获得奖品灰色显示 + ✓                ✅            │
│    ├─ 提示"已获得奖品不参与抽奖"            ✅            │
│    ├─ 全部获得时显示感谢信息                ✅            │
│    └─ 中奖结果正确显示图标和名称            ✅            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 安全性检查

| 项目 | 状态 | 说明 |
|------|------|------|
| XSS 防护 | ✅ | 使用 React JSX，自动转义 |
| 数据校验 | ⚠️ | localStorage 数据未校验类型（已有 try-catch） |
| 随机性 | ✅ | 使用 `Math.random()`，客户端游戏足够 |

---

## 📝 问题原因分析：为什么之前没有发现

### 1. 第一次抽奖永远正确
初始 `wheelRotation = 0`，第一次抽奖的绝对角度一定大于 0，必定顺时针旋转。

### 2. Bug 需要特定条件触发
只有当**新目标角度 < 当前角度**时才会逆时针旋转，约 50% 的第二次抽奖会触发。

### 3. 视觉欺骗性
即使轮盘逆时针转动，仍然会"转动并停下"，用户难以确定是 bug。

### 4. 测试路径不完整
典型测试只验证首次抽奖成功，未测试连续抽奖多次的场景。

### 5. 状态持久化掩盖问题
刷新页面后 `wheelRotation` 重置为 0，首次抽奖又正确，掩盖累积问题。

---

## 📌 总结

| 类别 | 数量 |
|------|------|
| 🔴 严重问题（已修复）| 3 |
| 🟢 功能增强（已实现）| 1 |
| 🟡 潜在问题（建议关注）| 1 |
| 🟢 低风险建议 | 3 |

**结论**：核心抽奖逻辑已完成修复，代码质量良好。主要建议是考虑持久化 `wheelRotation` 以避免刷新后转盘位置跳变。

---

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/hooks/useGameState.js` | 修复 | 累积旋转角度、方向计算、依赖数组 |
| `src/components/SpinWheel.jsx` | 增强 | 添加提示信息 |
| `src/config/translations.js` | 增强 | 添加三语翻译 |
