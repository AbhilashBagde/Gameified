'use client';

import { useGameStore } from '@/stores/gameStore';
import { HomeScreen } from '@/components/game/HomeScreen';
import { LoginScreen } from '@/components/game/LoginScreen';
import { HubScreen } from '@/components/game/HubScreen';
import { MissionScreen } from '@/components/game/MissionScreen';

export default function Page() {
  const { phase } = useGameStore();

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
