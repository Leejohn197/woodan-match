/**
 * Wood Match - Furniture Tile Matching Game
 * A "羊了个羊" inspired game for Indonesian wooden furniture exhibition
 * Multi-level progressive mode with themed furniture
 */

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
        // Level themes
        level1Theme: 'Furnitur Ruang Tamu',
        level2Theme: 'Furnitur Outdoor',
        level3Theme: 'Furnitur Kamar Tidur',
        // Level names
        level1Name: 'Tingkat 1',
        level2Name: 'Tingkat 2',
        level3Name: 'Tingkat 3',
        level1Desc: 'Ruang Tamu - Mudah',
        level2Desc: 'Outdoor - Sedang',
        level3Desc: 'Kamar Tidur - Sulit',
        // Furniture names - Living Room
        'sofa': 'Sofa',
        'armchair': 'Kursi Sofa',
        'coffee-table': 'Meja Kopi',
        'tv-stand': 'Rak TV',
        'floor-lamp': 'Lampu Lantai',
        'bookshelf': 'Rak Buku',
        // Furniture names - Outdoor
        'garden-chair': 'Kursi Taman',
        'sun-lounger': 'Kursi Berjemur',
        'patio-table': 'Meja Teras',
        'umbrella': 'Payung',
        'hammock': 'Hammock',
        'planter': 'Pot Tanaman',
        // Furniture names - Bedroom
        'bed': 'Tempat Tidur',
        'wardrobe': 'Lemari Pakaian',
        'dresser': 'Meja Rias',
        'nightstand': 'Meja Samping',
        'mirror': 'Cermin',
        'desk': 'Meja Kerja',
        // Additional furniture (actually used in game)
        'dining-chair': 'Kursi Makan',
        'table': 'Meja',
        'stool': 'Bangku',
        'pattern1': 'Motif 1',
        'pattern2': 'Motif 2',
        'lounge-chair': 'Kursi Santai',
        'ladder-chair': 'Kursi Tangga',
        'round-table': 'Meja Bundar'
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
        // Level themes
        level1Theme: '客厅家具',
        level2Theme: '户外家具',
        level3Theme: '卧室家具',
        // Level names
        level1Name: '第1关',
        level2Name: '第2关',
        level3Name: '第3关',
        level1Desc: '客厅 - 简单',
        level2Desc: '户外 - 中等',
        level3Desc: '卧室 - 困难',
        // Furniture names - Living Room
        'sofa': '沙发',
        'armchair': '单人沙发',
        'coffee-table': '茶几',
        'tv-stand': '电视柜',
        'floor-lamp': '落地灯',
        'bookshelf': '书架',
        // Furniture names - Outdoor
        'garden-chair': '花园椅',
        'sun-lounger': '躺椅',
        'patio-table': '露台桌',
        'umbrella': '遮阳伞',
        'hammock': '吊床',
        'planter': '花盆',
        // Furniture names - Bedroom
        'bed': '床',
        'wardrobe': '衣柜',
        'dresser': '梳妆台',
        'nightstand': '床头柜',
        'mirror': '镜子',
        'desk': '书桌',
        // Additional furniture (actually used in game)
        'dining-chair': '餐椅',
        'table': '餐桌',
        'stool': '凳子',
        'pattern1': '图案一',
        'pattern2': '图案二',
        'lounge-chair': '休闲椅',
        'ladder-chair': '梯背椅',
        'round-table': '圆桌'
    }
};

