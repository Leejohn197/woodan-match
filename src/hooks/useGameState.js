import { useReducer, useCallback, useEffect, useMemo, useRef } from 'react';
import { LEVEL_CONFIGS, MAX_LEVEL } from '../config/levels';
import { FURNITURE_THEMES } from '../config/themes';
import { WHEEL_PRIZES } from '../config/prizes';
import { GAME_CONSTANTS } from '../config/constants';
import { generateUUID } from '../utils/helpers';
import { storage } from '../utils/storage';
import {
    initAudio,
    hapticTap,
    hapticMatch,
    hapticGameOver,
    hapticVictory,
    playWoodKnock,
    playMatchSound,
    playVictorySound
} from '../utils/audio';

// ===== Initial State =====
const createInitialState = () => ({
    // Screen state
    currentScreen: 'start',
    currentLevel: 1,
    currentLang: 'id',
    soundEnabled: true,

    // Game state
    tiles: [],
    slots: [],
    isGameOver: false,
    isVictory: false,
    activeModal: null,

    // Animation state
    exitingTiles: new Set(),
    removingSlots: new Set(),
    isMatching: false,

    // Spin wheel state
    wheelRotation: 0,
    wheelResult: null,
    isSpinning: false,
    wonPrizes: [],

    // Other
    cooldownRemaining: 0,
    claimedRewardLevel: null
});

// ===== Action Types =====
const ActionTypes = {
    SET_SCREEN: 'SET_SCREEN',
    SET_LEVEL: 'SET_LEVEL',
    SET_LANG: 'SET_LANG',
    TOGGLE_SOUND: 'TOGGLE_SOUND',
    SET_TILES: 'SET_TILES',
    ADD_TO_SLOT: 'ADD_TO_SLOT',
    REMOVE_FROM_SLOTS: 'REMOVE_FROM_SLOTS',
    SET_GAME_OVER: 'SET_GAME_OVER',
    SET_VICTORY: 'SET_VICTORY',
    SET_MODAL: 'SET_MODAL',
    ADD_EXITING_TILE: 'ADD_EXITING_TILE',
    REMOVE_EXITING_TILE: 'REMOVE_EXITING_TILE',
    SET_REMOVING_SLOTS: 'SET_REMOVING_SLOTS',
    SET_MATCHING: 'SET_MATCHING',
    SET_WHEEL_ROTATION: 'SET_WHEEL_ROTATION',
    SET_WHEEL_RESULT: 'SET_WHEEL_RESULT',
    SET_SPINNING: 'SET_SPINNING',
    SET_WON_PRIZES: 'SET_WON_PRIZES',
    ADD_WON_PRIZE: 'ADD_WON_PRIZE',
    SET_COOLDOWN: 'SET_COOLDOWN',
    SET_CLAIMED_LEVEL: 'SET_CLAIMED_LEVEL',
    START_GAME: 'START_GAME',
    RESET_GAME: 'RESET_GAME',
    CLEAR_MATCHED_TILES: 'CLEAR_MATCHED_TILES',
    MOVE_TILE_TO_SLOT: 'MOVE_TILE_TO_SLOT',
    COMPLETE_SPIN: 'COMPLETE_SPIN'
};

// ===== Helper Functions =====
function checkBlockedTilesHelper(tileList) {
    return tileList.map(tile => {
        let blocked = false;
        tileList.forEach(otherTile => {
            if (tile.id === otherTile.id) return;
            if (otherTile.layer <= tile.layer) return;
            const overlapX = Math.abs(tile.x - otherTile.x) < GAME_CONSTANTS.TILE_OVERLAP_THRESHOLD_X;
            const overlapY = Math.abs(tile.y - otherTile.y) < GAME_CONSTANTS.TILE_OVERLAP_THRESHOLD_Y;
            if (overlapX && overlapY) blocked = true;
        });
        return { ...tile, blocked };
    });
}

