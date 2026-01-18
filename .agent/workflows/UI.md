---
description: Code review and UI development best practices
---

# UI 开发与代码审查技能

综合 UI 开发最佳实践和代码审查经验。

---

## 代码审查技能

### 常见翻译键错误模式

| 问题模式 | 错误示例 | 正确做法 |
|----------|----------|----------|
| **动态生成键名** | `` t(`prize${id}`) `` | 从配置中读取 `t(config.labelKey)` |
| **假设键名存在** | 不检查翻译是否存在 | 使用可选链 `?.` 和默认值 |
| **硬编码图标** | `<span>🎁</span>` | 从配置读取 `{config.icon}` |

**修复模板**:
```jsx
// ❌ 错误：动态生成可能不存在的翻译键
{t(`prize${result.charAt(0).toUpperCase() + result.slice(1)}`)}

// ✅ 正确：从配置中获取正确的 labelKey
const config = PRIZES.find(p => p.id === result);
{config ? t(config.labelKey) : t('defaultPrize')}
```

---

### React Hooks 依赖数组检查

| 检查项 | 说明 |
|--------|------|
| **闭包捕获** | setTimeout/setInterval 中使用的 state 是否在依赖数组中 |
| **useCallback 依赖** | 函数内使用的 state/props 是否都在依赖数组 |
| **useMemo 依赖** | 计算依赖的值是否都在依赖数组 |

**常见问题**:
```javascript
// ❌ 错误：state.rotation 在 setTimeout 中使用但未在依赖中
const spinWheel = useCallback(() => {
    setTimeout(() => {
        console.log(state.rotation);  // 闭包捕获旧值
    }, 3000);
}, [state.isSpinning]);  // 缺少 state.rotation

// ✅ 正确：包含所有使用的 state
}, [state.isSpinning, state.rotation]);
```

---

### setTimeout 最佳实践

#### 1. 必须清理定时器
```javascript
const timerRef = useRef(null);

// 设置定时器
timerRef.current = setTimeout(() => { ... }, 3000);

// 清理定时器
useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
}, []);
```

#### 2. 避免闭包捕获过期状态
```javascript
// ❌ 错误：setTimeout 回调中的 state 是旧值
setTimeout(() => {
    setState([...state, newItem]);
}, 3000);

// ✅ 正确：使用函数式更新
setTimeout(() => {
    setState(prev => [...prev, newItem]);
}, 3000);

// ✅ 或在 reducer 中处理
setTimeout(() => {
    dispatch({ type: 'ADD_ITEM', payload: newItem });
}, 3000);
```

---

### 双击/竞态条件防护

```javascript
const isClickingRef = useRef(false);

const handleClick = useCallback(() => {
    if (isClickingRef.current || isProcessing) return;
    isClickingRef.current = true;
    
    doSomething();
    
    setTimeout(() => { isClickingRef.current = false; }, 100);
}, [isProcessing]);
```

---

### Modal 关闭逻辑检查

| 场景 | 正确做法 | 错误做法 |
|------|----------|----------|
| 用户已在目标页面 | 仅关闭 Modal | 执行导航到当前页面 |
| 需要清理状态 | 使用专用 dismiss 函数 | 调用通用 goHome 函数 |
| 有未保存数据 | 先确认再关闭 | 直接关闭丢失数据 |

```jsx
// ❌ 错误：用户已在主菜单，不应调用 goToHome
<CooldownModal onDismiss={goToHome} />

// ✅ 正确：使用专用的关闭函数
<CooldownModal onDismiss={dismissCooldown} />
```

---

### localStorage 错误处理

```javascript
const storage = {
    get: (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            console.warn(`Storage write failed for ${key}`);
            return false;
        }
    }
};
```

---

## 游戏开发检查点

```
┌─────────────────────────────────────────────────────────────┐
│ 状态管理                                                     │
│    ├─ 所有异步操作是否有取消机制           □                │
│    ├─ 定时器是否在组件卸载时清理           □                │
│    └─ 动画状态是否正确重置                 □                │
├─────────────────────────────────────────────────────────────┤
│ 用户交互                                                     │
│    ├─ 重复点击是否有防护                   □                │
│    ├─ 动画进行中是否禁用交互               □                │
│    └─ 游戏结束后是否禁用操作               □                │
├─────────────────────────────────────────────────────────────┤
│ 数据持久化                                                   │
│    ├─ 关键数据是否保存到 storage           □                │
│    ├─ 刷新后状态是否正确恢复               □                │
│    └─ 隐私模式是否有降级处理               □                │
├─────────────────────────────────────────────────────────────┤
│ 多语言                                                       │
│    ├─ 所有文案是否使用翻译函数             □                │
│    ├─ 翻译键是否全部存在                   □                │
│    └─ 动态内容翻译是否正确                 □                │
└─────────────────────────────────────────────────────────────┘
```

---

## UI 开发规范

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|----- |
| **No emoji icons** | Use SVG icons (Heroicons, Lucide) | Use emojis as UI icons |
| **Stable hover states** | Use color/opacity transitions | Use scale transforms that shift layout |
| **Consistent sizing** | Use fixed viewBox (24x24) | Mix different icon sizes |

### Interaction & Cursor

| Rule | Do | Don't |
|------|----|----- |
| **Cursor pointer** | Add `cursor-pointer` to clickable elements | Leave default cursor |
| **Hover feedback** | Provide visual feedback | No indication element is interactive |
| **Smooth transitions** | Use `transition-colors duration-200` | Instant state changes |

### Light/Dark Mode

| Rule | Do | Don't |
|------|----|----- |
| **Glass card light mode** | Use `bg-white/80` or higher | Use `bg-white/10` |
| **Text contrast** | Use `#0F172A` (slate-900) | Use gray-400 for body text |
| **Border visibility** | Use `border-gray-200` in light | Use `border-white/10` |

---

## 代码审查报告模板

```markdown
# 代码审查报告

**审查日期**: YYYY-MM-DD  
**审查范围**: [模块/功能名称]

## 发现问题

### 🔴 严重问题
| 问题 | 文件 | 行号 | 影响 | 状态 |
|------|------|------|------|------|
| [描述] | [文件] | [行号] | [影响] | ❌/✅ |

### 🟠 中等问题
...

### 🟢 建议优化
...

## 修复验证

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| ... | ❌ ... | ✅ ... |

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| ... | 修改/新增/删除 | ... |
```
