import { styles } from '../../config/constants';

export default function ClaimRewardModal({ claimedRewardLevel, t, onClose }) {
    return (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
            <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
                <div className="text-6xl mb-4 animate-icon-bounce">
                    {claimedRewardLevel === 1 ? '📋' : '☕'}
                </div>
                <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('yourPrize')}</h2>
                <p className="text-wood-dark/75 mb-4 leading-relaxed">{t('showScreen')}</p>
                <div className="my-6">
                    <div className="bg-white text-wood-dark p-6 rounded-xl inline-block shadow-lg">
                        <p className="text-lg font-bold mb-2">
                            {claimedRewardLevel === 1 ? t('consolationPrize') : t('smallPrize')}
                        </p>
                        <p className="text-2xl font-bold tracking-wider text-wood-golden">
                            KODE: {claimedRewardLevel === 1 ? 'WOOD-STICKER' : 'WOOD-COFFEE'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white cursor-pointer transition-all`}
                >
                    {t('close')}
                </button>
            </div>
        </div>
    );
}
