import { Character } from '@/game/types';

export const CHARACTERS: Record<string, Character> = {
  player: {
    id: 'player',
    name: 'RECRUIT',
    title: 'New Operative',
    portrait: 'linear-gradient(135deg, #00ffcc 0%, #0066ff 100%)',
    color: '#00ffcc',
  },
  kael: {
    id: 'kael',
    name: 'DR. KAEL',
    title: 'Senior Data Scientist — Ω Division',
    portrait: 'linear-gradient(135deg, #ff6b35 0%, #ff0066 100%)',
    color: '#ff6b35',
  },
  mira: {
    id: 'mira',
    name: 'MIRA',
    title: 'Systems Engineer — Grid Operations',
    portrait: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    color: '#a855f7',
  },
  system: {
    id: 'system',
    name: 'AXIOM',
    title: 'Central Intelligence System',
    portrait: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    color: '#ef4444',
  },
  unknown: {
    id: 'unknown',
    name: '???',
    title: 'Unknown Signal',
    portrait: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
    color: '#6b7280',
  },
};
