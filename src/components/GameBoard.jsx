import { styles, GAME_CONSTANTS } from '../config/constants';

export default function GameBoard({
    tiles,
    slots,
    config,
    progress,
    soundEnabled,
    exitingTiles,
    removingSlots,
    t,
    getFurnitureName,
    onTileClick,
    onGoHome,
    onToggleSound
}) {
    return (
        <div className="flex flex-col w-full max-w-md h-screen max-h-[900px] p-2">
            {/* Header */}
            <header className={`${styles.glass} rounded-2xl p-3 flex justify-between items-center mb-4`}>
                <button
                    onClick={onGoHome}
                    className="w-11 h-11 rounded-xl bg-wood-light/10 flex items-center justify-center text-xl cursor-pointer hover:bg-wood-light/20 transition-all"
                >
                    ←
                </button>
                <div className="text-center">
                    <span className="block text-lg font-bold text-wood-dark">{t(config.nameKey)}</span>
                    <span className="block text-xs text-wood-dark/75">{t(config.themeKey)}</span>
                </div>
                <button
                    onClick={onToggleSound}
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
                            onClick={() => !tile.blocked && onTileClick(tile)}
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
    );
}
