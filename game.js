/**
 * Wood Match - Furniture Tile Matching Game
 * A "羊了个羊" inspired game for Indonesian wooden furniture exhibition
 */

// ===== Translations =====
const TRANSLATIONS = {
    id: {
        tagline: 'Permainan Furnitur Kayu',
        tutorial: 'Tutorial',
        challenge: 'Tantangan',
        level1Desc: 'Tingkat 1 - Mudah',
        level2Desc: 'Tingkat 2 - Sulit',
        startGame: 'Mulai Main',
        level1: 'Tingkat 1',
        level2: 'Tingkat 2',
        remaining: 'Sisa',
        tiles: 'ubin',
        congratulations: 'Selamat!',
        victoryMessage: 'Anda telah membuka set furnitur mewah!',
        claimPrize: 'Klaim Hadiah',
        nextLevel: 'Tingkat Berikutnya',
        gameOver: 'Permainan Berakhir',
        gameOverMessage: 'Slot sudah penuh! Coba lagi?',
        tryAgain: 'Coba Lagi',
        mainMenu: 'Menu Utama',
        yourPrize: 'Hadiah Anda!',
        showScreen: 'Tunjukkan layar ini kepada staff kami untuk menerima hadiah spesial!',
        close: 'Tutup',
        // Furniture names
        'teak-chair': 'Kursi Jati',
        'rattan-sofa': 'Sofa Rotan',
        'bedside-table': 'Meja Samping',
        'coffee-table': 'Meja Kopi',
        'cabinet': 'Lemari',
        'shelf': 'Rak Buku'
    },
    zh: {
        tagline: '木质家具消消乐',
        tutorial: '教程',
        challenge: '挑战',
        level1Desc: '第1关 - 简单',
        level2Desc: '第2关 - 困难',
        startGame: '开始游戏',
        level1: '第1关',
        level2: '第2关',
        remaining: '剩余',
        tiles: '块',
        congratulations: '恭喜!',
        victoryMessage: '您已解锁豪华家具套装!',
        claimPrize: '领取奖品',
        nextLevel: '下一关',
        gameOver: '游戏结束',
        gameOverMessage: '槽位已满！再试一次？',
        tryAgain: '再试一次',
        mainMenu: '主菜单',
        yourPrize: '您的奖品!',
        showScreen: '请向工作人员展示此屏幕以领取特别奖品！',
        close: '关闭',
        // Furniture names
        'teak-chair': '柚木椅',
        'rattan-sofa': '藤编沙发',
        'bedside-table': '床头柜',
        'coffee-table': '茶几',
        'cabinet': '木柜',
        'shelf': '书架'
    }
};

// ===== Furniture Types =====
const FURNITURE_TYPES = [
    { id: 'teak-chair', icon: '🪑' },
    { id: 'rattan-sofa', icon: '🛋️' },
    { id: 'bedside-table', icon: '🪵' },
    { id: 'coffee-table', icon: '☕' },
    { id: 'cabinet', icon: '🗄️' },
    { id: 'shelf', icon: '📚' }
];

// ===== Level Configurations =====
const LEVEL_CONFIGS = {
    1: {
        name: 'Tutorial',
        nameZh: '教程',
        subtitle: 'Tingkat 1 - Mudah',
        subtitleZh: '第1关 - 简单',
        types: 3,
        tilesPerType: 6,
        layers: 2,
        gridWidth: 4,
        gridHeight: 3,
        description: 'Level tutorial sangat mudah!'
    },
    2: {
        name: 'Tantangan',
        nameZh: '挑战',
        subtitle: 'Tingkat 2 - Sulit',
        subtitleZh: '第2关 - 困难',
        types: 6,
        tilesPerType: 12,
        layers: 4,
        gridWidth: 6,
        gridHeight: 5,
        description: 'Bisakah Anda menyelesaikannya?'
    }
};

// ===== Game State =====
const gameState = {
    currentLevel: 1,
    currentLang: 'id', // 'id' for Indonesian, 'zh' for Chinese
    tiles: [],
    slots: [],
    totalTiles: 0,
    remainingTiles: 0,
    soundEnabled: true,
    isGameOver: false,
    isVictory: false
};

