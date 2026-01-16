import { useReducer, useCallback, useEffect, useMemo } from 'react';
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
            const overlapX = Math.abs(tile.x - otherTile.x) < 40;
            const overlapY = Math.abs(tile.y - otherTile.y) < 50;
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
            const { prizeId } = action.payload;
            return {
                ...state,
                isSpinning: false,
                wheelResult: prizeId,
                wonPrizes: [...state.wonPrizes, prizeId]
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

    // ===== Actions =====

    // Initialize - load saved data
    const initialize = useCallback(() => {
        // Check daily reset
        const didReset = storage.checkDailyReset();

        // Load language
        const savedLang = storage.getLang();
        dispatch({ type: ActionTypes.SET_LANG, payload: savedLang });

        // Load won prizes (if not reset)
        if (!didReset) {
            const savedPrizes = storage.getWonPrizes();
            dispatch({ type: ActionTypes.SET_WON_PRIZES, payload: savedPrizes });
        }
    }, []);

    // Start game
    const startGame = useCallback(() => {
        // Check cooldown
        const remaining = storage.checkCooldown();
        if (remaining > 0) {
            dispatch({ type: ActionTypes.SET_COOLDOWN, payload: remaining });
            dispatch({ type: ActionTypes.SET_MODAL, payload: 'cooldown' });
            return;
        }

        const config = LEVEL_CONFIGS[state.currentLevel];
        const newTiles = generateTiles(config);
        const checkedTiles = checkBlockedTiles(newTiles);

        dispatch({ type: ActionTypes.START_GAME, payload: { tiles: checkedTiles } });
        storage.recordPlaySession();
    }, [state.currentLevel, generateTiles, checkBlockedTiles]);

    // Handle tile click
    const handleTileClick = useCallback((tile) => {
        if (state.isGameOver || state.isVictory || tile.blocked || state.exitingTiles.has(tile.id)) {
            return;
        }

        initAudio();
        playWoodKnock(state.soundEnabled);
        hapticTap();

        dispatch({ type: ActionTypes.ADD_EXITING_TILE, payload: tile.id });

        setTimeout(() => {
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

            setTimeout(() => {
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
        dispatch({ type: ActionTypes.SET_SCREEN, payload: 'start' });
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
        dispatch({ type: ActionTypes.SET_LEVEL, payload: 1 });
    }, []);

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
        if (state.isSpinning) return;

        const availablePrizes = WHEEL_PRIZES.filter(p => !state.wonPrizes.includes(p.id));
        if (availablePrizes.length === 0) return;

        dispatch({ type: ActionTypes.SET_SPINNING, payload: true });
        dispatch({ type: ActionTypes.SET_WHEEL_RESULT, payload: null });

        // Weighted random selection
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

        // Calculate rotation
        // Pointer is at 12 o'clock (top), conic-gradient starts from 3 o'clock (0deg)
        // To land on a prize, we need to rotate the wheel so the prize center aligns with the pointer
        // Formula: 360 * spins + (360 - prizeCenter - 90) where 90 is offset from 3 o'clock to 12 o'clock
        const prizeIndex = WHEEL_PRIZES.findIndex(p => p.id === selectedPrize.id);
        const segmentAngle = 360 / WHEEL_PRIZES.length;
        const prizeCenter = prizeIndex * segmentAngle + segmentAngle / 2;
        // Adjust for pointer at top: target angle is where we want the prize to end up (at top/12 o'clock)
        const targetAngle = 360 - prizeCenter + 90;
        const finalAngle = 360 * GAME_CONSTANTS.BASE_SPINS + targetAngle;

        dispatch({ type: ActionTypes.SET_WHEEL_ROTATION, payload: finalAngle });

        setTimeout(() => {
            dispatch({
                type: ActionTypes.COMPLETE_SPIN,
                payload: { prizeId: selectedPrize.id }
            });
            storage.setWonPrizes([...state.wonPrizes, selectedPrize.id]);
        }, GAME_CONSTANTS.SPIN_RESULT_DELAY_MS);
    }, [state.isSpinning, state.wonPrizes]);

    // Dismiss cooldown
    const dismissCooldown = useCallback(() => {
        dispatch({ type: ActionTypes.SET_MODAL, payload: null });
        dispatch({ type: ActionTypes.SET_COOLDOWN, payload: 0 });
    }, []);

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
