import { useState, useEffect, useCallback } from 'react';

// ===== Translations =====
const TRANSLATIONS = {
  id: {
    tagline: 'Permainan Furnitur Kayu',
    startGame: 'Mulai Main',
    remaining: 'Sisa',
    tiles: 'ubin',
    congratulations: 'Selamat!',
    levelCleared: 'Tingkat {level} Selesai!',
    victoryMessage: 'Anda telah membuka set furnitur mewah!',
    claimPrize: 'Klaim Hadiah',
    nextLevel: 'Level Berikutnya',
    grandPrize: 'Hadiah Utama!',
    gameOver: 'Permainan Berakhir',
    gameOverMessage: 'Slot sudah penuh! Coba lagi?',
    tryAgain: 'Coba Lagi',
    mainMenu: 'Menu Utama',
    yourPrize: 'Hadiah Anda!',
    showScreen: 'Tunjukkan layar ini kepada staff kami untuk menerima hadiah spesial!',
    close: 'Tutup',
    level1Theme: 'Furnitur Ruang Tamu',
    level2Theme: 'Furnitur Outdoor',
    level3Theme: 'Furnitur Kamar Tidur',
    level1Name: 'Tingkat 1',
    level2Name: 'Tingkat 2',
    level3Name: 'Tingkat 3',
    level1Desc: 'Ruang Tamu - Mudah',
    level2Desc: 'Outdoor - Sedang',
    level3Desc: 'Kamar Tidur - Sulit',
    'armchair': 'Kursi Sofa',
    'dining-chair': 'Kursi Makan',
    'table': 'Meja',
    'stool': 'Bangku',
    'pattern1': 'Motif 1',
    'pattern2': 'Motif 2',
    'lounge-chair': 'Kursi Santai',
    'ladder-chair': 'Kursi Tangga',
    'round-table': 'Meja Bundar',
    // Gambler mechanism translations
    takeReward: 'Ambil Hadiah',
    riskIt: 'Tantang Level Berikutnya',
    consolationPrize: 'Hadiah Hiburan',
    consolationDesc: 'Stiker merek / brosur digital',
    smallPrize: 'Hadiah Kecil',
    smallPrizeDesc: 'Kopi gratis / air mineral',
    spinWheel: 'Roda Keberuntungan',
    spinWheelDesc: 'Furnitur kayu solid / diskon besar',
    spinNow: 'Putar Sekarang!',
    cooldownWarning: 'Istirahat Dulu',
    cooldownMessage: 'Anda baru saja bermain! Silakan tunggu {seconds} detik lagi',
    spinning: 'Memutar...',
    prizeFurniture: 'Furnitur Kayu',
    prizeDiscount: 'Diskon 50%',
    prizeGift: 'Hadiah Menarik',
    prizeCoupon: 'Kupon Belanja',
    youWon: 'Anda Menang!',
    giveUpReward: 'Lepaskan hadiah saat ini untuk kesempatan menang besar!',
    claimSmallPrize: 'Klaim Hadiah Kecil',
    orContinue: 'atau lanjutkan tantangan',
    prizeWon: 'Didapat',
    allPrizesWon: 'Semua hadiah sudah diklaim!',
    noPrizesLeft: 'Tidak ada hadiah tersisa'
  },
  zh: {
    tagline: '木质家具消消乐',
    startGame: '开始游戏',
    remaining: '剩余',
    tiles: '块',
    congratulations: '恭喜!',
    levelCleared: '第{level}关通过!',
    victoryMessage: '您已解锁豪华家具套装!',
    claimPrize: '领取奖品',
    nextLevel: '进入下一关',
    grandPrize: '终极大奖!',
    gameOver: '游戏结束',
    gameOverMessage: '槽位已满！再试一次？',
    tryAgain: '再试一次',
    mainMenu: '主菜单',
    yourPrize: '您的奖品!',
    showScreen: '请向工作人员展示此屏幕以领取特别奖品！',
    close: '关闭',
    level1Theme: '客厅家具',
    level2Theme: '户外家具',
    level3Theme: '卧室家具',
    level1Name: '第1关',
    level2Name: '第2关',
    level3Name: '第3关',
    level1Desc: '客厅 - 简单',
    level2Desc: '户外 - 中等',
    level3Desc: '卧室 - 困难',
    'armchair': '单人沙发',
    'dining-chair': '餐椅',
    'table': '餐桌',
    'stool': '凳子',
    'pattern1': '图案一',
    'pattern2': '图案二',
    'lounge-chair': '休闲椅',
    'ladder-chair': '梯背椅',
    'round-table': '圆桌',
    // Gambler mechanism translations
    takeReward: '领取奖励',
    riskIt: '挑战下一关',
    consolationPrize: '安慰奖',
    consolationDesc: '品牌贴纸/电子宣传册',
    smallPrize: '小奖品',
    smallPrizeDesc: '免费咖啡/矿泉水',
    spinWheel: '幸运转盘',
    spinWheelDesc: '实木家具/大额折扣',
    spinNow: '立即抽奖！',
    cooldownWarning: '休息提示',
    cooldownMessage: '您刚刚已经挑战过了！请休息 {seconds} 秒再来',
    spinning: '抽奖中...',
    prizeFurniture: '实木家具',
    prizeDiscount: '五折优惠',
    prizeGift: '精美礼品',
    prizeCoupon: '优惠券',
    youWon: '恭喜中奖！',
    giveUpReward: '放弃当前奖励，有机会赢取大奖！',
    claimSmallPrize: '领取小奖品',
    orContinue: '或继续挑战',
    prizeWon: '已获得',
    allPrizesWon: '所有奖品已领取！',
    noPrizesLeft: '没有剩余奖品'
  }
};