// ===== Audio Context for Wood Knock Sound =====
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playWoodKnock() {
    if (!gameState.soundEnabled || !audioContext) return;

    // Create a wood knock sound using oscillators
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Wood knock characteristics
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

function playMatchSound() {
    if (!gameState.soundEnabled || !audioContext) return;

    // Play a satisfying "ding" for matches
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioContext.currentTime);
    osc.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.3);
}

function playVictorySound() {
    if (!gameState.soundEnabled || !audioContext) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
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

// ===== DOM Elements =====
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    startBtn: document.getElementById('start-btn'),
    backBtn: document.getElementById('back-btn'),
    soundBtn: document.getElementById('sound-btn'),
    soundIcon: document.getElementById('sound-icon'),
    levelBtns: document.querySelectorAll('.level-btn'),
    currentLevel: document.getElementById('current-level'),
    levelSubtitle: document.getElementById('level-subtitle'),
    tileContainer: document.getElementById('tile-container'),
    slotContainer: document.getElementById('slot-container'),
    progressFill: document.getElementById('progress-fill'),
    tilesRemaining: document.getElementById('tiles-remaining'),
    victoryModal: document.getElementById('victory-modal'),
    gameoverModal: document.getElementById('gameover-modal'),
    claimModal: document.getElementById('claim-modal'),
    furnitureShowcase: document.getElementById('furniture-showcase'),
    claimBtn: document.getElementById('claim-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    retryBtn: document.getElementById('retry-btn'),
    homeBtn: document.getElementById('home-btn'),
    closeClaimBtn: document.getElementById('close-claim-btn')
};

// ===== Level Selection =====
elements.levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.levelBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameState.currentLevel = parseInt(btn.dataset.level);
    });
});

// Select first level by default
document.querySelector('.level-btn[data-level="1"]').classList.add('selected');

// ===== Game Initialization =====
function generateTiles(levelConfig) {
    const tiles = [];
    const types = FURNITURE_TYPES.slice(0, levelConfig.types);

    // Generate tiles: 3 of each type must exist for matches
    types.forEach(type => {
        for (let i = 0; i < levelConfig.tilesPerType; i++) {
            tiles.push({
                id: `tile-${tiles.length}`,
                type: type.id,
                icon: type.icon,
                name: type.name,
                layer: 0,
                x: 0,
                y: 0,
                blocked: false
            });
        }
    });

    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    // Assign positions and layers
    const tileWidth = 60;
    const tileHeight = 70;
    const containerWidth = 320;
    const containerHeight = 400;
    const layers = levelConfig.layers;
    const tilesPerLayer = Math.ceil(tiles.length / layers);

    tiles.forEach((tile, index) => {
        const layer = Math.floor(index / tilesPerLayer);
        const indexInLayer = index % tilesPerLayer;

        // Calculate grid position with some randomness
        const cols = levelConfig.gridWidth;
        const rows = levelConfig.gridHeight;

        const col = indexInLayer % cols;
        const row = Math.floor(indexInLayer / cols) % rows;

        // Base position
        const baseX = (containerWidth - cols * tileWidth) / 2 + col * tileWidth;
        const baseY = (containerHeight - rows * tileHeight) / 2 + row * tileHeight;

        // Add offset for layer stacking effect (shifted diagonally)
        const layerOffset = layer * 15;

        // Add small random offset for visual interest
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;

        tile.x = Math.max(0, Math.min(containerWidth - tileWidth, baseX + layerOffset + randomX));
        tile.y = Math.max(0, Math.min(containerHeight - tileHeight, baseY - layerOffset + randomY));
        tile.layer = layer;
    });

    return tiles;
}

function checkBlockedTiles() {
    // Check which tiles are blocked by tiles above them
    gameState.tiles.forEach(tile => {
        tile.blocked = false;

        // Check if any tile is on top of this one
        gameState.tiles.forEach(otherTile => {
            if (tile.id === otherTile.id) return;
            if (otherTile.layer <= tile.layer) return;

            // Check overlap
            const overlapX = Math.abs(tile.x - otherTile.x) < 40;
            const overlapY = Math.abs(tile.y - otherTile.y) < 50;

            if (overlapX && overlapY) {
                tile.blocked = true;
            }
        });
    });
}

