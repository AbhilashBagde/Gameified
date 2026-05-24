'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getMission } from '@/game/data/missions';
import { getLevelFromXP, getProgressPercent, getXPForNextLevel, RANK_NAMES } from '@/game/engine/xpSystem';
import { Shield, Zap, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

export function HUD() {
  const { player, currentMissionId, currentMissionPhase, alertLevel } = useGameStore();

  const mission = currentMissionId ? getMission(currentMissionId) : null;
  const level = getLevelFromXP(player.xp);
  const progress = getProgressPercent(player.xp, level);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-stretch bg-black/80 backdrop-blur-md border-b border-gray-800">
        {/* Left — org identity */}
        <div className="px-4 py-2 border-r border-gray-800 flex items-center gap-2">
          <div className="w-6 h-6 relative flex-shrink-0">
            <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 opacity-80" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white">
              Ω
            </span>
          </div>
          <div>
            <div className="text-[8px] font-mono text-gray-500 tracking-[0.3em] uppercase">
              Omega Division
            </div>
            <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest">
              AXIOM NETWORK
            </div>
          </div>
        </div>

        {/* Center — mission info */}
        <div className="flex-1 px-4 py-2 flex items-center justify-center gap-4">
          {mission ? (
            <>
              <AlertBadge level={alertLevel} />
              <div className="text-center">
                <div className="text-[8px] font-mono text-gray-600 tracking-widest">
                  {mission.classification}
                </div>
                <div className="text-[11px] font-mono text-white font-bold tracking-wider">
                  {mission.title}
                </div>
              </div>
              <PhaseIndicator phase={currentMissionPhase} />
            </>
          ) : (
            <span className="text-[10px] font-mono text-gray-600 tracking-widest">
              OPERATIVE READY — AWAITING MISSION
            </span>
          )}
        </div>

        {/* Right — player status */}
        <div className="px-4 py-2 border-l border-gray-800 flex items-center gap-3">
          {/* XP Bar */}
          <div className="hidden sm:flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[8px] font-mono text-gray-500">
                {RANK_NAMES[level] ?? 'Field Recruit'}
              </span>
              <span className="text-[8px] font-mono text-cyan-400">{player.xp} XP</span>
            </div>
            <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Level badge */}
          <div className="flex items-center gap-1">
            <Shield size={10} className="text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-white">
              LVL {level}
            </span>
          </div>

          {/* Codename */}
          <div className="hidden md:block text-[10px] font-mono text-gray-400">
            <span className="text-gray-600">▸ </span>
            {player.codename || player.name || 'UNKNOWN'}
          </div>
        </div>
      </div>

      {/* Mission objectives sidebar */}
      {mission && currentMissionPhase !== 'briefing' && (
        <div className="absolute top-12 right-0 w-56 m-2 pointer-events-auto">
          <MissionObjectives />
        </div>
      )}
    </div>
  );
}

function AlertBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    nominal: 'text-green-400 border-green-400/30',
    elevated: 'text-yellow-400 border-yellow-400/30',
    critical: 'text-orange-400 border-orange-400/30',
    catastrophic: 'text-red-400 border-red-400/30 animate-pulse',
  };
  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 border rounded text-[8px] font-mono font-bold tracking-widest ${colors[level]}`}
    >
      <AlertTriangle size={8} />
      {level.toUpperCase()}
    </div>
  );
}

function PhaseIndicator({ phase }: { phase: string }) {
  const labels: Record<string, string> = {
    briefing: 'BRIEFING',
    investigation: 'INVESTIGATE',
    puzzle: 'ACTIVE PUZZLE',
    resolution: 'RESOLVING',
    complete: 'COMPLETE',
  };
  return (
    <div className="text-[8px] font-mono text-gray-500 tracking-[0.2em] border border-gray-700 px-2 py-0.5 rounded">
      {labels[phase] ?? phase.toUpperCase()}
    </div>
  );
}

function MissionObjectives() {
  const { currentMissionId, currentMissionPhase, lastCommandResult } = useGameStore();
  const mission = currentMissionId ? getMission(currentMissionId) : null;
  if (!mission) return null;

  const completedCount = currentMissionPhase === 'complete'
    ? mission.objectives.length
    : currentMissionPhase === 'resolution'
    ? mission.objectives.length - 1
    : currentMissionPhase === 'puzzle'
    ? 2
    : 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/80 backdrop-blur-md border border-gray-800 rounded p-2"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Zap size={9} className="text-cyan-400" />
        <span className="text-[9px] font-mono text-cyan-600 tracking-widest uppercase">
          Objectives
        </span>
      </div>
      <div className="space-y-1.5">
        {mission.objectives.map((obj, i) => {
          const done = i < completedCount;
          return (
            <div key={obj.id} className="flex items-start gap-1.5">
              {done ? (
                <CheckCircle size={9} className="text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <Lock size={9} className="text-gray-600 mt-0.5 flex-shrink-0" />
              )}
              <span
                className={`text-[9px] font-mono leading-tight ${
                  done ? 'text-green-400/70 line-through' : 'text-gray-500'
                }`}
              >
                {obj.text}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
