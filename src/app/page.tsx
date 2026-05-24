'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { HomeScreen } from '@/components/game/HomeScreen';
import { LoginScreen } from '@/components/game/LoginScreen';
import { HubScreen } from '@/components/game/HubScreen';
import { MissionScreen } from '@/components/game/MissionScreen';

// Prevents hydration mismatch — Zustand persist reads localStorage only on client
export default function Page() {
  const [mounted, setMounted] = useState(false);
  const { phase } = useGameStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-lg">Ω</span>
          </div>
          <span className="text-[10px] font-mono text-gray-600 tracking-[0.3em]">
            INITIALIZING...
          </span>
        </div>
      </div>
    );
  }

  switch (phase) {
    case 'home':
      return <HomeScreen />;
    case 'login':
      return <LoginScreen />;
    case 'hub':
      return <HubScreen />;
    case 'mission':
      return <MissionScreen />;
    default:
      return <HomeScreen />;
  }
}
