// ===== Game Constants =====
export const GAME_CONSTANTS = {
  TILE_WIDTH: 60,
  TILE_HEIGHT: 70,
  CONTAINER_WIDTH: 320,
  CONTAINER_HEIGHT: 400,
  SLOT_LIMIT: 7,
  MATCH_COUNT: 3,
  COOLDOWN_MS: 10000, // 10 seconds
  SPIN_DURATION_MS: 6000,
  SPIN_RESULT_DELAY_MS: 6500,
  BASE_SPINS: 8, // Full rotations for spin wheel
  TILE_OVERLAP_THRESHOLD_X: 40,
  TILE_OVERLAP_THRESHOLD_Y: 50
};

// ===== Tailwind Style Constants =====
export const styles = {
  // Glass morphism effect
  glass: 'bg-white/65 backdrop-blur-[10px] border border-[rgba(139,90,43,0.15)]',

  // Tile styles
  tile: `
    bg-gradient-to-br from-tile-cream via-tile-beige to-tile-sand
    rounded-xl select-none
    shadow-[0_6px_16px_rgba(139,90,43,0.20),0_2px_6px_rgba(107,68,35,0.12),0_1px_2px_rgba(74,55,40,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
    border border-[rgba(139,90,43,0.12)]
  `,
  tileBlocked: 'brightness-[0.7] cursor-not-allowed',
  tileHover: 'hover:-translate-y-1.5 hover:scale-105 hover:shadow-[0_12px_28px_rgba(139,90,43,0.25),0_6px_12px_rgba(107,68,35,0.15)] hover:z-[1000]',

  // Button styles
  btnPrimary: `
    bg-gradient-to-br from-wood-golden to-wood-warm
    shadow-[0_8px_32px_rgba(205,133,63,0.4)]
    hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(205,133,63,0.5)]
    active:translate-y-0 active:scale-[0.98]
  `,

  // Slot styles
  slot: 'bg-[rgba(139,90,43,0.08)] border-2 border-dashed border-[rgba(139,90,43,0.25)]',
  slotFilled: 'border-solid border-wood-golden bg-[rgba(205,133,63,0.15)]',

  // Modal styles
  modal: 'bg-gradient-to-br from-tile-cream to-tile-beige shadow-[0_20px_60px_rgba(74,55,40,0.35)]',

  // Text gradient
  textGradient: 'bg-gradient-to-br from-wood-dark via-wood-medium to-wood-warm bg-clip-text text-transparent',

  // Progress bar
  progressFill: 'bg-gradient-to-r from-accent-teal to-accent-green',

  // Confetti colors
  confettiColors: ['bg-wood-golden', 'bg-accent-coral', 'bg-accent-green', 'bg-accent-teal', 'bg-wood-cream']
};