// ===== Furniture Types by Theme =====
const FURNITURE_THEMES = {
    // Level 1: Living Room (客厅)
    livingRoom: [
        { id: 'armchair', image: 'assets/images/armchair.png' },
        { id: 'dining-chair', image: 'assets/images/dining_chair.png' },
        { id: 'table', image: 'assets/images/table.png' },
        { id: 'stool', image: 'assets/images/stool.png' },
        { id: 'pattern1', image: 'assets/images/pattern1.png' },
        { id: 'lounge-chair', image: 'assets/images/lounge_chair.png' }
    ],
    // Level 2: Outdoor (户外)
    outdoor: [
        { id: 'ladder-chair', image: 'assets/images/ladder_chair.png' },
        { id: 'round-table', image: 'assets/images/round_table.png' },
        { id: 'armchair', image: 'assets/images/armchair.png' },
        { id: 'pattern2', image: 'assets/images/pattern2.png' },
        { id: 'dining-chair', image: 'assets/images/dining_chair.png' },
        { id: 'stool', image: 'assets/images/stool.png' }
    ],
    // Level 3: Bedroom (卧室)
    bedroom: [
        { id: 'lounge-chair', image: 'assets/images/lounge_chair.png' },
        { id: 'pattern1', image: 'assets/images/pattern1.png' },
        { id: 'table', image: 'assets/images/table.png' },
        { id: 'ladder-chair', image: 'assets/images/ladder_chair.png' },
        { id: 'pattern2', image: 'assets/images/pattern2.png' },
        { id: 'round-table', image: 'assets/images/round_table.png' }
    ]
};

// ===== Level Configurations =====
const LEVEL_CONFIGS = {
    1: {
        theme: 'livingRoom',
        themeKey: 'level1Theme',
        nameKey: 'level1Name',
        descKey: 'level1Desc',
        types: 3,           // Only 3 furniture types - very easy
        tilesPerType: 6,    // 18 total tiles
        layers: 2,          // 2 layers - minimal overlap
        gridWidth: 4,
        gridHeight: 3,
        hasPrize: false     // No prize, just continue
    },
    2: {
        theme: 'outdoor',
        themeKey: 'level2Theme',
        nameKey: 'level2Name',
        descKey: 'level2Desc',
        types: 4,           // 4 furniture types - medium
        tilesPerType: 9,    // 36 total tiles
        layers: 3,          // 3 layers
        gridWidth: 5,
        gridHeight: 4,
        hasPrize: false     // No prize, continue to final
    },
    3: {
        theme: 'bedroom',
        themeKey: 'level3Theme',
        nameKey: 'level3Name',
        descKey: 'level3Desc',
        types: 6,           // All 6 furniture types - hard
        tilesPerType: 12,   // 72 total tiles
        layers: 4,          // 4 layers - maximum overlap
        gridWidth: 6,
        gridHeight: 5,
        hasPrize: true      // Grand prize!
    }
};

const MAX_LEVEL = 3;

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
    try {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.warn('Web Audio API not supported in this browser');
                return false;
            }
            audioContext = new AudioContextClass();
        }
        return true;
    } catch (e) {
        console.error('Audio initialization failed:', e);
        return false;
    }
}

// ===== Haptic Feedback for Mobile =====
function vibrate(pattern) {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Vibration not supported or failed silently
        }
    }
}

function hapticTap() {
    vibrate(10); // Light tap - 10ms
}

function hapticMatch() {
    vibrate([30, 50, 30]); // Double vibration for match
}

function hapticGameOver() {
    vibrate(200); // Long vibration for game over
}

