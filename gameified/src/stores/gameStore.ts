'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GamePhase,
  MissionPhase,
  GridTile,
  TileState,
  CommandResult,
  PlayerProfile,
} from '@/game/types';
import { getMission, getFirstMissionId } from '@/game/data/missions';
import { applyXP, getLevelFromXP } from '@/game/engine/xpSystem';

const DEFAULT_PLAYER: PlayerProfile = {
  name: '',
  codename: '',
  xp: 0,
  level: 1,
  completedMissions: [],
  failedMissions: [],
  unlockedConcepts: [],
  badges: [],
  joinedAt: 0,
};

interface GameActions {
  // Navigation
  setPhase: (phase: GamePhase) => void;
  startGame: (name: string, codename: string) => void;

  // Mission
  loadMission: (missionId: string) => void;
  setMissionPhase: (phase: MissionPhase) => void;
  completeMission: () => void;

  // Dialogue
  setDialogueScene: (sceneId: string) => void;
  advanceDialogue: () => void;
  goToScene: (sceneId: string) => void;

  // Grid
  updateTileState: (tileId: string, state: TileState) => void;
  activateTiles: (tileIds: string[]) => void;
  resetGrid: () => void;

  // Commands
  submitCommand: (result: CommandResult) => void;
  addToHistory: (cmd: string) => void;

  // XP
  awardXP: (amount: number) => void;
}

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ─── Initial State ───────────────────────────────────────────────
      phase: 'home',
      currentMissionId: null,
      currentMissionPhase: 'briefing',
      currentDialogueSceneId: null,
      currentDialogueLineIndex: 0,
      player: DEFAULT_PLAYER,
      grid: [],
      commandHistory: [],
      lastCommandResult: null,
      alertLevel: 'nominal',

      // ─── Navigation ──────────────────────────────────────────────────
      setPhase: (phase) => set({ phase }),

      startGame: (name, codename) => {
        set({
          player: {
            ...DEFAULT_PLAYER,
            name,
            codename,
            joinedAt: Date.now(),
          },
          phase: 'hub',
        });
      },

      // ─── Mission ─────────────────────────────────────────────────────
      loadMission: (missionId) => {
        const mission = getMission(missionId);
        if (!mission) return;
        set({
          currentMissionId: missionId,
          currentMissionPhase: 'briefing',
          currentDialogueSceneId: 'intro',
          currentDialogueLineIndex: 0,
          grid: mission.puzzle.tiles,
          lastCommandResult: null,
          commandHistory: [],
          alertLevel: 'critical',
          phase: 'mission',
        });
      },

      setMissionPhase: (phase) => set({ currentMissionPhase: phase }),

      completeMission: () => {
        const { currentMissionId, player } = get();
        if (!currentMissionId) return;
        const mission = getMission(currentMissionId);
        if (!mission) return;
        const updated = applyXP(player, mission.xpReward);
        set({
          player: {
            ...updated,
            completedMissions: [...player.completedMissions, currentMissionId],
            badges: [...player.badges, `mission-${currentMissionId}`],
          },
          currentMissionPhase: 'complete',
          alertLevel: 'nominal',
        });
      },

      // ─── Dialogue ────────────────────────────────────────────────────
      setDialogueScene: (sceneId) =>
        set({ currentDialogueSceneId: sceneId, currentDialogueLineIndex: 0 }),

      advanceDialogue: () => {
        const { currentMissionId, currentDialogueSceneId, currentDialogueLineIndex } = get();
        if (!currentMissionId || !currentDialogueSceneId) return;
        const mission = getMission(currentMissionId);
        if (!mission) return;

        const scene = mission.dialogueScenes[currentDialogueSceneId];
        if (!scene) return;

        const nextIndex = currentDialogueLineIndex + 1;

        if (nextIndex < scene.lines.length) {
          set({ currentDialogueLineIndex: nextIndex });
        } else if (scene.nextSceneId) {
          // Transition to next dialogue scene
          const nextScene = scene.nextSceneId;
          if (nextScene === 'puzzle') {
            set({
              currentMissionPhase: 'puzzle',
              currentDialogueSceneId: null,
              currentDialogueLineIndex: 0,
            });
          } else {
            set({ currentDialogueSceneId: nextScene, currentDialogueLineIndex: 0 });
          }
        } else {
          // Scene ended, no next scene
          set({ currentDialogueSceneId: null });
        }
      },

      goToScene: (sceneId) =>
        set({ currentDialogueSceneId: sceneId, currentDialogueLineIndex: 0 }),

      // ─── Grid ────────────────────────────────────────────────────────
      updateTileState: (tileId, state) =>
        set((s) => ({
          grid: s.grid.map((t) => (t.id === tileId ? { ...t, state } : t)),
        })),

      activateTiles: (tileIds) =>
        set((s) => ({
          grid: s.grid.map((t) =>
            tileIds.includes(t.id) ? { ...t, state: 'correct' } : t
          ),
        })),

      resetGrid: () => {
        const { currentMissionId } = get();
        if (!currentMissionId) return;
        const mission = getMission(currentMissionId);
        if (!mission) return;
        set({ grid: mission.puzzle.tiles });
      },

      // ─── Commands ────────────────────────────────────────────────────
      submitCommand: (result) => {
        const { grid } = get();
        let newGrid = [...grid];

        if (result.success && result.tilesActivated) {
          newGrid = newGrid.map((t) =>
            result.tilesActivated!.includes(t.id) ? { ...t, state: 'correct' } : t
          );
        } else if (result.effect === 'error') {
          // Flash error on locked tiles
          newGrid = newGrid.map((t) =>
            t.state === 'locked' ? { ...t, state: 'error' } : t
          );
          // Reset error after a moment (handled in component)
        }

        set({ lastCommandResult: result, grid: newGrid });
      },

      addToHistory: (cmd) =>
        set((s) => ({ commandHistory: [cmd, ...s.commandHistory].slice(0, 20) })),

      // ─── XP ──────────────────────────────────────────────────────────
      awardXP: (amount) => {
        const { player } = get();
        set({ player: applyXP(player, amount) });
      },
    }),
    {
      name: 'omega-division-save',
      partialize: (state) => ({
        player: state.player,
        phase: state.phase === 'mission' ? 'hub' : state.phase,
      }),
    }
  )
);
