import { GAME_CONSTANTS } from '../config/constants';

// ===== Storage Keys =====
const STORAGE_KEYS = {
    LANG: 'woodmatch_lang',
    WON_PRIZES: 'woodmatch_wonPrizes',
    LAST_PLAYED: 'woodmatch_lastPlayed',
    PRIZE_DATE: 'woodmatch_prizeDate',
    HAS_PLAYED: 'woodmatch_hasPlayed',
    GIFT_CODES: 'woodmatch_giftCodes',
    WHEEL_ROTATION: 'woodmatch_wheelRotation'
};


// ===== Unified Storage Layer =====
export const storage = {
    // Language
    getLang: () => {
        try {
            const lang = localStorage.getItem(STORAGE_KEYS.LANG);
            return (lang === 'id' || lang === 'zh') ? lang : 'id';
        } catch {
            return 'id';
        }
    },
    setLang: (lang) => {
        try {
            localStorage.setItem(STORAGE_KEYS.LANG, lang);
        } catch {
            // silently fail in privacy mode
        }
    },

    // Won Prizes
    getWonPrizes: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.WON_PRIZES);
            if (saved) {
                const parsed = JSON.parse(saved);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {
            localStorage.removeItem(STORAGE_KEYS.WON_PRIZES);
        }
        return [];
    },
    setWonPrizes: (prizes) => {
        localStorage.setItem(STORAGE_KEYS.WON_PRIZES, JSON.stringify(prizes));
    },

    // Wheel Rotation (normalized to 0-360)
    getWheelRotation: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.WHEEL_ROTATION);
            if (saved) {
                const rotation = parseFloat(saved);
                return isNaN(rotation) ? 0 : rotation;
            }
        } catch {
            // silently fail
        }
        return 0;
    },
    setWheelRotation: (rotation) => {
        try {
            // Store normalized angle (0-360) to avoid very large numbers
            // Note: JavaScript % can return negative values, so we ensure positive
            const normalized = ((rotation % 360) + 360) % 360;
            localStorage.setItem(STORAGE_KEYS.WHEEL_ROTATION, normalized.toString());
        } catch {
            // silently fail in privacy mode
        }
    },

    // Cooldown
    checkCooldown: () => {
        const lastPlayed = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
        if (lastPlayed) {
            const elapsed = Date.now() - parseInt(lastPlayed);
            if (elapsed < GAME_CONSTANTS.COOLDOWN_MS) {
                return Math.ceil((GAME_CONSTANTS.COOLDOWN_MS - elapsed) / 1000);
            }
        }
        return 0;
    },

    // Record play session
    recordPlaySession: () => {
        localStorage.setItem(STORAGE_KEYS.HAS_PLAYED, 'true');
        localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, Date.now().toString());
    },

    // Clear cooldown (for new user session in LCD touchscreen scenario)
    clearCooldown: () => {
        try {
            localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED);
        } catch {
            // silently fail in privacy mode
        }
    },

    // Daily reset check - returns true if reset occurred
    checkDailyReset: () => {
        const today = new Date().toISOString().split('T')[0];
        const savedDate = localStorage.getItem(STORAGE_KEYS.PRIZE_DATE);

        if (savedDate !== today) {
            localStorage.setItem(STORAGE_KEYS.PRIZE_DATE, today);
            localStorage.removeItem(STORAGE_KEYS.WON_PRIZES);
            localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED);
            localStorage.removeItem(STORAGE_KEYS.HAS_PLAYED);
            localStorage.removeItem(STORAGE_KEYS.GIFT_CODES);
            localStorage.removeItem(STORAGE_KEYS.WHEEL_ROTATION);
            return true;
        }
        return false;
    },

    // Gift Codes
    getGiftCodes: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.GIFT_CODES);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    },

    saveGiftCode: (prizeId, code, expiry) => {
        const codes = storage.getGiftCodes();
        codes[prizeId] = { code, expiry, createdAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.GIFT_CODES, JSON.stringify(codes));
    },

    getGiftCode: (prizeId) => {
        const codes = storage.getGiftCodes();
        return codes[prizeId] || null;
    }
};