function hapticVictory() {
    vibrate([50, 30, 50, 30, 100]); // Celebratory pattern
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

    // Play Happy Match style sound - cheerful bubble pop with chime
    const notes = [
        { freq: 659, start: 0, duration: 0.1 },     // E5
        { freq: 784, start: 0.05, duration: 0.1 },  // G5
        { freq: 1047, start: 0.1, duration: 0.15 }  // C6
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
    journeySteps: document.querySelectorAll('.journey-step[data-level]'),
    currentLevel: document.getElementById('current-level'),
    levelSubtitle: document.getElementById('level-subtitle'),
    tileContainer: document.getElementById('tile-container'),
    slotContainer: document.getElementById('slot-container'),
    progressFill: document.getElementById('progress-fill'),
    tilesRemaining: document.getElementById('tiles-remaining'),
    victoryModal: document.getElementById('victory-modal'),
    victoryIcon: document.getElementById('victory-icon'),
    victoryTitle: document.getElementById('victory-title'),
    victoryMessage: document.getElementById('victory-message'),
    gameoverModal: document.getElementById('gameover-modal'),
    claimModal: document.getElementById('claim-modal'),
    furnitureShowcase: document.getElementById('furniture-showcase'),
    claimBtn: document.getElementById('claim-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    retryBtn: document.getElementById('retry-btn'),
    homeBtn: document.getElementById('home-btn'),
    closeClaimBtn: document.getElementById('close-claim-btn')
};

// ===== Game Initialization =====
// UUID generator for unique tile IDs
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateTiles(levelConfig) {
    const tiles = [];
    // Get themed furniture for this level
    const themeFurniture = FURNITURE_THEMES[levelConfig.theme];
    const types = themeFurniture.slice(0, levelConfig.types);

    // Generate tiles: 3 of each type must exist for matches
    types.forEach(type => {
        for (let i = 0; i < levelConfig.tilesPerType; i++) {
            tiles.push({
                id: generateUUID(),  // Unique UUID for each tile
                type: type.id,
                image: type.image,
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

function renderTiles(isInitialRender = false) {
    if (isInitialRender) {
        // Full render only on game start
        elements.tileContainer.innerHTML = '';

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
                <img src="${tile.image}" class="tile-image" alt="${getFurnitureName(tile.type)}">
                <span class="tile-name">${getFurnitureName(tile.type)}</span>
            `;

            if (!tile.blocked) {
                tileEl.addEventListener('click', () => handleTileClick(tile));
            }

            elements.tileContainer.appendChild(tileEl);
        });
    } else {
        // Update only: refresh blocked states without re-creating tiles
        gameState.tiles.forEach(tile => {
            const tileEl = elements.tileContainer.querySelector(`[data-id="${tile.id}"]`);
            if (tileEl) {
                const wasBlocked = tileEl.classList.contains('blocked');
                const isNowBlocked = tile.blocked;

                if (wasBlocked && !isNowBlocked) {
                    // Tile became unblocked - update class and add click listener
                    tileEl.classList.remove('blocked');
                    tileEl.addEventListener('click', () => handleTileClick(tile));
                } else if (!wasBlocked && isNowBlocked) {
                    // Tile became blocked
                    tileEl.classList.add('blocked');
                }
            }
        });
    }

    updateProgress();
}

// Remove a single tile from DOM with animation
function removeTileFromDOM(tileId) {
    const tileEl = elements.tileContainer.querySelector(`[data-id="${tileId}"]`);
    if (tileEl) {
        tileEl.classList.add('exiting');
        tileEl.style.pointerEvents = 'none';
        // Remove from DOM after animation
        setTimeout(() => {
            if (tileEl.parentNode) {
                tileEl.parentNode.removeChild(tileEl);
            }
        }, 300);
    }
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
                    <img src="${tile.image}" class="tile-image" alt="${tile.type}">
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
    hapticTap();  // Mobile haptic feedback

    // Remove tile from DOM with animation
    removeTileFromDOM(tile.id);

    // Add tile to slots
    gameState.slots.push(tile);

    // Remove tile from game state
    gameState.tiles = gameState.tiles.filter(t => t.id !== tile.id);

    // Update blocked status
    checkBlockedTiles();

    // Update blocked tiles only (no full re-render)
    renderTiles(false);
    renderSlots();
    updateProgress();

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
            // Find the 3 matching tiles to remove
            const tilesToRemove = [];
            gameState.slots.forEach(tile => {
                if (tile.type === type && tilesToRemove.length < 3) {
                    tilesToRemove.push(tile.id);
                }
            });

            // Add .removing class to trigger animation
            tilesToRemove.forEach(tileId => {
                const slotElements = elements.slotContainer.querySelectorAll('.slot .tile');
                slotElements.forEach((el, index) => {
                    if (gameState.slots[index] && gameState.slots[index].id === tileId) {
                        el.classList.add('removing');
                    }
                });
            });

            playMatchSound();
            hapticMatch();  // Mobile haptic feedback

            // Wait for animation to complete (300ms) before removing from data
            setTimeout(() => {
                // Remove 3 matching tiles from data
                let removed = 0;
                gameState.slots = gameState.slots.filter(tile => {
                    if (tile.type === type && removed < 3) {
                        removed++;
                        return false;
                    }
                    return true;
                });

                // Re-render slots after data removal
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
    hapticVictory();  // Mobile haptic feedback

    const config = LEVEL_CONFIGS[gameState.currentLevel];
    const themeFurniture = FURNITURE_THEMES[config.theme];
    const types = themeFurniture.slice(0, config.types);

    // Show furniture showcase with images
    elements.furnitureShowcase.innerHTML = types.map(type =>
        `<div class="showcase-item"><img src="${type.image}" alt="${type.id}" style="width: 32px; height: 32px; object-fit: contain;"></div>`
    ).join('');

    // Check if this is the final level (grand prize) or intermediate level
    const isFinalLevel = gameState.currentLevel >= MAX_LEVEL;

    if (isFinalLevel) {
        // Grand Prize! Show claim button
        elements.victoryIcon.textContent = '🏆';
        elements.victoryTitle.textContent = gameState.currentLang === 'zh'
            ? '恭喜通关!'
            : 'Selamat!';
        elements.victoryMessage.textContent = gameState.currentLang === 'zh'
            ? '您已解锁豪华家具套装!'
            : 'Anda telah membuka set furnitur mewah!';
        elements.nextLevelBtn.style.display = 'none';
        elements.claimBtn.style.display = 'flex';
    } else {
        // Intermediate level - show next level button
        elements.victoryIcon.textContent = '🎉';
        const levelClearedText = gameState.currentLang === 'zh'
            ? `第${gameState.currentLevel}关通过!`
            : `Tingkat ${gameState.currentLevel} Selesai!`;
        elements.victoryTitle.textContent = levelClearedText;

        const nextTheme = LEVEL_CONFIGS[gameState.currentLevel + 1];
        const nextThemeText = gameState.currentLang === 'zh'
            ? `下一关: ${TRANSLATIONS.zh[nextTheme.themeKey]}`
            : `Berikutnya: ${TRANSLATIONS.id[nextTheme.themeKey]}`;
        elements.victoryMessage.textContent = nextThemeText;

        elements.nextLevelBtn.style.display = 'flex';
        elements.claimBtn.style.display = 'none';
    }

    elements.victoryModal.classList.add('active');
}

function gameOver() {
    if (gameState.isGameOver) return;
    gameState.isGameOver = true;
    hapticGameOver();  // Mobile haptic feedback

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
        ? TRANSLATIONS.zh[config.nameKey]
        : TRANSLATIONS.id[config.nameKey];
    const themeText = gameState.currentLang === 'zh'
        ? TRANSLATIONS.zh[config.themeKey]
        : TRANSLATIONS.id[config.themeKey];
    elements.currentLevel.textContent = levelText;
    elements.levelSubtitle.textContent = themeText;

    // Update journey step highlights
    updateJourneyHighlight();

    // Generate tiles
    gameState.tiles = generateTiles(config);
    gameState.totalTiles = gameState.tiles.length;

    // Check blocked tiles
    checkBlockedTiles();

    // Render with initial animation
    renderTiles(true);
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
    // Reset to level 1 when going home
    gameState.currentLevel = 1;
    updateJourneyHighlight();
}

function updateJourneyHighlight() {
    // Update which journey step is highlighted based on current level
    elements.journeySteps.forEach(step => {
        const stepLevel = parseInt(step.dataset.level);
        step.classList.remove('current', 'completed');

        if (stepLevel === gameState.currentLevel) {
            step.classList.add('current');
            step.style.borderColor = 'var(--accent-gold)';
            step.style.background = 'rgba(212, 165, 116, 0.2)';
        } else if (stepLevel < gameState.currentLevel) {
            step.classList.add('completed');
            step.style.borderColor = 'var(--accent-green)';
            step.style.background = 'rgba(45, 90, 39, 0.2)';
        } else {
            step.style.borderColor = 'var(--glass-border)';
            step.style.background = 'var(--glass-bg)';
        }
    });
}

// ===== Event Listeners =====
elements.startBtn.addEventListener('click', () => {
    gameState.currentLevel = 1;
    startGame();
});

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
    // Advance to next level (up to MAX_LEVEL)
    if (gameState.currentLevel < MAX_LEVEL) {
        gameState.currentLevel++;
    }
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
console.log('Languages: 🇮🇩 Indonesia | 🇨🇳 中文');