function renderTiles() {
    elements.tileContainer.innerHTML = '';

    // Sort by layer (lower layers first, so they appear behind)
    const sortedTiles = [...gameState.tiles].sort((a, b) => a.layer - b.layer);

    sortedTiles.forEach((tile, index) => {
        const tileEl = document.createElement('div');
        tileEl.className = `tile ${tile.blocked ? 'blocked' : ''} entering`;
        tileEl.dataset.id = tile.id;
        tileEl.style.left = `${tile.x}px`;
        tileEl.style.top = `${tile.y}px`;
        tileEl.style.zIndex = tile.layer * 10 + index;
        tileEl.style.animationDelay = `${index * 0.02}s`;

        tileEl.innerHTML = `
            <span class="tile-icon">${tile.icon}</span>
            <span class="tile-name">${getFurnitureName(tile.type)}</span>
        `;

        if (!tile.blocked) {
            tileEl.addEventListener('click', () => handleTileClick(tile));
        }

        elements.tileContainer.appendChild(tileEl);
    });

    updateProgress();
}

function renderSlots() {
    const slots = elements.slotContainer.querySelectorAll('.slot');
    slots.forEach((slotEl, index) => {
        slotEl.innerHTML = '';
        slotEl.classList.remove('filled');

        if (gameState.slots[index]) {
            slotEl.classList.add('filled');
            const tile = gameState.slots[index];
            slotEl.innerHTML = `
                <div class="tile">
                    <span class="tile-icon">${tile.icon}</span>
                </div>
            `;
        }
    });
}

function updateProgress() {
    const config = LEVEL_CONFIGS[gameState.currentLevel];
    const total = config.types * config.tilesPerType;
    const remaining = gameState.tiles.length;
    const progress = ((total - remaining) / total) * 100;

    elements.progressFill.style.width = `${progress}%`;
    elements.tilesRemaining.textContent = remaining;
    gameState.remainingTiles = remaining;
}

// ===== Game Logic =====
function handleTileClick(tile) {
    if (gameState.isGameOver || gameState.isVictory) return;
    if (tile.blocked) return;

    initAudio();
    playWoodKnock();

    // Add tile to slots
    gameState.slots.push(tile);

    // Remove tile from board
    gameState.tiles = gameState.tiles.filter(t => t.id !== tile.id);

    // Update blocked status
    checkBlockedTiles();

    // Render updates
    renderTiles();
    renderSlots();

    // Check for matches (3 of same type)
    checkMatches();

    // Check game over conditions
    setTimeout(() => {
        if (gameState.slots.length >= 7) {
            gameOver();
        } else if (gameState.tiles.length === 0 && gameState.slots.length === 0) {
            victory();
        }
    }, 100);
}

function checkMatches() {
    // Group slots by type
    const typeCount = {};
    gameState.slots.forEach(tile => {
        typeCount[tile.type] = (typeCount[tile.type] || 0) + 1;
    });

    // Check if any type has 3 matches
    Object.keys(typeCount).forEach(type => {
        if (typeCount[type] >= 3) {
            // Remove 3 matching tiles
            let removed = 0;
            gameState.slots = gameState.slots.filter(tile => {
                if (tile.type === type && removed < 3) {
                    removed++;
                    return false;
                }
                return true;
            });

            playMatchSound();

            // Animate matching slots
            const slots = elements.slotContainer.querySelectorAll('.slot.filled');
            slots.forEach(slot => slot.classList.add('matching'));
            setTimeout(() => {
                slots.forEach(slot => slot.classList.remove('matching'));
                renderSlots();

                // Check victory after match
                if (gameState.tiles.length === 0 && gameState.slots.length === 0) {
                    victory();
                }
            }, 300);
        }
    });
}

