import { useMemo } from 'react';
import { storage } from '../utils/storage';
import { generateGiftCode, getCodeExpiry } from '../utils/giftCode';

/**
 * Hook to get or generate a gift code for a prize
 * Returns existing unexpired code or generates a new one
 */
export function useGiftCode(prizeId) {
    return useMemo(() => {
        if (!prizeId) return { code: '', expiry: '' };

        // Check for existing unexpired code
        const existing = storage.getGiftCode(prizeId);
        if (existing && new Date(existing.expiry) > new Date()) {
            return { code: existing.code, expiry: existing.expiry };
        }

        // Generate new code
        const code = generateGiftCode(prizeId);
        const expiry = getCodeExpiry();
        storage.saveGiftCode(prizeId, code, expiry);

        return { code, expiry };
    }, [prizeId]);
}
