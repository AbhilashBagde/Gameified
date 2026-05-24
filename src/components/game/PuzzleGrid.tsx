'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { GridTile, TileState } from '@/game/types';
import { getMission } from '@/game/data/missions';
import { cn } from '@/lib/utils';

const TILE_COLORS: Record<TileState, string> = {
  idle: 'border-gray-700 bg-gray-900/80 text-gray-400',
  active: 'border-cyan-400 bg-cyan-950/60 text-cyan-300',
  correct: 'border-green-400 bg-green-950/60 text-green-300',
  error: 'border-red-500 bg-red-950/60 text-red-300',
  locked: 'border-orange-500/50 bg-orange-950/30 text-orange-400 opacity-70',
  scanning: 'border-yellow-400 bg-yellow-950/60 text-yellow-300',
};

const TILE_GLOW: Record<TileState, string> = {
  idle: '',
  active: 'shadow-[0_0_8px_rgba(34,211,238,0.4)]',
  correct: 'shadow-[0_0_12px_rgba(74,222,128,0.5)]',
  error: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
  locked: 'shadow-[0_0_6px_rgba(249,115,22,0.3)]',
  scanning: 'shadow-[0_0_10px_rgba(250,204,21,0.4)]',
};

export function PuzzleGrid() {
  const { grid, currentMissionId, currentMissionPhase } = useGameStore();

  if (currentMissionPhase !== 'puzzle' && currentMissionPhase !== 'resolution') return null;
  if (!grid.length) return null;

  const mission = currentMissionId ? getMission(currentMissionId) : null;
  const size = mission?.puzzle.gridSize ?? 6;

  // Separate header row from data rows
  const headerTiles = grid.filter((t) => t.row === 0);
  const dataRows: GridTile[][] = [];
  for (let r = 1; r <= size; r++) {
    dataRows.push(grid.filter((t) => t.row === r));
  }

  return (
    <div className="w-full">
      {/* Grid label */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-800 to-transparent" />
        <span className="text-[10px] font-mono text-cyan-600 tracking-[0.3em] uppercase">
          DataFrame — hospital_records.csv
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-800 to-transparent" />
      </div>

      <div className="rounded-lg border border-gray-800 overflow-hidden bg-black/40">
        {/* Column headers */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {headerTiles.map((tile) => (
            <HeaderTile key={tile.id} tile={tile} />
          ))}
        </div>

        {/* Data rows */}
        {dataRows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid border-t border-gray-800/50"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {row.map((tile) => (
              <DataTile key={tile.id} tile={tile} rowIdx={rowIdx} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-end">
        {(['idle', 'locked', 'correct', 'error'] as TileState[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={cn(
                'w-2 h-2 rounded-sm border',
                TILE_COLORS[s].split(' ')[0],
                TILE_COLORS[s].split(' ')[1]
              )}
            />
            <span className="text-[9px] text-gray-600 font-mono capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderTile({ tile }: { tile: GridTile }) {
  const isTarget = tile.dataKey === 'infected_status';
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-center border-r border-gray-800 last:border-r-0',
        'text-[9px] font-mono font-bold tracking-widest uppercase',
        isTarget
          ? 'text-orange-400 bg-orange-950/30'
          : 'text-gray-500 bg-gray-950'
      )}
    >
      {tile.label}
      {isTarget && (
        <span className="ml-1 text-red-400 animate-pulse">⚠</span>
      )}
    </div>
  );
}

function DataTile({ tile, rowIdx }: { tile: GridTile; rowIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: rowIdx * 0.04 + tile.col * 0.02 }}
      className={cn(
        'px-2 py-1.5 text-center border-r border-gray-800/50 last:border-r-0',
        'text-[10px] font-mono transition-all duration-300',
        TILE_COLORS[tile.state],
        TILE_GLOW[tile.state]
      )}
    >
      <AnimatePresence mode="wait">
        {tile.state === 'correct' ? (
          <motion.span
            key="correct"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-green-300"
          >
            ✓ {tile.label}
          </motion.span>
        ) : tile.state === 'locked' ? (
          <motion.span
            key="locked"
            className="text-orange-400/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ■■■
          </motion.span>
        ) : tile.state === 'error' ? (
          <motion.span
            key="error"
            initial={{ x: -2 }}
            animate={{ x: [0, -3, 3, -2, 2, 0] }}
            transition={{ duration: 0.3 }}
            className="text-red-400"
          >
            ERR
          </motion.span>
        ) : (
          <span key="normal">{tile.label}</span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
