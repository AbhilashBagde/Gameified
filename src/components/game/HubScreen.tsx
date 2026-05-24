'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getMission, ALL_MISSIONS } from '@/game/data/missions';
import { PlayerProfile } from '@/game/types';
import { RANK_NAMES, getLevelFromXP, getProgressPercent } from '@/game/engine/xpSystem';
import { Shield, Play, Lock, Star, Zap, AlertTriangle, Radio } from 'lucide-react';

export function HubScreen() {
  const { player, loadMission, setPhase } = useGameStore();
  const level = getLevelFromXP(player.xp);
  const progress = getProgressPercent(player.xp, level);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,200,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">Ω</span>
            </div>
            <div>
              <div className="text-[9px] font-mono text-gray-500 tracking-[0.3em]">
                OMEGA DIVISION — OPERATIVE HQ
              </div>
              <div className="text-lg font-black text-white tracking-tight">
                AXIOM NETWORK
              </div>
            </div>
          </div>
          <PlayerCard player={player} level={level} progress={progress} />
        </div>

        {/* Alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 px-4 py-3 border border-orange-500/30 bg-orange-950/20 rounded-lg"
        >
          <AlertTriangle size={14} className="text-orange-400 animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-orange-400 font-bold tracking-widest">
              ACTIVE OUTBREAK ALERT
            </span>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              AI-virus spreading across City Sector 7. Hospital monitoring offline. Immediate operative intervention required.
            </p>
          </div>
          <Radio size={14} className="text-orange-400 animate-pulse flex-shrink-0" />
        </motion.div>

        {/* Mission grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-600 tracking-[0.3em] uppercase">
              Active Missions
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(ALL_MISSIONS).map((mission, i) => {
              const isCompleted = player.completedMissions.includes(mission.id);
              const isUnlocked = i === 0 || player.completedMissions.includes(
                Object.values(ALL_MISSIONS)[i - 1]?.id ?? ''
              );
              return (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  onStart={() => loadMission(mission.id)}
                />
              );
            })}
            {/* Locked future missions */}
            {Array.from({ length: 2 }).map((_, i) => (
              <LockedMissionCard key={`locked-${i}`} index={i} />
            ))}
          </div>
        </div>

        {/* Learning paths */}
        <LearningPaths />
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  level,
  progress,
}: {
  player: PlayerProfile;
  level: number;
  progress: number;
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
        <Shield size={14} className="text-white" />
      </div>
      <div>
        <div className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">
          {RANK_NAMES[level] ?? 'Field Recruit'}
        </div>
        <div className="text-sm font-bold text-white font-mono">
          {player.codename || player.name || 'OPERATIVE'}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-cyan-400">{player.xp} XP</span>
        </div>
      </div>
    </div>
  );
}

