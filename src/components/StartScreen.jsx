import { styles } from '../config/constants';

export default function StartScreen({ currentLang, t, onLanguageChange, onStartGame, onShare }) {
    return (
        <div className="flex flex-col items-center justify-center gap-8 text-center w-full max-w-md p-4 relative">
            {/* Language Toggle */}
            <div className="absolute top-4 right-4 flex gap-1 z-50">
                {['id', 'zh', 'en'].map(lang => (
                    <button
                        key={lang}
                        onClick={() => onLanguageChange(lang)}
                        className={`${styles.glass} rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${currentLang === lang
                            ? 'bg-accent-gold/20 border-accent-gold text-wood-dark'
                            : 'text-wood-dark/75 hover:text-wood-dark'
                            }`}
                    >
                        {lang === 'id' ? '🇮🇩 ID' : lang === 'zh' ? '🇨🇳 中文' : '🇬🇧 EN'}
                    </button>
                ))}
            </div>

            {/* Logo */}
            <div className="animate-fade-in-up">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-5xl animate-bounce-soft">🪵</span>
                    <h1 className={`text-4xl font-extrabold ${styles.textGradient}`}>Wood Match</h1>
                </div>
                <p className="text-sm text-wood-dark/75 uppercase tracking-wider">{t('tagline')}</p>
            </div>

            {/* Level Journey */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-full p-2 animate-[fade-in-up_0.8s_ease-out_0.2s_backwards]">
                {[1, 2, 3].map((level, idx) => (
                    <div key={level} className="flex items-center gap-2">
                        <div className={`${styles.glass} rounded-xl p-3 text-center flex flex-col items-center gap-0.5 min-w-[70px] transition-all ${level === 1 ? 'border-accent-gold bg-accent-gold/15' : ''
                            }`}>
                            <div className="text-2xl">{level === 1 ? '🛋️' : level === 2 ? '⛱️' : '🛏️'}</div>
                            <span className="text-xs font-bold text-wood-dark">{t(`level${level}Name`)}</span>
                            <span className="text-[8px] text-wood-dark/75 whitespace-nowrap">{t(`level${level}Desc`)}</span>
                        </div>
                        {idx < 2 && <span className="text-wood-dark/50">→</span>}
                    </div>
                ))}
                <span className="text-wood-dark/50">→</span>
                <div className={`${styles.glass} rounded-xl p-3 text-center flex flex-col items-center gap-0.5 min-w-[70px] bg-gradient-to-br from-accent-gold/20 to-accent-coral/20 border-accent-coral`}>
                    <div className="text-2xl">🏆</div>
                    <span className="text-xs font-bold text-wood-dark">{t('grandPrize')}</span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 animate-[fade-in-up_0.8s_ease-out_0.4s_backwards]">
                {/* Start Button */}
                <button
                    onClick={onStartGame}
                    className={`${styles.btnPrimary} rounded-3xl px-8 py-4 text-xl font-bold text-white flex items-center justify-center gap-2 min-w-[200px] cursor-pointer transition-all`}
                >
                    <span>{t('startGame')}</span>
                    <span className="text-lg">▶</span>
                </button>

                {/* Share Button */}
                <button
                    onClick={onShare}
                    className={`${styles.glass} rounded-3xl px-8 py-3 text-base font-semibold text-wood-dark flex items-center justify-center gap-2 min-w-[200px] cursor-pointer transition-all hover:bg-accent-gold/10 hover:border-accent-gold`}
                >
                    <span>📲</span>
                    <span>{t('share')}</span>
                </button>
            </div>
        </div>
    );
}

