// ===== Gift Code Generator =====

// Prize type prefixes for unique identification
const PRIZE_PREFIXES = {
    furniture: 'FUR',
    discount50: 'D50',
    gift: 'GFT',
    coupon: 'CPN',
    discount30: 'D30',
    freebie: 'FRE',
    voucher: 'VOU',
    mystery: 'MYS',
    sticker: 'STK',   // Level 1 reward
    coffee: 'COF'     // Level 2 reward
};

/**
 * Generate a unique gift code for a prize
 * Format: PREFIX-TIMESTAMP-RANDOM (e.g., VOU-L9KXD3S-A7BC)
 */
export function generateGiftCode(prizeId) {
    const prefix = PRIZE_PREFIXES[prizeId] || 'WOD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

/**
 * Validate gift code format
 */
export function isValidGiftCode(code) {
    return /^[A-Z0-9]{3}-[A-Z0-9]+-[A-Z0-9]{4}$/.test(code);
}

/**
 * Get expiry timestamp (24 hours from now)
 */
export function getCodeExpiry() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry.toISOString();
}
