import { styles } from '../../config/constants';

export default function CooldownModal({ cooldownRemaining, t, onDismiss }) {
    return (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
            <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
                <div className="text-6xl mb-4 animate-icon-bounce">⏰</div>
                <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('cooldownWarning')}</h2>
                <p className="text-wood-dark/75 mb-6 leading-relaxed">
                    {t('cooldownMessage').replace('{seconds}', cooldownRemaining)}
                </p>
                <div className="text-5xl font-bold text-wood-golden mb-6">
                    {cooldownRemaining}s
                </div>
                <button
                    onClick={onDismiss}
                    className="bg-transparent border-2 border-[rgba(139,90,43,0.15)] rounded-3xl px-6 py-3 text-base font-semibold text-wood-dark/75 cursor-pointer hover:border-wood-dark hover:text-wood-dark transition-all"
                >
                    {t('mainMenu')}
                </button>
            </div>
        </div>
    );
}
