import { styles } from '../../config/constants';

export default function GameOverModal({ t, onRetry, onGoHome }) {
    return (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
            <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
                <div className="text-6xl mb-4 animate-icon-bounce">😔</div>
                <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('gameOver')}</h2>
                <p className="text-wood-dark/75 mb-6 leading-relaxed">{t('gameOverMessage')}</p>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onRetry}
                        className={`${styles.btnPrimary} rounded-3xl px-6 py-4 text-lg font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all`}
                    >
                        <span>{t('tryAgain')}</span>
                        <span>🔄</span>
                    </button>
                    <button
                        onClick={onGoHome}
                        className="bg-transparent border-2 border-[rgba(139,90,43,0.15)] rounded-3xl px-4 py-2 text-base font-semibold text-wood-dark/75 cursor-pointer hover:border-wood-dark hover:text-wood-dark transition-all"
                    >
                        {t('mainMenu')}
                    </button>
                </div>
            </div>
        </div>
    );
}
