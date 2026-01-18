import { useEffect, useCallback, useRef } from 'react';

// Config
import { TRANSLATIONS } from '../config/translations';

// Hooks
import { useGameState } from '../hooks/useGameState';

// Components
import StartScreen from './StartScreen';
import GameBoard from './GameBoard';
import VictoryModal from './modals/VictoryModal';
import GameOverModal from './modals/GameOverModal';
import CooldownModal from './modals/CooldownModal';
import ClaimRewardModal from './modals/ClaimRewardModal';
import ClaimModal from './modals/ClaimModal';
import ShareModal from './modals/ShareModal';

// ===== Main Game Component =====
export default function Game() {
  const { state, derivedState, actions } = useGameState();

  // Translation helper
  const t = useCallback(
    (key) => TRANSLATIONS[state.currentLang][key] || key,
    [state.currentLang]
  );

  // Get furniture name
  const getFurnitureName = useCallback(
    (id) => TRANSLATIONS[state.currentLang][id] || id,
    [state.currentLang]
  );

  // Initialize on mount
  useEffect(() => {
    actions.initialize();
  }, [actions.initialize]);

  // Check for matches when slots change
  useEffect(() => {
    if (state.isMatching) return;
    actions.checkMatches();
  }, [state.slots, state.isMatching, actions.checkMatches]);

  // Check game end conditions
  useEffect(() => {
    if (state.isMatching) return;
    actions.checkGameEnd();
  }, [state.slots, state.tiles, state.isMatching, actions.checkGameEnd]);

  // Cooldown timer effect
  useEffect(() => {
    if (state.activeModal === 'cooldown' && state.cooldownRemaining > 0) {
      const timer = setInterval(() => {
        if (state.cooldownRemaining <= 1) {
          clearInterval(timer);
          actions.setModal(null);
        } else {
          actions.decrementCooldown();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.activeModal, state.cooldownRemaining, actions]);

  // Track previous level for detecting level changes
  const prevLevelRef = useRef(state.currentLevel);

  // Handle next level (just update level, useEffect will start game)
  const handleNextLevel = useCallback(() => {
    actions.nextLevel();
  }, [actions]);

  // Watch for level changes and auto-start game
  useEffect(() => {
    if (state.currentLevel > prevLevelRef.current && state.activeModal === null) {
      prevLevelRef.current = state.currentLevel;
      actions.startGame();
    }
  }, [state.currentLevel, state.activeModal, actions]);

  // Handle retry
  const handleRetry = useCallback(() => {
    actions.retry();
    actions.startGame();
  }, [actions]);

  // Handle claim prize (open claim modal)
  const handleClaimPrize = useCallback(() => {
    actions.setModal('claim');
  }, [actions]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Start Screen */}
      {state.currentScreen === 'start' && (
        <StartScreen
          currentLang={state.currentLang}
          t={t}
          onLanguageChange={actions.changeLanguage}
          onStartGame={actions.startGame}
          onShare={() => actions.setModal('share')}
        />
      )}

      {/* Game Screen */}
      {state.currentScreen === 'game' && (
        <GameBoard
          tiles={state.tiles}
          slots={state.slots}
          config={derivedState.config}
          progress={derivedState.progress}
          soundEnabled={state.soundEnabled}
          exitingTiles={state.exitingTiles}
          removingSlots={state.removingSlots}
          t={t}
          getFurnitureName={getFurnitureName}
          onTileClick={actions.handleTileClick}
          onGoHome={actions.goToHome}
          onToggleSound={actions.toggleSound}
        />
      )}

      {/* Victory Modal */}
      {state.activeModal === 'victory' && (
        <VictoryModal
          currentLevel={state.currentLevel}
          isSpinning={state.isSpinning}
          wheelRotation={state.wheelRotation}
          wheelResult={state.wheelResult}
          wonPrizes={state.wonPrizes}
          t={t}
          onClaimReward={actions.claimCurrentReward}
          onRiskNextLevel={handleNextLevel}
          onSpinWheel={actions.spinWheel}
          onClaimPrize={handleClaimPrize}
          onGoHome={actions.goToHome}
        />
      )}

      {/* Game Over Modal */}
      {state.activeModal === 'gameover' && (
        <GameOverModal
          t={t}
          onRetry={handleRetry}
          onGoHome={actions.goToHome}
        />
      )}

      {/* Cooldown Modal */}
      {state.activeModal === 'cooldown' && (
        <CooldownModal
          cooldownRemaining={state.cooldownRemaining}
          t={t}
          onDismiss={actions.goToHome}
        />
      )}

      {/* Claim Reward Modal (Level 1 & 2) */}
      {state.activeModal === 'claimReward' && (
        <ClaimRewardModal
          claimedRewardLevel={state.claimedRewardLevel}
          t={t}
          onClose={actions.goToHome}
        />
      )}

      {/* Claim Modal (Spin Wheel Prize) */}
      {state.activeModal === 'claim' && (
        <ClaimModal
          wheelResult={state.wheelResult}
          t={t}
          onClose={actions.goToHome}
        />
      )}

      {/* Share Modal */}
      {state.activeModal === 'share' && (
        <ShareModal
          t={t}
          shareUrl={typeof window !== 'undefined' ? window.location.origin : 'https://wood-match-game.com'}
          onClose={() => actions.setModal(null)}
        />
      )}
    </div>
  );
}

