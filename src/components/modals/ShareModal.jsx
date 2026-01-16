import { styles } from '../../config/constants';
import PremiumShareCard from '../PremiumShareCard';

/**
 * ShareModal - 分享弹窗
 * 
 * 展示 PremiumShareCard，用户可以截图分享给朋友
 * 
 * @param {function} onClose - 关闭弹窗回调
 * @param {function} t - 翻译函数
 * @param {string} shareUrl - 分享链接
 */
export default function ShareModal({ onClose, t, shareUrl }) {
    return (
        <div
            className="fixed inset-0 bg-wood-dark/70 backdrop-blur-sm z-[2000] flex justify-center items-center p-4 animate-[fade-in_0.3s_ease-out]"
            onClick={onClose}
        >
            <div
                className="relative animate-modal-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 关闭按钮 */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-wood-dark hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    ✕
                </button>

                {/* 分享卡片 */}
                <PremiumShareCard
                    shareUrl={shareUrl}
                    title="Wood Match"
                    subtitle={t?.('scanToPlay') || '🪵 扫码一起玩'}
                />

                {/* 底部提示 */}
                <div className="mt-4 text-center">
                    <p className="text-white/90 text-sm font-medium mb-2">
                        📸 {t?.('screenshotToShare') || '截图分享给好友'}
                    </p>
                    <p className="text-white/60 text-xs">
                        {t?.('inviteFriends') || '邀请好友一起来玩'}
                    </p>
                </div>
            </div>
        </div>
    );
}
