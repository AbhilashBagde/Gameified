'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { HUD } from './HUD';
import { DialogueEngine } from './DialogueEngine';
import { PuzzleGrid } from './PuzzleGrid';
import { CodeTerminal } from './CodeTerminal';
import { MissionComplete } from './MissionComplete';
import { getMission } from '@/game/data/missions';
import { AlertTriangle } from 'lucide-react';

export function MissionScreen() {
  const {
    currentMissionId,
    currentMissionPhase,
    lastCommandResult,
  } = useGameStore();

  const mission = currentMissionId ? getMission(currentMissionId) : null;

  if (!mission) return null;

  const showPuzzle = currentMissionPhase === 'puzzle' || currentMissionPhase === 'resolution';
  const showComplete =
    currentMissionPhase === 'resolution' && lastCommandResult?.success;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,200,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,200,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-dark" />
        {/* Alert pulse */}
        <motion.div
          className="absolute inset-0 bg-red-900/5"
          animate={{ opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <HUD />

      {/* Main content */}
      <div className="flex-1 flex flex-col pt-14">
        <AnimatePresence mode="wait">
          {!showPuzzle ? (
            /* ── Briefing / Investigation phase ── */
            <motion.div
              key="dialogue-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Manga panel background */}
              <div className="flex-1 relative overflow-hidden">
                <CityBackground />
                <MissionBriefPanel mission={mission} />
              </div>

              {/* Dialogue overlays above the scene */}
              <DialogueEngine />
            </motion.div>
          ) : (
            /* ── Puzzle phase ── */
            <motion.div
              key="puzzle-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden"
            >
              {/* Left — grid */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={12} className="text-orange-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-orange-400 tracking-widest uppercase">
                      Data Breach Detected
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    Column <span className="text-orange-300">'infected_status'</span> is locked.
                    Select it using Python to restore monitoring.
                  </p>
                </div>
                <PuzzleGrid />
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-cyan-900 to-transparent" />

              {/* Right — terminal */}
              <div className="w-full lg:w-[420px] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-800">
                <div className="px-3 py-2 bg-gray-900 border-b border-gray-800">
                  <p className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">
                    Python Recovery Terminal
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeTerminal />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mission complete overlay */}
      <AnimatePresence>
        {showComplete && <MissionComplete />}
      </AnimatePresence>
    </div>
  );
}

function CityBackground() {
  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
      {/* Futuristic city silhouette using CSS */}
      <svg
        viewBox="0 0 1200 500"
        className="w-full h-full object-cover opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* City buildings */}
        <rect x="0" y="200" width="80" height="300" fill="#00ffcc" opacity="0.6" />
        <rect x="90" y="150" width="60" height="350" fill="#0066ff" opacity="0.5" />
        <rect x="160" y="100" width="100" height="400" fill="#00ffcc" opacity="0.4" />
        <rect x="270" y="180" width="70" height="320" fill="#a855f7" opacity="0.5" />
        <rect x="350" y="80" width="90" height="420" fill="#0066ff" opacity="0.6" />
        <rect x="450" y="130" width="55" height="370" fill="#00ffcc" opacity="0.3" />
        <rect x="515" y="50" width="120" height="450" fill="#a855f7" opacity="0.5" />
        <rect x="645" y="120" width="80" height="380" fill="#0066ff" opacity="0.4" />
        <rect x="740" y="170" width="65" height="330" fill="#00ffcc" opacity="0.6" />
        <rect x="815" y="90" width="110" height="410" fill="#a855f7" opacity="0.4" />
        <rect x="935" y="160" width="75" height="340" fill="#0066ff" opacity="0.5" />
        <rect x="1020" y="110" width="90" height="390" fill="#00ffcc" opacity="0.4" />
        <rect x="1120" y="200" width="80" height="300" fill="#a855f7" opacity="0.6" />

        {/* Windows on buildings */}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map((x, i) =>
          [120, 160, 200, 240, 280, 320].map((y, j) => (
            <rect
              key={`${i}-${j}`}
              x={x + (j % 3) * 15}
              y={y}
              width="6"
              height="8"
              fill={i % 3 === 0 ? '#00ffcc' : i % 3 === 1 ? '#0066ff' : '#a855f7'}
              opacity={Math.random() > 0.4 ? 0.8 : 0.1}
            />
          ))
        )}
      </svg>

      {/* Ground glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/20 to-transparent" />
    </div>
  );
}

function MissionBriefPanel({ mission }: { mission: ReturnType<typeof getMission> }) {
  if (!mission) return null;
  return (
    <div className="relative z-10 p-6 max-w-2xl mx-auto mt-12">
      {/* Dossier card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-gray-700 bg-black/60 backdrop-blur-md rounded-lg p-5"
      >
        {/* Classification stamp */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[9px] font-mono text-red-400 border border-red-400/50 px-2 py-0.5 rounded tracking-[0.3em]">
              {mission.classification}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: mission.difficulty }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            ))}
            {Array.from({ length: 5 - mission.difficulty }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-1">{mission.title}</h1>
        <p className="text-[11px] font-mono text-cyan-600 mb-3 tracking-wider">{mission.subtitle}</p>
        <p className="text-sm text-gray-400 leading-relaxed">{mission.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {mission.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono text-gray-500 border border-gray-700 px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