// ===== Reducer =====
function gameReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_SCREEN:
            return { ...state, currentScreen: action.payload };

        case ActionTypes.SET_LEVEL:
            return { ...state, currentLevel: action.payload };

        case ActionTypes.SET_LANG:
            return { ...state, currentLang: action.payload };

        case ActionTypes.TOGGLE_SOUND:
            return { ...state, soundEnabled: !state.soundEnabled };

        case ActionTypes.SET_TILES:
            return { ...state, tiles: action.payload };

        case ActionTypes.ADD_TO_SLOT:
            return { ...state, slots: [...state.slots, action.payload] };

        case ActionTypes.REMOVE_FROM_SLOTS:
            return { ...state, slots: action.payload };

        case ActionTypes.CLEAR_MATCHED_TILES: {
            const { matchedType, matchCount } = action.payload;
            let removed = 0;
            const newSlots = state.slots.filter(tile => {
                if (tile.type === matchedType && removed < matchCount) {
                    removed++;
                    return false;
                }
                return true;
            });
            return {
                ...state,
                slots: newSlots,
                removingSlots: new Set(),
                isMatching: false
            };
        }

        case ActionTypes.MOVE_TILE_TO_SLOT: {
            const { tile } = action.payload;
            // Remove tile from tiles array and recalculate blocked status
            const remainingTiles = state.tiles.filter(t => t.id !== tile.id);
            const updatedTiles = checkBlockedTilesHelper(remainingTiles);
            // Remove from exiting tiles
            const newExitingTiles = new Set(state.exitingTiles);
            newExitingTiles.delete(tile.id);
            return {
                ...state,
                tiles: updatedTiles,
                slots: [...state.slots, tile],
                exitingTiles: newExitingTiles
            };
        }

        case ActionTypes.SET_GAME_OVER:
            return { ...state, isGameOver: action.payload };

        case ActionTypes.SET_VICTORY:
            return { ...state, isVictory: action.payload };

        case ActionTypes.SET_MODAL:
            return { ...state, activeModal: action.payload };

        case ActionTypes.ADD_EXITING_TILE:
            return {
                ...state,
                exitingTiles: new Set([...state.exitingTiles, action.payload])
            };

        case ActionTypes.REMOVE_EXITING_TILE: {
            const newSet = new Set(state.exitingTiles);
            newSet.delete(action.payload);
            return { ...state, exitingTiles: newSet };
        }

        case ActionTypes.SET_REMOVING_SLOTS:
            return { ...state, removingSlots: new Set(action.payload) };

        case ActionTypes.SET_MATCHING:
            return { ...state, isMatching: action.payload };

        case ActionTypes.SET_WHEEL_ROTATION:
            return { ...state, wheelRotation: action.payload };

        case ActionTypes.SET_WHEEL_RESULT:
            return { ...state, wheelResult: action.payload };

        case ActionTypes.SET_SPINNING:
            return { ...state, isSpinning: action.payload };

        case ActionTypes.SET_WON_PRIZES:
            return { ...state, wonPrizes: action.payload };

        case ActionTypes.ADD_WON_PRIZE:
            return { ...state, wonPrizes: [...state.wonPrizes, action.payload] };

        case ActionTypes.COMPLETE_SPIN: {
            const { prizeId, finalRotation } = action.payload;
            const newWonPrizes = [...state.wonPrizes, prizeId];
            // Save to storage synchronously in reducer to avoid stale closure
            storage.setWonPrizes(newWonPrizes);
            storage.setWheelRotation(finalRotation);
            return {
                ...state,
                isSpinning: false,
                wheelResult: prizeId,
                wonPrizes: newWonPrizes
            };
        }

        case ActionTypes.SET_COOLDOWN:
            return { ...state, cooldownRemaining: action.payload };

        case ActionTypes.SET_CLAIMED_LEVEL:
            return { ...state, claimedRewardLevel: action.payload };

        case ActionTypes.START_GAME:
            return {
                ...state,
                tiles: action.payload.tiles,
                slots: [],
                isGameOver: false,
                isVictory: false,
                activeModal: null,
                exitingTiles: new Set(),
                removingSlots: new Set(),
                wheelResult: null,
                isSpinning: false,
                wheelRotation: action.payload.resetPrizes ? 0 : state.wheelRotation,
                wonPrizes: action.payload.resetPrizes ? [] : state.wonPrizes,
                currentScreen: 'game'
            };

        case ActionTypes.RESET_GAME:
            return {
                ...createInitialState(),
                currentLang: state.currentLang,
                wonPrizes: state.wonPrizes
            };

        default:
            return state;
    }
}

