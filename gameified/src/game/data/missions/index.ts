import { Mission } from '@/game/types';
import { MISSION_CONTAINMENT_FAILURE } from './containment-failure';

export const ALL_MISSIONS: Record<string, Mission> = {
  'containment-failure': MISSION_CONTAINMENT_FAILURE,
};

export const getMission = (id: string): Mission | null => ALL_MISSIONS[id] ?? null;
export const getFirstMissionId = () => 'containment-failure';