// ===== Furniture Themes by Level =====
const FURNITURE_THEMES = {
  livingRoom: [
    { id: 'armchair', image: '/images/armchair.png' },
    { id: 'dining-chair', image: '/images/dining_chair.png' },
    { id: 'table', image: '/images/table.png' },
    { id: 'stool', image: '/images/stool.png' },
    { id: 'pattern1', image: '/images/pattern1.png' },
    { id: 'lounge-chair', image: '/images/lounge_chair.png' }
  ],
  outdoor: [
    { id: 'ladder-chair', image: '/images/ladder_chair.png' },
    { id: 'round-table', image: '/images/round_table.png' },
    { id: 'armchair', image: '/images/armchair.png' },
    { id: 'pattern2', image: '/images/pattern2.png' },
    { id: 'dining-chair', image: '/images/dining_chair.png' },
    { id: 'stool', image: '/images/stool.png' }
  ],
  bedroom: [
    { id: 'lounge-chair', image: '/images/lounge_chair.png' },
    { id: 'pattern1', image: '/images/pattern1.png' },
    { id: 'table', image: '/images/table.png' },
    { id: 'ladder-chair', image: '/images/ladder_chair.png' },
    { id: 'pattern2', image: '/images/pattern2.png' },
    { id: 'round-table', image: '/images/round_table.png' }
  ]
};

// ===== Level Configurations =====
const LEVEL_CONFIGS = {
  1: {
    theme: 'livingRoom',
    themeKey: 'level1Theme',
    nameKey: 'level1Name',
    descKey: 'level1Desc',
    types: 3,
    tilesPerType: 6,
    layers: 2,
    gridWidth: 4,
    gridHeight: 3,
    rewardType: 'consolation', // 安慰奖
    timeLimit: 30
  },
  2: {
    theme: 'outdoor',
    themeKey: 'level2Theme',
    nameKey: 'level2Name',
    descKey: 'level2Desc',
    types: 4,
    tilesPerType: 9,
    layers: 3,
    gridWidth: 5,
    gridHeight: 4,
    rewardType: 'small', // 小奖品
    timeLimit: 60
  },
  3: {
    theme: 'bedroom',
    themeKey: 'level3Theme',
    nameKey: 'level3Name',
    descKey: 'level3Desc',
    types: 6,
    tilesPerType: 12,
    layers: 4,
    gridWidth: 6,
    gridHeight: 5,
    rewardType: 'spinWheel', // 幸运转盘
    timeLimit: 90
  }
};

// Spin wheel prizes configuration
const WHEEL_PRIZES = [
  { id: 'furniture', weight: 10, color: '#CD853F' },
  { id: 'discount', weight: 25, color: '#20B2AA' },
  { id: 'gift', weight: 30, color: '#DEB887' },
  { id: 'coupon', weight: 35, color: '#8B5A2B' }
];

const MAX_LEVEL = 3;

// ===== Tailwind Style Constants =====
const styles = {
  // Glass morphism effect
  glass: 'bg-white/65 backdrop-blur-[10px] border border-[rgba(139,90,43,0.15)]',

  // Tile styles
  tile: `
    bg-gradient-to-br from-tile-cream via-tile-beige to-tile-sand
    rounded-xl select-none
    shadow-[0_6px_16px_rgba(139,90,43,0.20),0_2px_6px_rgba(107,68,35,0.12),0_1px_2px_rgba(74,55,40,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
    border border-[rgba(139,90,43,0.12)]
  `,
  tileBlocked: 'brightness-[0.7] cursor-not-allowed',
  tileHover: 'hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_12px_28px_rgba(139,90,43,0.25),0_6px_12px_rgba(107,68,35,0.15)] hover:z-[1000]',

  // Button styles
  btnPrimary: `
    bg-gradient-to-br from-wood-golden to-wood-warm
    shadow-[0_8px_32px_rgba(205,133,63,0.4)]
    hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(205,133,63,0.5)]
    active:translate-y-0 active:scale-[0.98]
  `,

  // Slot styles
  slot: 'bg-[rgba(139,90,43,0.08)] border-2 border-dashed border-[rgba(139,90,43,0.25)]',
  slotFilled: 'border-solid border-wood-golden bg-[rgba(205,133,63,0.15)]',

  // Modal styles
  modal: 'bg-gradient-to-br from-tile-cream to-tile-beige shadow-[0_20px_60px_rgba(74,55,40,0.35)]',

  // Text gradient
  textGradient: 'bg-gradient-to-br from-wood-dark via-wood-medium to-wood-warm bg-clip-text text-transparent',

  // Progress bar
  progressFill: 'bg-gradient-to-r from-accent-teal to-accent-green',

  // Confetti colors
  confettiColors: ['bg-wood-golden', 'bg-accent-coral', 'bg-accent-green', 'bg-accent-teal', 'bg-wood-cream']
};