// ===== Custom Hook =====
export function useGameState() {
    const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

    // ===== Timer Refs (for cleanup) =====
    const spinTimerRef = useRef(null);
    const matchTimerRef = useRef(null);
    const tileTimerRef = useRef(null);

    // ===== State Ref (avoid stale closure) =====
    const currentLevelRef = useRef(state.currentLevel);

    // Clear all pending timers
    const clearAllTimers = useCallback(() => {
        if (spinTimerRef.current) {
            clearTimeout(spinTimerRef.current);
            spinTimerRef.current = null;
        }
        if (matchTimerRef.current) {
            clearTimeout(matchTimerRef.current);
            matchTimerRef.current = null;
        }
        if (tileTimerRef.current) {
            clearTimeout(tileTimerRef.current);
            tileTimerRef.current = null;
        }
    }, []);

    // Keep currentLevelRef in sync with state
    useEffect(() => {
        currentLevelRef.current = state.currentLevel;
    }, [state.currentLevel]);

    // ===== Helper Functions =====

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
        const { TILE_WIDTH, TILE_HEIGHT, CONTAINER_WIDTH, CONTAINER_HEIGHT } = GAME_CONSTANTS;
        const layers = levelConfig.layers;
        const tilesPerLayer = Math.ceil(newTiles.length / layers);

        newTiles.forEach((tile, index) => {
            const layer = Math.floor(index / tilesPerLayer);
            const indexInLayer = index % tilesPerLayer;

            const cols = levelConfig.gridWidth;
            const rows = levelConfig.gridHeight;

            const col = indexInLayer % cols;
            const row = Math.floor(indexInLayer / cols) % rows;

            const baseX = (CONTAINER_WIDTH - cols * TILE_WIDTH) / 2 + col * TILE_WIDTH;
            const baseY = (CONTAINER_HEIGHT - rows * TILE_HEIGHT) / 2 + row * TILE_HEIGHT;

            const layerOffset = layer * 15;
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;

            tile.x = Math.max(0, Math.min(CONTAINER_WIDTH - TILE_WIDTH, baseX + layerOffset + randomX));
            tile.y = Math.max(0, Math.min(CONTAINER_HEIGHT - TILE_HEIGHT, baseY - layerOffset + randomY));
            tile.layer = layer;
        });

        return newTiles;
    }, []);

    // ===== Actions =====

    // Initialize - load saved data
    const initialize = useCallback(() => {
        // Check daily reset
        const didReset = storage.checkDailyReset();

        // Load language
        const savedLang = storage.getLang();
        dispatch({ type: ActionTypes.SET_LANG, payload: savedLang });

        // Load saved data (if not reset)
        if (!didReset) {
            const savedPrizes = storage.getWonPrizes();
            dispatch({ type: ActionTypes.SET_WON_PRIZES, payload: savedPrizes });

            // Load wheel rotation to maintain visual position
            const savedRotation = storage.getWheelRotation();
            if (savedRotation > 0) {
                dispatch({ type: ActionTypes.SET_WHEEL_ROTATION, payload: savedRotation });
            }
        }
    }, []);

    // Start game
    const startGame = useCallback((options = {}) => {
        const { resetPrizes = false } = options;

        // For new user session (from main menu), clear previous user's cooldown first
        // This ensures each user in LCD touchscreen scenario can start immediately
        if (resetPrizes) {
            storage.clearCooldown();
            storage.setWonPrizes([]);
            storage.setWheelRotation(0);
        }

        // Check cooldown (only applies when continuing within same session, e.g., retry)
        const remaining = storage.checkCooldown();
        if (remaining > 0) {
            dispatch({ type: ActionTypes.SET_COOLDOWN, payload: remaining });
            dispatch({ type: ActionTypes.SET_MODAL, payload: 'cooldown' });
            return;
        }

        const config = LEVEL_CONFIGS[currentLevelRef.current];
        const newTiles = generateTiles(config);
        const checkedTiles = checkBlockedTilesHelper(newTiles);

        dispatch({ type: ActionTypes.START_GAME, payload: { tiles: checkedTiles, resetPrizes } });
        storage.recordPlaySession();
    }, [generateTiles]);

    // Handle tile click
    const handleTileClick = useCallback((tile) => {
        if (state.isGameOver || state.isVictory || tile.blocked || state.exitingTiles.has(tile.id)) {
            return;
        }

        initAudio();
        playWoodKnock(state.soundEnabled);
        hapticTap();

        dispatch({ type: ActionTypes.ADD_EXITING_TILE, payload: tile.id });

        tileTimerRef.current = setTimeout(() => {
            dispatch({
                type: ActionTypes.MOVE_TILE_TO_SLOT,
                payload: { tile }
            });
        }, 300);
    }, [state.isGameOver, state.isVictory, state.soundEnabled, state.exitingTiles]);

    // Check for matches
    const checkMatches = useCallback(() => {
        if (state.isMatching) return;

        const typeCount = {};
        state.slots.forEach(tile => {
            typeCount[tile.type] = (typeCount[tile.type] || 0) + 1;
        });

        const matchedType = Object.keys(typeCount).find(type => typeCount[type] >= GAME_CONSTANTS.MATCH_COUNT);

        if (matchedType) {
            dispatch({ type: ActionTypes.SET_MATCHING, payload: true });

            const tilesToRemove = [];
            state.slots.forEach(tile => {
                if (tile.type === matchedType && tilesToRemove.length < GAME_CONSTANTS.MATCH_COUNT) {
                    tilesToRemove.push(tile.id);
                }
            });

            dispatch({ type: ActionTypes.SET_REMOVING_SLOTS, payload: tilesToRemove });
            playMatchSound(state.soundEnabled);
            hapticMatch();

            matchTimerRef.current = setTimeout(() => {
                dispatch({
                    type: ActionTypes.CLEAR_MATCHED_TILES,
                    payload: { matchedType, matchCount: GAME_CONSTANTS.MATCH_COUNT }
                });
            }, 300);
        }
    }, [state.slots, state.soundEnabled, state.isMatching]);

    // Check win/lose conditions
    const checkGameEnd = useCallback(() => {
        // Skip check during matching animation
        if (state.isMatching) return;

        if (state.slots.length >= GAME_CONSTANTS.SLOT_LIMIT && !state.isGameOver) {
            dispatch({ type: ActionTypes.SET_GAME_OVER, payload: true });
            hapticGameOver();
            dispatch({ type: ActionTypes.SET_MODAL, payload: 'gameover' });
        } else if (state.tiles.length === 0 && state.slots.length === 0 && state.currentScreen === 'game' && !state.isVictory) {
            dispatch({ type: ActionTypes.SET_VICTORY, payload: true });
            playVictorySound(state.soundEnabled);
            hapticVictory();
            dispatch({ type: ActionTypes.SET_MODAL, payload: 'victory' });
        }
    }, [state.slots, state.tiles, state.isGameOver, state.isVictory, state.currentScreen, state.soundEnabled, state.isMatching]);

    // Change language
    const changeLanguage = useCallback((lang) => {
        dispatch({ type: ActionTypes.SET_LANG, payload: lang });
        storage.setLang(lang);
    }, []);

    // Go to home
    const goToHome = useCallback(() => {
        clearAllTimers();
        currentLevelRef.current = 1;  // 同步更新 ref，避免竞态条件
        dispatch({ type: ActionTypes.SET_SCREEN, payload: 'start' });
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
        dispatch({ type: ActionTypes.SET_LEVEL, payload: 1 });
        // 清理游戏状态，防止动画中途返回时残留
        dispatch({ type: ActionTypes.SET_TILES, payload: [] });
        dispatch({ type: ActionTypes.REMOVE_FROM_SLOTS, payload: [] });
    }, [clearAllTimers]);

    // Next level
    const nextLevel = useCallback(() => {
        if (state.currentLevel < MAX_LEVEL) {
            dispatch({ type: ActionTypes.SET_LEVEL, payload: state.currentLevel + 1 });
        }
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
    }, [state.currentLevel]);

    // Retry
    const retry = useCallback(() => {
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
    }, []);

    // Claim current reward
    const claimCurrentReward = useCallback(() => {
        dispatch({ type: ActionTypes.SET_CLAIMED_LEVEL, payload: state.currentLevel });
        dispatch({ type: ActionTypes.SET_MODAL, payload: 'claimReward' });
    }, [state.currentLevel]);

    // Risk for next level
    const riskForNextLevel = useCallback(() => {
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
        nextLevel();
    }, [nextLevel]);

    // Spin wheel
    const spinWheel = useCallback(() => {
        // Prevent spinning if already spinning or if there's an unclaimed prize
        if (state.isSpinning || state.wheelResult) return;

        const availablePrizes = WHEEL_PRIZES.filter(p => !state.wonPrizes.includes(p.id));
        if (availablePrizes.length === 0) return;

        dispatch({ type: ActionTypes.SET_SPINNING, payload: true });
        dispatch({ type: ActionTypes.SET_WHEEL_RESULT, payload: null });

        // Weighted random selection
        const totalWeight = availablePrizes.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedPrize = null;

        for (const prize of availablePrizes) {
            random -= prize.weight;
            if (random <= 0) {
                selectedPrize = prize;
                break;
            }
        }

        // Safety fallback: if no prize selected, use last available prize
        if (!selectedPrize) {
            selectedPrize = availablePrizes[availablePrizes.length - 1];
        }

        // ===== ROTATION CALCULATION =====
        // 
        // Coordinate System:
        //   - CSS rotate(0deg) = 3 o'clock position
        //   - Pointer is FIXED at top = -90° = 270°
        //   - Prize[i] initial center = -90 + i * 45 degrees
        //   - CSS rotate(R) rotates the wheel CLOCKWISE by R degrees
        //   - After rotation, Prize[i] is at: (-90 + i*45 + R) mod 360
        //
        // Goal: Find R such that Prize[i] ends up at pointer position (270°)
        //   (-90 + i*45 + R) ≡ 270 (mod 360)
        //   R ≡ 270 + 90 - i*45 (mod 360)
        //   R ≡ 360 - i*45 (mod 360)
        //   R ≡ (numPrizes - i) * segmentAngle (mod 360)
        //
        const prizeIndex = WHEEL_PRIZES.findIndex(p => p.id === selectedPrize.id);
        const segmentAngle = 360 / WHEEL_PRIZES.length;  // 45°

        // Prize[prizeIndex] initial position in world coordinates
        const prizeInitialAngle = -90 + prizeIndex * segmentAngle;

        // We want prize to end at 270° (top, where pointer is)
        // (prizeInitialAngle + R) % 360 === 270
        // R % 360 = (270 - prizeInitialAngle + 360) % 360
        const pointerAngle = 0;  // Top position = 0° in CSS rotation (12 o'clock)
        let targetRotation = (pointerAngle - prizeInitialAngle) % 360;
        if (targetRotation < 0) targetRotation += 360;  // Normalize to [0, 360)

        // Current wheel position (normalized to 0-360)
        const currentNormalizedAngle = ((state.wheelRotation % 360) + 360) % 360;  // Handle negative values

        // Calculate additional rotation needed (must be positive for clockwise spin)
        let additionalToTarget = targetRotation - currentNormalizedAngle;
        if (additionalToTarget <= 0) {
            additionalToTarget += 360;  // Ensure clockwise spin
        }

        // Add base spins (8 full rotations) for visual effect
        const baseRotation = 360 * GAME_CONSTANTS.BASE_SPINS;
        const finalAngle = state.wheelRotation + baseRotation + additionalToTarget;

        dispatch({ type: ActionTypes.SET_WHEEL_ROTATION, payload: finalAngle });

        spinTimerRef.current = setTimeout(() => {
            dispatch({
                type: ActionTypes.COMPLETE_SPIN,
                payload: { prizeId: selectedPrize.id, finalRotation: finalAngle }
            });
        }, GAME_CONSTANTS.SPIN_RESULT_DELAY_MS);
    }, [state.isSpinning, state.wonPrizes, state.wheelResult, state.wheelRotation]);

    // Dismiss cooldown - returns to home screen with fresh state
    const dismissCooldown = useCallback(() => {
        clearAllTimers();
        currentLevelRef.current = 1;  // 同步更新 ref，避免竞态条件
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
        dispatch({ type: ActionTypes.SET_COOLDOWN, payload: 0 });
        dispatch({ type: ActionTypes.SET_SCREEN, payload: 'start' });
        dispatch({ type: ActionTypes.SET_LEVEL, payload: 1 });
    }, [clearAllTimers]);

    // Toggle sound
    const toggleSound = useCallback(() => {
        dispatch({ type: ActionTypes.TOGGLE_SOUND });
    }, []);

    // Set modal
    const setModal = useCallback((modal) => {
        dispatch({ type: ActionTypes.SET_MODAL, payload: modal });
    }, []);

    // Decrement cooldown
    const decrementCooldown = useCallback(() => {
        dispatch({ type: ActionTypes.SET_COOLDOWN, payload: state.cooldownRemaining - 1 });
    }, [state.cooldownRemaining]);

    // ===== Derived State =====
    const derivedState = useMemo(() => {
        const config = LEVEL_CONFIGS[state.currentLevel];
        const totalTiles = config.types * config.tilesPerType;
        const progress = ((totalTiles - state.tiles.length) / totalTiles) * 100;
        return { config, totalTiles, progress };
    }, [state.currentLevel, state.tiles.length]);

    return {
        state,
        derivedState,
        actions: {
            initialize,
            startGame,
            handleTileClick,
            checkMatches,
            checkGameEnd,
            changeLanguage,
            goToHome,
            nextLevel,
            retry,
            claimCurrentReward,
            riskForNextLevel,
            spinWheel,
            dismissCooldown,
            toggleSound,
            setModal,
            decrementCooldown
        }
    };
}