function victory() {
    if (gameState.isVictory) return;
    gameState.isVictory = true;

    playVictorySound();

    // Show furniture showcase
    const types = FURNITURE_TYPES.slice(0, LEVEL_CONFIGS[gameState.currentLevel].types);
    elements.furnitureShowcase.innerHTML = types.map(type =>
        `<div class="showcase-item">${type.icon}</div>`
    ).join('');

    // Show/hide next level button
    if (gameState.currentLevel < 2) {
        elements.nextLevelBtn.style.display = 'block';
    } else {
        elements.nextLevelBtn.style.display = 'none';
    }

    elements.victoryModal.classList.add('active');
}

function gameOver() {
    if (gameState.isGameOver) return;
    gameState.isGameOver = true;

    elements.gameoverModal.classList.add('active');
}

function startGame() {
    // Reset state
    gameState.tiles = [];
    gameState.slots = [];
    gameState.isGameOver = false;
    gameState.isVictory = false;

    // Get level config
    const config = LEVEL_CONFIGS[gameState.currentLevel];

    // Update UI with translations
    const levelText = gameState.currentLang === 'zh'
        ? `第${gameState.currentLevel}关`
        : `Tingkat ${gameState.currentLevel}`;
    const levelName = gameState.currentLang === 'zh'
        ? config.nameZh
        : config.name;
    elements.currentLevel.textContent = levelText;
    elements.levelSubtitle.textContent = levelName;

    // Generate tiles
    gameState.tiles = generateTiles(config);
    gameState.totalTiles = gameState.tiles.length;

    // Check blocked tiles
    checkBlockedTiles();

    // Render
    renderTiles();
    renderSlots();

    // Switch screens
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.add('active');
}

function goToHome() {
    elements.gameScreen.classList.remove('active');
    elements.victoryModal.classList.remove('active');
    elements.gameoverModal.classList.remove('active');
    elements.claimModal.classList.remove('active');
    elements.startScreen.classList.add('active');
}

// ===== Event Listeners =====
elements.startBtn.addEventListener('click', startGame);

elements.backBtn.addEventListener('click', goToHome);

elements.soundBtn.addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
});

elements.claimBtn.addEventListener('click', () => {
    elements.victoryModal.classList.remove('active');
    elements.claimModal.classList.add('active');
});

elements.nextLevelBtn.addEventListener('click', () => {
    elements.victoryModal.classList.remove('active');
    gameState.currentLevel = 2;
    startGame();
});

elements.retryBtn.addEventListener('click', () => {
    elements.gameoverModal.classList.remove('active');
    startGame();
});

elements.homeBtn.addEventListener('click', goToHome);

elements.closeClaimBtn.addEventListener('click', goToHome);

// ===== Keyboard shortcut for testing =====
document.addEventListener('keydown', (e) => {
    // Press 'W' to win instantly (for testing)
    if (e.key === 'w' && e.ctrlKey) {
        gameState.tiles = [];
        gameState.slots = [];
        victory();
    }
});

// ===== Translation System =====
function t(key) {
    return TRANSLATIONS[gameState.currentLang][key] || key;
}

function getFurnitureName(furnitureId) {
    return TRANSLATIONS[gameState.currentLang][furnitureId] || furnitureId;
}

function updateLanguage(lang) {
    gameState.currentLang = lang;

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (TRANSLATIONS[lang][key]) {
            el.textContent = TRANSLATIONS[lang][key];
        }
    });

    // Update document language
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'id';

    // Update page title
    document.title = lang === 'zh' ? 'Wood Match - 木质家具消消乐' : 'Wood Match - Permainan Furnitur';

    // Save preference
    localStorage.setItem('woodmatch_lang', lang);

    console.log(`🌐 Language switched to: ${lang === 'zh' ? '中文' : 'Indonesia'}`);
}

// ===== Language Toggle Event Listeners =====
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        updateLanguage(btn.dataset.lang);
    });
});

// ===== Load Saved Language Preference =====
function initLanguage() {
    const savedLang = localStorage.getItem('woodmatch_lang');
    if (savedLang && (savedLang === 'id' || savedLang === 'zh')) {
        updateLanguage(savedLang);
    }
}

// ===== Initialize =====
initLanguage();
console.log('🪵 Wood Match Game Loaded');
console.log('Furniture types:', FURNITURE_TYPES.map(f => f.icon).join(' '));
console.log('Languages: 🇮🇩 Indonesia | 🇨🇳 中文');

