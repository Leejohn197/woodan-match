# Wood Match 🪵

木质家具消消乐游戏 | Permainan Furnitur Kayu

## 🎮 游戏简介

一款多关卡消消乐游戏，点击匹配 3 个相同的木质家具即可消除。通过 3 个关卡后可参与幸运转盘抽奖。

**特性**:
- 🌏 多语言支持 (印尼语/中文)
- 🎯 3 个难度递增的关卡
- 🎡 转盘抽奖系统
- 🔊 音效和触感反馈
- 📱 移动端适配

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:4321 开始游戏

---

## 📁 项目结构

```
src/
├── components/
│   ├── Game.jsx           # 主游戏控制器
│   ├── StartScreen.jsx    # 开始界面
│   ├── GameBoard.jsx      # 游戏面板
│   ├── SpinWheel.jsx      # 转盘组件
│   └── modals/
│       ├── VictoryModal.jsx
│       ├── GameOverModal.jsx
│       ├── ClaimModal.jsx
│       ├── ClaimRewardModal.jsx
│       └── CooldownModal.jsx
├── config/
│   ├── translations.js    # 多语言配置
│   ├── levels.js          # 关卡配置
│   ├── themes.js          # 家具主题
│   ├── prizes.js          # 转盘奖品
│   └── constants.js       # 游戏常量
├── hooks/
│   └── useGameState.js    # 游戏状态管理 (useReducer)
├── utils/
│   ├── audio.js           # 音频/触感
│   ├── helpers.js         # 工具函数
│   └── storage.js         # localStorage 封装
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

---

## 🧞 命令

| 命令 | 说明 |
|:-----|:-----|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器 (localhost:4321) |
| `npm run build` | 构建生产版本到 `./dist/` |
| `npm run preview` | 本地预览生产构建 |

---

## 🛠️ 技术栈

- **框架**: Astro 5 + React 19
- **样式**: Tailwind CSS 4
- **状态管理**: React useReducer
- **语言**: JavaScript (JSX)
