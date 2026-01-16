import { styles } from '../../config/constants';
import { MAX_LEVEL } from '../../config/levels';
import { WHEEL_PRIZES } from '../../config/prizes';
import SpinWheel from '../SpinWheel';

export default function VictoryModal({
    currentLevel,
    isSpinning,
    wheelRotation,
    wheelResult,
    wonPrizes,
    t,
    onClaimReward,
    onRiskNextLevel,
    onSpinWheel,
    onClaimPrize,
    onGoHome
}) {
    return (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
            <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full relative overflow-hidden animate-modal-slide-in`}>
                {/* Confetti */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`${styles.confettiColors[i]} absolute w-2.5 h-2.5 animate-confetti-fall`}
                            style={{ left: `${(i + 1) * 20 - 10}%`, animationDelay: `${i * 0.5}s` }}
                        />
                    ))}
                </div>
                <div className="text-6xl mb-4 animate-icon-bounce">🎉</div>
                <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>
                    {t('levelCleared').replace('{level}', currentLevel)}
                </h2>

                {/* Level 1 & 2: Take Reward or Risk It */}
                {currentLevel < MAX_LEVEL && (
                    <>
                        <p className="text-wood-dark/75 mb-4 leading-relaxed">
                            {t('giveUpReward')}
                        </p>

                        {/* Current Level Reward Display */}
                        <div className={`${styles.glass} rounded-xl p-4 mb-4`}>
                            <div className="text-3xl mb-2">
                                {currentLevel === 1 ? '📋' : '☕'}
                            </div>
                            <p className="font-bold text-wood-dark">
                                {currentLevel === 1 ? t('consolationPrize') : t('smallPrize')}
                            </p>
                            <p className="text-sm text-wood-dark/60">
                                {currentLevel === 1 ? t('consolationDesc') : t('smallPrizeDesc')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Take Reward Button */}
                            <button
                                onClick={onClaimReward}
                                className="bg-gradient-to-br from-accent-teal to-accent-green rounded-3xl px-6 py-3 text-base font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                            >
                                <span>{t('takeReward')}</span>
                                <span>🎁</span>
                            </button>

                            {/* Risk It Button */}
                            <button
                                onClick={onRiskNextLevel}
                                className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all`}
                            >
                                <span>{t('riskIt')}</span>
                                <span>🎲</span>
                            </button>

                            <p className="text-xs text-wood-dark/50 mt-2">
                                {t('orContinue')}
                            </p>
                        </div>
                    </>
                )}

                {/* Level 3: Spin Wheel */}
                {currentLevel >= MAX_LEVEL && (
                    <>
                        <p className="text-wood-dark/75 mb-2 leading-relaxed">
                            {t('spinWheelDesc')}
                        </p>

                        <SpinWheel
                            rotation={wheelRotation}
                            isSpinning={isSpinning}
                            wonPrizes={wonPrizes}
                            onSpin={onSpinWheel}
                            t={t}
                        />

                        {/* Spin Result or Button */}
                        {wheelResult ? (
                            <div className="animate-fade-in-up">
                                <h3 className={`text-2xl font-bold ${styles.textGradient} mb-2`}>
                                    {t('youWon')}
                                </h3>
                                <div className={`${styles.glass} rounded-xl p-4 mb-4`}>
                                    <p className="text-3xl mb-2">
                                        {WHEEL_PRIZES.find(p => p.id === wheelResult)?.icon}
                                    </p>
                                    <p className="text-xl font-bold text-wood-dark">
                                        {t(WHEEL_PRIZES.find(p => p.id === wheelResult)?.labelKey || 'prizeGift')}
                                    </p>
                                </div>
                                <button
                                    onClick={onClaimPrize}
                                    className="bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all"
                                >
                                    {t('claimPrize')} 🎁
                                </button>
                            </div>
                        ) : wonPrizes.length >= WHEEL_PRIZES.length ? (
                            /* All prizes won */
                            <div className="animate-fade-in-up">
                                <p className="text-wood-dark/75 mb-4">{t('allPrizesWon')}</p>
                                <button
                                    onClick={onGoHome}
                                    className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all`}
                                >
                                    {t('mainMenu')}
                                </button>
                            </div>
                        ) : (
                            /* Red CTA Spin Button */
                            <button
                                onClick={onSpinWheel}
                                disabled={isSpinning}
                                className="bg-gradient-to-br from-red-500 to-red-700 shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 active:translate-y-0 rounded-3xl px-10 py-5 text-xl font-bold text-white cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isSpinning ? t('spinning') : t('spinNow')}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
