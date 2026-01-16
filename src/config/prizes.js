// Spin wheel prizes configuration - 8 sectors
export const WHEEL_PRIZES = [
    { id: 'furniture', labelKey: 'prizeFurniture', icon: '🪑', weight: 5, color: '#CD853F' },
    { id: 'discount50', labelKey: 'prizeDiscount', icon: '🏷️', weight: 10, color: '#20B2AA' },
    { id: 'gift', labelKey: 'prizeGift', icon: '🎁', weight: 15, color: '#DEB887' },
    { id: 'coupon', labelKey: 'prizeCoupon', icon: '🎟️', weight: 20, color: '#8B5A2B' },
    { id: 'discount30', labelKey: 'prizeDiscount30', icon: '💰', weight: 15, color: '#2D5A27' },
    { id: 'freebie', labelKey: 'prizeFreebie', icon: '☕', weight: 15, color: '#E07B54' },
    { id: 'voucher', labelKey: 'prizeVoucher', icon: '🎫', weight: 10, color: '#1A6B5C' },
    { id: 'mystery', labelKey: 'prizeMystery', icon: '❓', weight: 10, color: '#D4A574' }
];

// Generate conic gradient dynamically
export function generateWheelGradient(prizes) {
    const segmentAngle = 360 / prizes.length;
    const gradientParts = prizes.map((prize, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        return `${prize.color} ${startAngle}deg ${endAngle}deg`;
    });
    return `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;
}
