import { QRCodeSVG } from 'qrcode.react';

/**
 * PremiumShareCard - 高级游戏分享卡片组件
 * 
 * 特性:
 * - 圆角卡片设计
 * - 游戏背景图片
 * - 磨砂玻璃效果
 * - 二维码浮雕嵌入效果
 * - 悬停时背景放大动画
 * 
 * @param {string} shareUrl - 分享链接 (用于生成二维码)
 * @param {string} title - 卡片标题
 * @param {string} subtitle - 卡片副标题
 */
export default function PremiumShareCard({
    shareUrl = 'https://wood-match-game.com/play',
    title = 'Wood Match',
    subtitle = '🪵 扫码一起玩'
}) {
    return (
        <div className="premium-share-card">
            {/* 背景图层 - 带悬停放大效果 */}
            <div className="card-background" />

            {/* 磨砂玻璃叠加层 */}
            <div className="glass-overlay" />

            {/* 内容区域 */}
            <div className="card-content">
                {/* 顶部标题 */}
                <div className="card-header">
                    <span className="card-icon">🪵</span>
                    <h2 className="card-title">{title}</h2>
                </div>

                {/* 二维码容器 - 浮雕嵌入效果 */}
                <div className="qr-frame">
                    <div className="qr-inner-shadow" />
                    <div className="qr-container">
                        <QRCodeSVG
                            value={shareUrl}
                            size={140}
                            level="H"
                            includeMargin={true}
                            bgColor="#FFFFFF"
                            fgColor="#4A3728"
                        />
                    </div>
                </div>

                {/* 底部文字 */}
                <p className="card-subtitle">{subtitle}</p>
            </div>

            <style>{`
                .premium-share-card {
                    position: relative;
                    width: 280px;
                    height: 380px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 
                        0 25px 50px -12px rgba(74, 55, 40, 0.35),
                        0 12px 24px -8px rgba(139, 90, 43, 0.25),
                        0 4px 8px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .premium-share-card:hover {
                    transform: translateY(-8px);
                    box-shadow:
                        0 35px 60px -12px rgba(74, 55, 40, 0.4),
                        0 20px 35px -10px rgba(139, 90, 43, 0.3),
                        0 8px 15px rgba(0, 0, 0, 0.15);
                }

                /* 背景图层 */
                .card-background {
                    position: absolute;
                    inset: -20px;
                    background-image: url('/images/background.jpg');
                    background-size: cover;
                    background-position: center;
                    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .premium-share-card:hover .card-background {
                    transform: scale(1.1);
                }

                /* 磨砂玻璃叠加层 */
                .glass-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        145deg,
                        rgba(255, 255, 255, 0.15) 0%,
                        rgba(255, 255, 255, 0.05) 50%,
                        rgba(255, 255, 255, 0.1) 100%
                    );
                    backdrop-filter: blur(2px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                }

                /* 内容区域 */
                .card-content {
                    position: relative;
                    z-index: 10;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    padding: 24px;
                }

                /* 顶部标题 */
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-icon {
                    font-size: 28px;
                    animation: bounce-soft 2s ease-in-out infinite;
                }

                .card-title {
                    font-size: 24px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #4A3728 0%, #6B4423 50%, #A0522D 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 2px 4px rgba(74, 55, 40, 0.1);
                }

                /* 二维码框架 - 浮雕嵌入效果 */
                .qr-frame {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    background: linear-gradient(
                        135deg,
                        rgba(139, 90, 43, 0.2) 0%,
                        rgba(74, 55, 40, 0.15) 100%
                    );
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* 嵌入凹陷效果 */
                    box-shadow:
                        inset 0 4px 12px rgba(74, 55, 40, 0.25),
                        inset 0 2px 4px rgba(74, 55, 40, 0.15),
                        inset 0 -2px 4px rgba(255, 255, 255, 0.3),
                        0 2px 4px rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(139, 90, 43, 0.2);
                }

                /* 内阴影增强嵌入感 */
                .qr-inner-shadow {
                    position: absolute;
                    inset: 8px;
                    border-radius: 14px;
                    box-shadow: inset 0 2px 8px rgba(74, 55, 40, 0.1);
                    pointer-events: none;
                }

                /* 二维码容器 */
                .qr-container {
                    position: relative;
                    z-index: 1;
                    background: #FFFFFF;
                    border-radius: 12px;
                    padding: 8px;
                    box-shadow:
                        0 4px 12px rgba(74, 55, 40, 0.15),
                        0 2px 4px rgba(139, 90, 43, 0.1);
                    border: 1px solid rgba(139, 90, 43, 0.08);
                }

                /* 底部副标题 */
                .card-subtitle {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4A3728;
                    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
                    letter-spacing: 0.5px;
                }

                /* 弹跳动画 */
                @keyframes bounce-soft {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-6px);
                    }
                }
            `}</style>
        </div>
    );
}
