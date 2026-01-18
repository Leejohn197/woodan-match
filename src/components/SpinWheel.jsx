import { useRef, useCallback } from 'react';
import { WHEEL_PRIZES, generateWheelGradient } from '../config/prizes';

export default function SpinWheel({
    rotation,
    isSpinning,
    wonPrizes,
    onSpin,
    t
}) {
    const isAllWon = wonPrizes.length >= WHEEL_PRIZES.length;

    // Ref for immediate click protection (prevents race condition)
    const isClickingRef = useRef(false);

    const handleSpin = useCallback(() => {
        if (isClickingRef.current || isSpinning || isAllWon) return;
        isClickingRef.current = true;
        onSpin();
        // Reset after short delay to allow next valid spin
        setTimeout(() => { isClickingRef.current = false; }, 100);
    }, [onSpin, isSpinning, isAllWon]);

    return (
        <div className="relative w-72 h-72 mx-auto mb-6">
            {/* Fixed Pointer at Top (Indicator Arrow) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50">
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-red-600 drop-shadow-[0_4px_12px_rgba(220,38,38,0.6)]"></div>
                <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-6 h-2.5 bg-red-700 rounded-t-sm"></div>
            </div>

            {/* Outer Decorative Ring with Lights (Fixed) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-wood-golden via-wood-warm to-wood-dark shadow-[0_12px_40px_rgba(74,55,40,0.5)] p-2">
                {/* Small decorative lights around the rim */}
                {[...Array(24)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full ${isSpinning ? 'animate-pulse' : ''}`}
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `rotate(${i * 15}deg) translateY(-140px) translateX(-50%)`,
                            backgroundColor: i % 2 === 0 ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)'
                        }}
                    />
                ))}

                {/* Main Wheel Container - This rotates */}
                <div
                    className="wheel-container absolute inset-2 rounded-full overflow-hidden shadow-inner"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        WebkitTransform: `rotate(${rotation}deg)`,
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        pointerEvents: 'none',
                        transition: isSpinning
                            ? 'transform 6s cubic-bezier(0.2, 0.8, 0.3, 1)'
                            : 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        WebkitTransition: isSpinning
                            ? '-webkit-transform 6s cubic-bezier(0.2, 0.8, 0.3, 1)'
                            : '-webkit-transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: generateWheelGradient(WHEEL_PRIZES)
                    }}
                >
                    {/* Sector Divider Lines - aligned with conic-gradient sectors */}
                    {[...Array(8)].map((_, i) => {
                        const segmentAngle = 360 / WHEEL_PRIZES.length;
                        // Divider lines should be at segment boundaries (edges), not centers
                        // Since the gradient starts at -90 - segmentAngle/2, dividers are at i * segmentAngle
                        const lineAngle = i * segmentAngle;
                        return (
                            <div
                                key={`line-${i}`}
                                className="absolute w-0.5 bg-white/40 origin-bottom"
                                style={{
                                    height: '50%',
                                    left: '50%',
                                    top: '0',
                                    transform: `translateX(-50%) rotate(${lineAngle}deg)`,
                                    transformOrigin: '50% 100%'
                                }}
                            />
                        );
                    })}

                    {/* Prize Items - "Cake Slice" Layout Pattern */}
                    {WHEEL_PRIZES.map((prize, idx) => {
                        const isWon = wonPrizes.includes(prize.id);
                        const segmentAngle = 360 / WHEEL_PRIZES.length;
                        const centerAngle = idx * segmentAngle + segmentAngle / 2;

                        return (
                            <div
                                key={prize.id}
                                className="absolute flex flex-col items-center justify-start gap-1 pt-2"
                                style={{
                                    height: '136px',  // Wheel radius (144px - 8px padding)
                                    width: '60px',
                                    left: '50%',
                                    bottom: '50%',
                                    transformOrigin: 'bottom center',
                                    transform: `translateX(-50%) rotate(${centerAngle}deg)`
                                }}
                            >
                                {/* Prize Label (at top/outer edge - most space) */}
                                <span
                                    className={`text-[9px] font-bold text-center leading-tight drop-shadow-sm ${isWon ? 'text-white/50 line-through' : 'text-white'
                                        }`}
                                >
                                    {t(prize.labelKey)}
                                </span>
                                {/* Prize Icon (below label) */}
                                <span className={`text-2xl drop-shadow-md ${isWon ? 'grayscale opacity-50' : ''}`}>
                                    {prize.icon}
                                </span>
                                {isWon && (
                                    <span className="text-[11px] text-white font-bold drop-shadow-md">✓</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Center Hub - Fixed, does NOT rotate */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-30">
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || isAllWon}
                    className="w-full h-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full shadow-[0_8px_32px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center border-4 border-white cursor-pointer transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(220,38,38,0.6)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                    <span className="text-white font-extrabold text-xs drop-shadow-md leading-tight text-center">
                        {isSpinning ? '🎰' : t('spinNow').replace('!', '').replace('！', '')}
                    </span>
                </button>
            </div>
        </div>
    );
}
