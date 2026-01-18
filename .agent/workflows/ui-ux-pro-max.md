---
description: Plan and implement UI
auto_execution_mode: 3
---

# UI/UX Pro Max - Design Intelligence

Searchable database of UI styles, color palettes, font pairings, chart types, product recommendations, UX guidelines, and stack-specific best practices.

## Prerequisites

Check if Python is installed:

```bash
python3 --version || python --version
```

If Python is not installed, install it based on user's OS:

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## How to Use This Workflow

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Search Relevant Domains

Use `search.py` multiple times to gather comprehensive information. Search until you have enough context.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**Recommended search order:**

1. **Product** - Get style recommendations for product type
2. **Style** - Get detailed style guide (colors, effects, frameworks)
3. **Typography** - Get font pairings with Google Fonts imports
4. **Color** - Get color palette (Primary, Secondary, CTA, Background, Text, Border)
5. **Landing** - Get page structure (if landing page)
6. **Chart** - Get chart recommendations (if dashboard/analytics)
7. **UX** - Get best practices and anti-patterns
8. **Stack** - Get stack-specific guidelines (default: html-tailwind)

### Step 3: Stack Guidelines (Default: html-tailwind)

If user doesn't specify a stack, **default to `html-tailwind`**.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`

---

## Search Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UI styles, colors, effects | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | Font pairings, Google Fonts | elegant, playful, professional, modern |
| `color` | Color palettes by product type | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | Page structure, CTA strategies | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | Chart types, library recommendations | trend, comparison, timeline, funnel, pie |
| `ux` | Best practices, anti-patterns | animation, accessibility, z-index, loading |
| `prompt` | AI prompts, CSS keywords | (style name) |

### Available Stacks

| Stack | Focus |
|-------|-------|
| `html-tailwind` | Tailwind utilities, responsive, a11y (DEFAULT) |
| `react` | State, hooks, performance, patterns |
| `nextjs` | SSR, routing, images, API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `swiftui` | Views, State, Navigation, Animation |
| `react-native` | Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |
| `shadcn` | shadcn/ui components, theming, forms, patterns |

---

## Example Workflow

**User request:** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

**AI should:**

```bash
# 1. Search product type
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --domain product

# 2. Search style (based on industry: beauty, elegant)
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant minimal soft" --domain style

# 3. Search typography
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant luxury" --domain typography

# 4. Search color palette
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --domain color

# 5. Search landing page structure
python3 .shared/ui-ux-pro-max/scripts/search.py "hero-centric social-proof" --domain landing

# 6. Search UX guidelines
python3 .shared/ui-ux-pro-max/scripts/search.py "animation" --domain ux
python3 .shared/ui-ux-pro-max/scripts/search.py "accessibility" --domain ux

# 7. Search stack guidelines (default: html-tailwind)
python3 .shared/ui-ux-pro-max/scripts/search.py "layout responsive" --stack html-tailwind
```

**Then:** Synthesize all search results and implement the design.

---

## Tips for Better Results

1. **Be specific with keywords** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - Different keywords reveal different insights
3. **Combine domains** - Style + Typography + Color = Complete design system
4. **Always check UX** - Search "animation", "z-index", "accessibility" for common issues
5. **Use stack flag** - Get implementation-specific best practices
6. **Iterate** - If first search doesn't match, try different keywords
7. **Split Into Multiple Files** - For better maintainability:
   - Separate components into individual files (e.g., `Header.tsx`, `Footer.tsx`)
   - Extract reusable styles into dedicated files
   - Keep each file focused and under 200-300 lines

---

## Common Rules for Professional UI

These are frequently overlooked issues that make UI look unprofessional:

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|----- |
| **No emoji icons** | Use SVG icons (Heroicons, Lucide, Simple Icons) | Use emojis like 🎨 🚀 ⚙️ as UI icons |
| **Stable hover states** | Use color/opacity transitions on hover | Use scale transforms that shift layout |
| **Correct brand logos** | Research official SVG from Simple Icons | Guess or use incorrect logo paths |
| **Consistent icon sizing** | Use fixed viewBox (24x24) with w-6 h-6 | Mix different icon sizes randomly |

### Interaction & Cursor

| Rule | Do | Don't |
|------|----|----- |
| **Cursor pointer** | Add `cursor-pointer` to all clickable/hoverable cards | Leave default cursor on interactive elements |
| **Hover feedback** | Provide visual feedback (color, shadow, border) | No indication element is interactive |
| **Smooth transitions** | Use `transition-colors duration-200` | Instant state changes or too slow (>500ms) |

### Light/Dark Mode Contrast

| Rule | Do | Don't |
|------|----|----- |
| **Glass card light mode** | Use `bg-white/80` or higher opacity | Use `bg-white/10` (too transparent) |
| **Text contrast light** | Use `#0F172A` (slate-900) for text | Use `#94A3B8` (slate-400) for body text |
| **Muted text light** | Use `#475569` (slate-600) minimum | Use gray-400 or lighter |
| **Border visibility** | Use `border-gray-200` in light mode | Use `border-white/10` (invisible) |

### Layout & Spacing

| Rule | Do | Don't |
|------|----|----- |
| **Floating navbar** | Add `top-4 left-4 right-4` spacing | Stick navbar to `top-0 left-0 right-0` |
| **Content padding** | Account for fixed navbar height | Let content hide behind fixed elements |
| **Consistent max-width** | Use same `max-w-6xl` or `max-w-7xl` | Mix different container widths |

---

## Pre-Delivery Checklist

Before delivering UI code, verify these items:

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

### Layout
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

---

## Code Review Skills

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
// ✅ 使用 useRef 追踪定时器
const timerRef = useRef(null);

// 设置定时器
timerRef.current = setTimeout(() => { ... }, 3000);

// 清理定时器（在组件卸载或状态重置时）
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
    setState([...state, newItem]);  // state 可能已过期
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
// ✅ 使用 useRef 进行同步点击保护
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

**审查要点**:
```jsx
// ❌ 错误：用户已在主菜单，不应调用 goToHome
<CooldownModal onDismiss={goToHome} />

// ✅ 正确：使用专用的关闭函数
<CooldownModal onDismiss={dismissCooldown} />
```

---

### localStorage 错误处理

```javascript
// ✅ 统一的错误处理模式
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

### 游戏开发常见检查点

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

### 代码审查报告模板

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

