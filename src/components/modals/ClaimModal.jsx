import { styles } from '../../config/constants';
import { WHEEL_PRIZES } from '../../config/prizes';
import { useGiftCode } from '../../hooks/useGiftCode';

export default function ClaimModal({ wheelResult, t, onClose }) {
    const { code, expiry } = useGiftCode(wheelResult);
    const prizeConfig = WHEEL_PRIZES.find(p => p.id === wheelResult);

    return (
        <div className="fixed inset-0 bg-wood-dark/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]">
            <div className={`${styles.modal} rounded-3xl p-8 text-center max-w-[360px] w-full animate-modal-slide-in`}>
                <div className="text-6xl mb-4 animate-icon-bounce">🏆</div>
                <h2 className={`text-3xl mb-2 ${styles.textGradient} font-bold`}>{t('yourPrize')}</h2>
                <p className="text-wood-dark/75 mb-6 leading-relaxed">{t('showScreen')}</p>
                <div className="my-6">
                    <div className="bg-white text-wood-dark p-6 rounded-xl inline-block shadow-lg">
                        <span className="text-5xl block mb-2">{prizeConfig?.icon || '🎁'}</span>
                        <p className="text-lg font-bold mb-1">
                            {prizeConfig ? t(prizeConfig.labelKey) : t('grandPrize')}
                        </p>
                        <p className="text-2xl font-bold tracking-wider text-wood-golden">
                            KODE: {code}
                        </p>
                        <p className="text-xs text-wood-dark/50 mt-2">
                            {t('validUntil')}: {new Date(expiry).toLocaleString()}
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