// ===== UUID Generator =====
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ===== Audio & Haptics =====
let audioContext = null;

function initAudio() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      audioContext = new AudioContextClass();
    }
    return true;
  } catch (e) {
    return false;
  }
}

function vibrate(pattern) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch (e) { }
  }
}

function hapticTap() { vibrate(10); }
function hapticMatch() { vibrate([30, 50, 30]); }
function hapticGameOver() { vibrate(200); }
function hapticVictory() { vibrate([50, 30, 50, 30, 100]); }

function playWoodKnock(soundEnabled) {
  if (!soundEnabled || !audioContext) return;
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.15);
}

function playMatchSound(soundEnabled) {
  if (!soundEnabled || !audioContext) return;
  const notes = [
    { freq: 659, start: 0, duration: 0.1 },
    { freq: 784, start: 0.05, duration: 0.1 },
    { freq: 1047, start: 0.1, duration: 0.15 }
  ];

  notes.forEach(note => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.start);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime + note.start);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.start + note.duration);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(audioContext.currentTime + note.start);
    osc.stop(audioContext.currentTime + note.start + note.duration);
  });
}

function playVictorySound(soundEnabled) {
  if (!soundEnabled || !audioContext) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.4);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(audioContext.currentTime + index * 0.15);
    osc.stop(audioContext.currentTime + index * 0.15 + 0.4);
  });
}

