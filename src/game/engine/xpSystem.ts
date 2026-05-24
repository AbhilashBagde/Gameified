import { PlayerProfile } from '@/game/types';

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000, 13000];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

export function getXPForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getProgressPercent(xp: number, level: number): number {
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = getXPForNextLevel(level);
  return Math.round(((xp - current) / (next - current)) * 100);
}

export function applyXP(player: PlayerProfile, amount: number): PlayerProfile {
  const newXP = player.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  return { ...player, xp: newXP, level: newLevel };
}

export const RANK_NAMES: Record<number, string> = {
  1: 'Field Recruit',
  2: 'Data Analyst',
  3: 'Systems Operative',
  4: 'Code Specialist',
  5: 'Pipeline Architect',
  6: 'AI Warden',
  7: 'Omega Agent',
  8: 'Neural Commander',
  9: 'Grid Sovereign',
  10: 'Axiom Prime',
};
