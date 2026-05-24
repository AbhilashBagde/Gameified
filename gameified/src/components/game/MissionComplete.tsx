'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getMission } from '@/game/data/missions';
import { RANK_NAMES, getLevelFromXP } from '@/game/engine/xpSystem';
import { Trophy, Star, ChevronRight, BookOpen } from 'lucide-react';

export function MissionComplete() {
  const { currentMissionPhase, currentMissionId, player, completeMission, setPhase } =
    useGameStore();

  if (currentMissionPhase !== 'complete' && currentMissionPhase !== 'resolution') return null;

  const mission = currentMissionId ? getMission(currentMissionId) : null;
  if (!mission) return null;

  const isComplete = currentMissionPhase === 'complete';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="max-w-md w-full bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-950 to-cyan-950 border-b border-green-800/30 px-6 py-5">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-400" size={20} />
            <span className="text-[10px] font-mono text-green-400 tracking-[0.3em] uppercase">
              Mission Complete
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {mission.title}
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">{mission.subtitle}</p>
        </div>

        {/* XP Gain */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-400" />
              <span className="text-sm font-mono text-gray-300">Experience Gained</span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-lg font-black text-yellow-400"
            >
              +{mission.xpReward} XP
            </motion.span>
          </div>

          {/* Level display */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                initial={{ width: '30%' }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-500">
              LVL {player.level} — {RANK_NAMES[player.level]}
            </span>
          </div>
        </div>

        {/* Concepts learned */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-600 tracking-widest uppercase">
              Concepts Activated
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mission.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-0.5 bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 text-[10px] font-mono rounded-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Dr. Kael debrief */}
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/30">
          <p className="text-[11px] font-mono text-gray-400 italic leading-relaxed">
            "What you just did — df['infected_status'] — is one of the most common operations in
            data science. You selected a single column from a pandas DataFrame. Every day, data
            scientists do this thousands of times to analyze, clean, and model data."
          </p>
          <span className="text-[10px] text-orange-400 font-mono mt-1 block">— Dr. Kael</span>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          {!isComplete && (
            <button
              onClick={completeMission}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-black text-xs font-black tracking-widest rounded transition-colors flex items-center justify-center gap-1"
            >
              CLAIM REWARD
            </button>
          )}
          <button
            onClick={() => setPhase('hub')}
            className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono tracking-widest rounded transition-colors flex items-center justify-center gap-1"
          >
            RETURN TO HUB
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