// ===== Main Game Component =====
export default function Game() {
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
  const [isMatching, setIsMatching] = useState(false); // 防止匹配消除重复触发

  // Gambler mechanism states
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState(null);
  const [claimedRewardLevel, setClaimedRewardLevel] = useState(null);
  const [wonPrizes, setWonPrizes] = useState([]);

  const t = useCallback((key) => TRANSLATIONS[currentLang][key] || key, [currentLang]);
  const getFurnitureName = useCallback((id) => TRANSLATIONS[currentLang][id] || id, [currentLang]);

  // Load saved language preference and won prizes (with daily reset)
  useEffect(() => {
    const savedLang = localStorage.getItem('woodmatch_lang');
    if (savedLang && (savedLang === 'id' || savedLang === 'zh')) {
      setCurrentLang(savedLang);
    }

    // Get today's date string (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('woodmatch_prizeDate');

    // Daily reset: if the date has changed, clear won prizes
    if (savedDate !== today) {
      localStorage.setItem('woodmatch_prizeDate', today);
      localStorage.removeItem('woodmatch_wonPrizes');
      localStorage.removeItem('woodmatch_lastPlayed');
      localStorage.removeItem('woodmatch_hasPlayed');
      setWonPrizes([]);
      return;
    }

    // Load won prizes from localStorage (same day)
    const savedWonPrizes = localStorage.getItem('woodmatch_wonPrizes');
    if (savedWonPrizes) {
      try {
        const parsed = JSON.parse(savedWonPrizes);
        if (Array.isArray(parsed)) {
          setWonPrizes(parsed);
        }
      } catch (e) {
        // Invalid JSON, reset
        localStorage.removeItem('woodmatch_wonPrizes');
      }
    }
  }, []);

  // Generate tiles for a level
  const generateTiles = useCallback((levelConfig) => {
    const newTiles = [];
    const themeFurniture = FURNITURE_THEMES[levelConfig.theme];
    const types = themeFurniture.slice(0, levelConfig.types);

    types.forEach(type => {
      for (let i = 0; i < levelConfig.tilesPerType; i++) {
        newTiles.push({
          id: generateUUID(),
          type: type.id,
          image: type.image,
          layer: 0,
          x: 0,
          y: 0,
          blocked: false
        });
      }
    });

    // Shuffle
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }

    // Assign positions
    const tileWidth = 60;
    const tileHeight = 70;
    const containerWidth = 320;
    const containerHeight = 400;
    const layers = levelConfig.layers;
    const tilesPerLayer = Math.ceil(newTiles.length / layers);

    newTiles.forEach((tile, index) => {
      const layer = Math.floor(index / tilesPerLayer);
      const indexInLayer = index % tilesPerLayer;

      const cols = levelConfig.gridWidth;
      const rows = levelConfig.gridHeight;

      const col = indexInLayer % cols;
      const row = Math.floor(indexInLayer / cols) % rows;

      const baseX = (containerWidth - cols * tileWidth) / 2 + col * tileWidth;
      const baseY = (containerHeight - rows * tileHeight) / 2 + row * tileHeight;

      const layerOffset = layer * 15;
      const randomX = (Math.random() - 0.5) * 20;
      const randomY = (Math.random() - 0.5) * 20;

      tile.x = Math.max(0, Math.min(containerWidth - tileWidth, baseX + layerOffset + randomX));
      tile.y = Math.max(0, Math.min(containerHeight - tileHeight, baseY - layerOffset + randomY));
      tile.layer = layer;
    });

    return newTiles;
  }, []);

  // Check blocked tiles
  const checkBlockedTiles = useCallback((tileList) => {
    return tileList.map(tile => {
      let blocked = false;
      tileList.forEach(otherTile => {
        if (tile.id === otherTile.id) return;
        if (otherTile.layer <= tile.layer) return;
        const overlapX = Math.abs(tile.x - otherTile.x) < 40;
        const overlapY = Math.abs(tile.y - otherTile.y) < 50;
        if (overlapX && overlapY) blocked = true;
      });
      return { ...tile, blocked };
    });
  }, []);

  // Check cooldown before starting game
  const checkCooldown = useCallback(() => {
    const lastPlayed = localStorage.getItem('woodmatch_lastPlayed');
    if (lastPlayed) {
      const elapsed = Date.now() - parseInt(lastPlayed);
      const cooldown = 10000; // 10 seconds cooldown
      if (elapsed < cooldown) {
        return Math.ceil((cooldown - elapsed) / 1000);
      }
    }
    return 0;
  }, []);

  // Record play session
  const recordPlaySession = useCallback(() => {
    localStorage.setItem('woodmatch_hasPlayed', 'true');
    localStorage.setItem('woodmatch_lastPlayed', Date.now().toString());
  }, []);

  // Start game
  const startGame = useCallback(() => {
    // Check cooldown for anti-abuse
    const remaining = checkCooldown();
    if (remaining > 0) {
      setCooldownRemaining(remaining);
      setActiveModal('cooldown');
      return;
    }

    const config = LEVEL_CONFIGS[currentLevel];
    const newTiles = generateTiles(config);
    const checkedTiles = checkBlockedTiles(newTiles);

    setTiles(checkedTiles);
    setSlots([]);
    setIsGameOver(false);
    setIsVictory(false);
    setActiveModal(null);
    setExitingTiles(new Set());
    setRemovingSlots(new Set());
    setWheelResult(null);
    setIsSpinning(false);
    setCurrentScreen('game');

    // Record this play session
    recordPlaySession();
  }, [currentLevel, generateTiles, checkBlockedTiles, checkCooldown, recordPlaySession]);

  // Handle tile click
  const handleTileClick = useCallback((tile) => {
    // 检查方块是否正在退出动画中，防止重复点击产生多余方块
    if (isGameOver || isVictory || tile.blocked || exitingTiles.has(tile.id)) return;

    initAudio();
    playWoodKnock(soundEnabled);
    hapticTap();

    setExitingTiles(prev => new Set([...prev, tile.id]));

    setTimeout(() => {
      setSlots(prevSlots => [...prevSlots, tile]);
      setTiles(prevTiles => {
        const remaining = prevTiles.filter(t => t.id !== tile.id);
        return checkBlockedTiles(remaining);
      });
      setExitingTiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(tile.id);
        return newSet;
      });
    }, 300);
  }, [isGameOver, isVictory, soundEnabled, checkBlockedTiles, exitingTiles]);

  // Check for matches
  useEffect(() => {
    // 如果正在匹配消除中，跳过本次检测，防止重复触发
    if (isMatching) return;

    const typeCount = {};
    slots.forEach(tile => {
      typeCount[tile.type] = (typeCount[tile.type] || 0) + 1;
    });

    const matchedType = Object.keys(typeCount).find(type => typeCount[type] >= 3);

    if (matchedType) {
      // 标记正在匹配，防止重复触发
      setIsMatching(true);

      const tilesToRemove = [];
      slots.forEach(tile => {
        if (tile.type === matchedType && tilesToRemove.length < 3) {
          tilesToRemove.push(tile.id);
        }
      });

      setRemovingSlots(new Set(tilesToRemove));
      playMatchSound(soundEnabled);
      hapticMatch();

      setTimeout(() => {
        setSlots(prevSlots => {
          let removed = 0;
          return prevSlots.filter(tile => {
            if (tile.type === matchedType && removed < 3) {
              removed++;
              return false;
            }
            return true;
          });
        });
        setRemovingSlots(new Set());
        // 匹配完成，允许下一次匹配检测
        setIsMatching(false);
      }, 300);
    }
  }, [slots, soundEnabled, isMatching]);

  // Check win/lose conditions
  useEffect(() => {
    if (slots.length >= 7 && !isGameOver) {
      setIsGameOver(true);
      hapticGameOver();
      setActiveModal('gameover');
    } else if (tiles.length === 0 && slots.length === 0 && currentScreen === 'game' && !isVictory) {
      setIsVictory(true);
      playVictorySound(soundEnabled);
      hapticVictory();
      setActiveModal('victory');
    }
  }, [slots, tiles, isGameOver, isVictory, currentScreen, soundEnabled]);

  const changeLanguage = useCallback((lang) => {
    setCurrentLang(lang);
    localStorage.setItem('woodmatch_lang', lang);
  }, []);

  const goToHome = useCallback(() => {
    setCurrentScreen('start');
    setActiveModal(null);
    setCurrentLevel(1);
  }, []);

  const nextLevel = useCallback(() => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(prev => prev + 1);
    }
    setActiveModal(null);
    setTimeout(() => startGame(), 100);
  }, [currentLevel, startGame]);

  const retry = useCallback(() => {
    setActiveModal(null);
    startGame();
  }, [startGame]);

  // Handle claiming current level reward
  const claimCurrentReward = useCallback(() => {
    setClaimedRewardLevel(currentLevel);
    setActiveModal('claimReward');
  }, [currentLevel]);

  // Handle risking for next level (gambler choice)
  const riskForNextLevel = useCallback(() => {
    setActiveModal(null);
    nextLevel();
  }, [nextLevel]);

  // Spin wheel handler with deduplication
  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    // Filter out already won prizes
    const availablePrizes = WHEEL_PRIZES.filter(p => !wonPrizes.includes(p.id));

    // If no prizes left, don't spin
    if (availablePrizes.length === 0) return;

    setIsSpinning(true);

    // Weighted random selection from available prizes only
    const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = availablePrizes[0];

    for (const prize of availablePrizes) {
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate wheel rotation (wheel rotates to bring prize to fixed pointer at top)
    // Pointer is fixed at top (0 degrees / 12 o'clock position)
    // Prize segments: Prize 0 at 0-90deg, Prize 1 at 90-180deg, Prize 2 at 180-270deg, Prize 3 at 270-360deg
    // To land on a prize, we rotate the wheel so the prize center aligns with the pointer
    const prizeIndex = WHEEL_PRIZES.findIndex(p => p.id === selectedPrize.id);
    const segmentAngle = 360 / WHEEL_PRIZES.length; // 90 degrees per segment
    // Prize center positions: Prize 0 at 45deg, Prize 1 at 135deg, Prize 2 at 225deg, Prize 3 at 315deg
    const prizeCenter = prizeIndex * segmentAngle + segmentAngle / 2;
    // Rotate wheel backwards (negative) to bring prize to top, plus 5 full spins
    const targetAngle = -(360 * 5 + prizeCenter);

    setWheelRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelResult(selectedPrize.id);

      // Save won prize to localStorage
      const newWonPrizes = [...wonPrizes, selectedPrize.id];
      setWonPrizes(newWonPrizes);
      localStorage.setItem('woodmatch_wonPrizes', JSON.stringify(newWonPrizes));
    }, 4000);
  }, [isSpinning, wonPrizes]);

  // Dismiss cooldown modal
  const dismissCooldown = useCallback(() => {
    setActiveModal(null);
    setCooldownRemaining(0);
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    if (activeModal === 'cooldown' && cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveModal(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeModal, cooldownRemaining]);

  const config = LEVEL_CONFIGS[currentLevel];
  const totalTiles = config.types * config.tilesPerType;
  const progress = ((totalTiles - tiles.length) / totalTiles) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Start Screen */}
      {currentScreen === 'start' && (
        <div className="flex flex-col items-center justify-center gap-8 text-center w-full max-w-md p-4 relative">
          {/* Language Toggle */}
          <div className="absolute top-4 right-4 flex gap-1 z-50">
            {['id', 'zh'].map(lang => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`${styles.glass} rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${currentLang === lang
                  ? 'bg-accent-gold/20 border-accent-gold text-wood-dark'
                  : 'text-wood-dark/75 hover:text-wood-dark'
                  }`}
              >
                {lang === 'id' ? '🇮🇩 ID' : '🇨🇳 中文'}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-5xl animate-bounce-soft">🪵</span>
              <h1 className={`text-4xl font-extrabold ${styles.textGradient}`}>Wood Match</h1>
            </div>
            <p className="text-sm text-wood-dark/75 uppercase tracking-wider">{t('tagline')}</p>
          </div>

          {/* Level Journey */}
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-full p-2 animate-[fade-in-up_0.8s_ease-out_0.2s_backwards]">
            {[1, 2, 3].map((level, idx) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`${styles.glass} rounded-xl p-3 text-center flex flex-col items-center gap-0.5 min-w-[70px] transition-all ${level === 1 ? 'border-accent-gold bg-accent-gold/15' : ''
                  }`}>
                  <div className="text-2xl">{level === 1 ? '🛋️' : level === 2 ? '⛱️' : '🛏️'}</div>
                  <span className="text-xs font-bold text-wood-dark">{t(`level${level}Name`)}</span>
                  <span className="text-[8px] text-wood-dark/75 whitespace-nowrap">{t(`level${level}Desc`)}</span>
                </div>
                {idx < 2 && <span className="text-wood-dark/50">→</span>}
              </div>
            ))}
            <span className="text-wood-dark/50">→</span>
            <div className={`${styles.glass} rounded-xl p-3 text-center flex flex-col items-center gap-0.5 min-w-[70px] bg-gradient-to-br from-accent-gold/20 to-accent-coral/20 border-accent-coral`}>
              <div className="text-2xl">🏆</div>
              <span className="text-xs font-bold text-wood-dark">{t('grandPrize')}</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className={`${styles.btnPrimary} rounded-3xl px-8 py-4 text-xl font-bold text-white flex items-center gap-2 min-w-[200px] animate-[fade-in-up_0.8s_ease-out_0.4s_backwards] cursor-pointer transition-all`}
          >
            <span>{t('startGame')}</span>
            <span className="text-lg">▶</span>
          </button>
        </div>
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && (
        <div className="flex flex-col w-full max-w-md h-screen max-h-[900px] p-2">
          {/* Header */}
          <header className={`${styles.glass} rounded-2xl p-3 flex justify-between items-center mb-4`}>
            <button
              onClick={goToHome}
              className="w-11 h-11 rounded-xl bg-wood-light/10 flex items-center justify-center text-xl cursor-pointer hover:bg-wood-light/20 transition-all"
            >
              ←
            </button>
            <div className="text-center">
              <span className="block text-lg font-bold text-wood-dark">{t(config.nameKey)}</span>
              <span className="block text-xs text-wood-dark/75">{t(config.themeKey)}</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-11 h-11 rounded-xl bg-wood-light/10 flex items-center justify-center text-xl cursor-pointer hover:bg-wood-light/20 transition-all"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </header>

          {/* Game Area */}
          <main className="flex-1 flex justify-center items-center overflow-hidden relative">
            <div className="relative w-80 h-[400px]" style={{ perspective: '1000px' }}>
              {tiles.sort((a, b) => a.layer - b.layer).map((tile, index) => (
                <div
                  key={tile.id}
                  className={`
                    ${styles.tile} absolute w-[60px] h-[70px] flex flex-col items-center justify-center cursor-pointer transition-all
                    ${tile.blocked ? styles.tileBlocked : styles.tileHover}
                    ${exitingTiles.has(tile.id) ? 'animate-tile-exit' : 'animate-tile-enter'}
                  `}
                  style={{
                    left: tile.x,
                    top: tile.y,
                    zIndex: tile.layer * 10 + index,
                    animationDelay: exitingTiles.has(tile.id) ? '0s' : `${index * 0.02}s`
                  }}
                  onClick={() => !tile.blocked && handleTileClick(tile)}
                >
                  <img
                    src={tile.image}
                    alt={getFurnitureName(tile.type)}
                    className="w-[45px] h-[45px] object-contain pointer-events-none brightness-105 contrast-110"
                  />
                  <span className="text-[8px] text-wood-medium mt-0.5 font-semibold text-center tracking-wide">
                    {getFurnitureName(tile.type)}
                  </span>
                </div>
              ))}
            </div>
          </main>

          {/* Footer */}
          <footer className={`${styles.glass} rounded-2xl p-4 mt-4`}>
            <div className="flex justify-center gap-1 mb-4">
              {[0, 1, 2, 3, 4, 5, 6].map(idx => (
                <div
                  key={idx}
                  className={`${styles.slot} w-[50px] h-[60px] rounded-lg flex items-center justify-center transition-all ${slots[idx] ? styles.slotFilled : ''
                    }`}
                >
                  {slots[idx] && (
                    <div className={`
                      ${styles.tile} relative w-[46px] h-[56px] m-0 flex items-center justify-center
                      ${removingSlots.has(slots[idx].id) ? 'animate-tile-remove' : ''}
                    `}>
                      <img src={slots[idx].image} alt={slots[idx].type} className="w-6 h-6 object-contain" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
              <div
                className={`${styles.progressFill} h-full rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-wood-dark/75 font-medium">
              {t('remaining')}: {tiles.length} {t('tiles')}
            </p>
          </footer>
        </div>
      )}

      {/* Victory Modal - Gambler Mechanism */}
      {activeModal === 'victory' && (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
          <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full relative overflow-hidden animate-modal-slide-in`}>
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`${styles.confettiColors[i]} absolute w-2.5 h-2.5 animate-confetti-fall`}
                  style={{ left: `${(i + 1) * 20 - 10}%`, animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
            <div className="text-6xl mb-4 animate-icon-bounce">🎉</div>
            <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>
              {t('levelCleared').replace('{level}', currentLevel)}
            </h2>

            {/* Level 1 & 2: Take Reward or Risk It */}
            {currentLevel < MAX_LEVEL && (
              <>
                <p className="text-wood-dark/75 mb-4 leading-relaxed">
                  {t('giveUpReward')}
                </p>

                {/* Current Level Reward Display */}
                <div className={`${styles.glass} rounded-xl p-4 mb-4`}>
                  <div className="text-3xl mb-2">
                    {currentLevel === 1 ? '📋' : '☕'}
                  </div>
                  <p className="font-bold text-wood-dark">
                    {currentLevel === 1 ? t('consolationPrize') : t('smallPrize')}
                  </p>
                  <p className="text-sm text-wood-dark/60">
                    {currentLevel === 1 ? t('consolationDesc') : t('smallPrizeDesc')}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Take Reward Button */}
                  <button
                    onClick={claimCurrentReward}
                    className="bg-gradient-to-br from-accent-teal to-accent-green rounded-3xl px-6 py-3 text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <span>{t('takeReward')}</span>
                    <span>🎁</span>
                  </button>

                  {/* Risk It Button */}
                  <button
                    onClick={riskForNextLevel}
                    className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all`}
                  >
                    <span>{t('riskIt')}</span>
                    <span>🎲</span>
                  </button>

                  <p className="text-xs text-wood-dark/50 mt-2">
                    {t('orContinue')}
                  </p>
                </div>
              </>
            )}

            {/* Level 3: Spin Wheel */}
            {currentLevel >= MAX_LEVEL && (
              <>
                <p className="text-wood-dark/75 mb-4 leading-relaxed">
                  {t('spinWheelDesc')}
                </p>

                {/* Spin Wheel - New Circular Layout with Absolute Positioning */}
                <div className="relative w-72 h-72 mx-auto mb-6">
                  {/* Fixed Pointer at Top (Knife/Indicator) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                    <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-red-600 drop-shadow-[0_4px_8px_rgba(220,38,38,0.5)]"></div>
                    {/* Pointer base decoration */}
                    <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-6 h-2 bg-red-700 rounded-t-sm"></div>
                  </div>

                  {/* Decorative Outer Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-wood-golden via-wood-warm to-wood-dark shadow-[0_12px_40px_rgba(74,55,40,0.4)] border-4 border-wood-golden/30">
                    {/* Inner decorative dots around the rim */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/40 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `rotate(${i * 30}deg) translateY(-132px) translateX(-50%)`
                        }}
                      />
                    ))}
                  </div>

                  {/* Rotating Wheel Container */}
                  <div
                    className="absolute inset-3 rounded-full bg-tile-cream shadow-inner overflow-hidden"
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
                    }}
                  >
                    {/* Prize Items - Using origin-bottom transform trick */}
                    {WHEEL_PRIZES.map((prize, idx) => {
                      const isWon = wonPrizes.includes(prize.id);
                      const segmentAngle = 360 / WHEEL_PRIZES.length; // 90deg for 4 items
                      const rotationAngle = idx * segmentAngle; // 0, 90, 180, 270

                      return (
                        <div
                          key={prize.id}
                          className="absolute left-1/2 top-0 h-1/2 w-16 -translate-x-1/2 origin-bottom flex flex-col items-center justify-start pt-4"
                          style={{
                            transform: `translateX(-50%) rotate(${rotationAngle}deg)`
                          }}
                        >
                          {/* Prize Icon Container */}
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2 transition-all ${isWon
                              ? 'bg-gray-200 border-gray-300'
                              : 'bg-white border-wood-golden/30'
                              }`}
                            style={{
                              transform: `rotate(-${rotationAngle}deg)` // Counter-rotate to keep icon upright
                            }}
                          >
                            {/* Prize Icon */}
                            <span className={`text-2xl ${isWon ? 'grayscale opacity-50' : ''}`}>
                              {prize.id === 'furniture' && '🪑'}
                              {prize.id === 'discount' && '🏷️'}
                              {prize.id === 'gift' && '🎁'}
                              {prize.id === 'coupon' && '🎟️'}
                            </span>
                          </div>
                          {/* Prize Label */}
                          <span
                            className={`mt-1 text-[10px] font-bold text-center leading-tight px-1 whitespace-nowrap ${isWon ? 'text-gray-400 line-through' : 'text-wood-dark'
                              }`}
                            style={{
                              transform: `rotate(-${rotationAngle}deg)` // Counter-rotate to keep text upright
                            }}
                          >
                            {t(`prize${prize.id.charAt(0).toUpperCase() + prize.id.slice(1)}`)}
                            {isWon && (
                              <span className="block text-[8px] text-red-500 font-bold">✓ {t('prizeWon')}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}

                    {/* Subtle divider lines between segments */}
                    {[...Array(WHEEL_PRIZES.length)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-wood-golden/20 origin-left"
                        style={{ transform: `rotate(${i * 90 + 45}deg)` }}
                      />
                    ))}
                  </div>

                  {/* Center Spin Button - Prominent Red CTA */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-20">
                    <button
                      onClick={spinWheel}
                      disabled={isSpinning || wheelResult !== null || wonPrizes.length >= WHEEL_PRIZES.length}
                      className="w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full shadow-[0_6px_24px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center border-4 border-white/90 cursor-pointer transition-all hover:scale-110 hover:shadow-[0_8px_32px_rgba(220,38,38,0.6)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                    >
                      <span className="text-white font-bold text-base drop-shadow-md">
                        {isSpinning ? '...' : t('spinNow').replace('!', '').replace('！', '')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Spin Result or Button */}
                {wheelResult ? (
                  <div className="animate-fade-in-up">
                    <h3 className={`text-2xl font-bold ${styles.textGradient} mb-2`}>
                      {t('youWon')}
                    </h3>
                    <div className={`${styles.glass} rounded-xl p-4 mb-4`}>
                      <p className="text-xl font-bold text-wood-dark">
                        {t(`prize${wheelResult.charAt(0).toUpperCase() + wheelResult.slice(1)}`)}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveModal('claim')}
                      className="bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all"
                    >
                      {t('claimPrize')} 🎁
                    </button>
                  </div>
                ) : wonPrizes.length >= WHEEL_PRIZES.length ? (
                  /* All prizes won */
                  <div className="animate-fade-in-up">
                    <p className="text-wood-dark/75 mb-4">{t('allPrizesWon')}</p>
                    <button
                      onClick={goToHome}
                      className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all`}
                    >
                      {t('mainMenu')}
                    </button>
                  </div>
                ) : (
                  /* Red CTA Spin Button */
                  <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 active:translate-y-0 rounded-3xl px-10 py-5 text-xl font-bold text-white cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSpinning ? t('spinning') : t('spinNow')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {activeModal === 'gameover' && (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
          <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
            <div className="text-6xl mb-4 animate-icon-bounce">😔</div>
            <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('gameOver')}</h2>
            <p className="text-wood-dark/75 mb-6 leading-relaxed">{t('gameOverMessage')}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={retry}
                className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all`}
              >
                <span>{t('tryAgain')}</span>
                <span>🔄</span>
              </button>
              <button
                onClick={goToHome}
                className="bg-transparent border-2 border-[rgba(139,90,43,0.15)] rounded-3xl px-4 py-2 text-base font-semibold text-wood-dark/75 cursor-pointer hover:border-wood-dark hover:text-wood-dark transition-all"
              >
                {t('mainMenu')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cooldown Warning Modal */}
      {activeModal === 'cooldown' && (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
          <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
            <div className="text-6xl mb-4 animate-icon-bounce">⏰</div>
            <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('cooldownWarning')}</h2>
            <p className="text-wood-dark/75 mb-6 leading-relaxed">
              {t('cooldownMessage').replace('{seconds}', cooldownRemaining)}
            </p>
            <div className="text-5xl font-bold text-wood-golden mb-6">
              {cooldownRemaining}s
            </div>
            <button
              onClick={dismissCooldown}
              className="bg-transparent border-2 border-[rgba(139,90,43,0.15)] rounded-3xl px-6 py-3 text-base font-semibold text-wood-dark/75 cursor-pointer hover:border-wood-dark hover:text-wood-dark transition-all"
            >
              {t('mainMenu')}
            </button>
          </div>
        </div>
      )}

      {/* Claimed Reward Modal (for Level 1 & 2 rewards) */}
      {activeModal === 'claimReward' && (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
          <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
            <div className="text-6xl mb-4 animate-icon-bounce">
              {claimedRewardLevel === 1 ? '📋' : '☕'}
            </div>
            <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('yourPrize')}</h2>
            <p className="text-wood-dark/75 mb-4 leading-relaxed">{t('showScreen')}</p>
            <div className="my-6">
              <div className="bg-white text-wood-dark p-6 rounded-xl inline-block shadow-lg">
                <p className="text-lg font-bold mb-2">
                  {claimedRewardLevel === 1 ? t('consolationPrize') : t('smallPrize')}
                </p>
                <p className="text-2xl font-bold tracking-wider text-wood-golden">
                  KODE: {claimedRewardLevel === 1 ? 'WOOD-STICKER' : 'WOOD-COFFEE'}
                </p>
              </div>
            </div>
            <button
              onClick={goToHome}
              className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all`}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* Claim Modal (for Spin Wheel prizes) */}
      {activeModal === 'claim' && (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
          <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
            <div className="text-6xl mb-4 animate-icon-bounce">🏆</div>
            <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('yourPrize')}</h2>
            <p className="text-wood-dark/75 mb-6 leading-relaxed">{t('showScreen')}</p>
            <div className="my-6">
              <div className="bg-white text-wood-dark p-6 rounded-xl inline-block shadow-lg">
                <span className="text-5xl block mb-2">🎁</span>
                <p className="text-lg font-bold mb-1">
                  {wheelResult ? t(`prize${wheelResult.charAt(0).toUpperCase() + wheelResult.slice(1)}`) : t('grandPrize')}
                </p>
                <p className="text-2xl font-bold tracking-wider text-wood-golden">KODE: WOOD2024</p>
              </div>
            </div>
            <button
              onClick={goToHome}
              className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all`}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