function MissionCard({
  mission,
  isCompleted,
  isUnlocked,
  onStart,
}: {
  mission: ReturnType<typeof getMission>;
  isCompleted: boolean;
  isUnlocked: boolean;
  onStart: () => void;
}) {
  if (!mission) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isUnlocked && !isCompleted ? { y: -2 } : {}}
      className={`
        relative rounded-lg border overflow-hidden transition-all
        ${
          isCompleted
            ? 'border-green-800/40 bg-green-950/10'
            : isUnlocked
            ? 'border-orange-700/40 bg-orange-950/10 cursor-pointer hover:border-orange-500/60'
            : 'border-gray-800 bg-gray-900/20 opacity-50 cursor-not-allowed'
        }
      `}
      onClick={isUnlocked && !isCompleted ? onStart : undefined}
    >
      {/* Alert indicator */}
      {isUnlocked && !isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-orange-400" />
        </div>
      )}

      <div className="p-4">
        {/* Classification */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[8px] font-mono tracking-[0.3em] border px-1.5 py-0.5 rounded ${
              isCompleted
                ? 'text-green-500 border-green-500/30'
                : 'text-red-400 border-red-400/30'
            }`}
          >
            {isCompleted ? 'COMPLETED' : mission.classification}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: mission.difficulty }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400/70" />
            ))}
          </div>
        </div>

        <h3 className="text-sm font-black text-white tracking-tight mb-1">
          {mission.title}
        </h3>
        <p className="text-[10px] font-mono text-gray-500 mb-1">{mission.subtitle}</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {mission.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {mission.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-mono text-gray-600 border border-gray-800 px-1.5 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        {isUnlocked && !isCompleted && (
          <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-orange-600/80 hover:bg-orange-500 text-black text-[10px] font-black tracking-widest rounded transition-colors">
            <Play size={10} />
            DEPLOY
          </button>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-1.5 py-2 bg-green-950/40 text-green-500 text-[10px] font-mono rounded">
            <Star size={10} />
            +{mission.xpReward} XP EARNED
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LockedMissionCard({ index }: { index: number }) {
  const titles = ['SIGNAL LOST', 'ZERO PROTOCOL'];
  const subtitles = ['Neural Grid Collapse — Sector 12', 'AI Core Breach — Downtown'];
  const tags = [
    ['numpy', 'arrays', 'data-cleaning'],
    ['sklearn', 'ml-models', 'classification'],
  ];

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/10 p-4 opacity-40">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[8px] font-mono text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded tracking-[0.3em]">
          CLASSIFIED
        </span>
        <Lock size={10} className="text-gray-600" />
      </div>
      <h3 className="text-sm font-black text-gray-500 tracking-tight mb-1">
        {titles[index]}
      </h3>
      <p className="text-[10px] font-mono text-gray-600 mb-1">{subtitles[index]}</p>
      <div className="flex gap-1 mt-3">
        {tags[index].map((tag) => (
          <span key={tag} className="text-[8px] font-mono text-gray-700 border border-gray-800 px-1.5 py-0.5 rounded-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1 py-2 border border-gray-800 rounded">
        <Lock size={8} className="text-gray-700" />
        <span className="text-[9px] font-mono text-gray-700">COMPLETE PRIOR MISSION</span>
      </div>
    </div>
  );
}

function LearningPaths() {
  const paths = [
    {
      id: 'python',
      name: 'Python Foundations',
      color: '#00ffcc',
      description: 'Variables, functions, loops, data structures',
      missions: 4,
      unlocked: true,
    },
    {
      id: 'data-science',
      name: 'Data Science Core',
      color: '#a855f7',
      description: 'Pandas, NumPy, visualization, statistical analysis',
      missions: 6,
      unlocked: false,
    },
    {
      id: 'ml',
      name: 'Machine Learning',
      color: '#f97316',
      description: 'Supervised learning, models, evaluation, deployment',
      missions: 8,
      unlocked: false,
    },
    {
      id: 'ai-engineering',
      name: 'AI Engineering',
      color: '#ef4444',
      description: 'LLMs, agents, RAG, prompt engineering, MCP',
      missions: 10,
      unlocked: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Star size={12} className="text-yellow-400" />
        <span className="text-[10px] font-mono text-yellow-600 tracking-[0.3em] uppercase">
          Learning Paths
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-yellow-900/50 to-transparent" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {paths.map((path) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg border p-3 relative overflow-hidden ${
              path.unlocked ? 'border-gray-700 cursor-pointer hover:border-gray-500' : 'border-gray-800 opacity-50'
            }`}
          >
            {/* Color accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: path.color }}
            />
            <div className="flex items-start justify-between mb-2">
              <span
                className="text-[9px] font-mono font-bold tracking-wide"
                style={{ color: path.color }}
              >
                {path.name}
              </span>
              {!path.unlocked && <Lock size={9} className="text-gray-600" />}
            </div>
            <p className="text-[9px] text-gray-500 leading-tight mb-2">
              {path.description}
            </p>
            <span className="text-[8px] font-mono text-gray-700">
              {path.missions} MISSIONS
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
