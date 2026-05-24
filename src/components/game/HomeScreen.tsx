'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { ChevronRight, AlertTriangle, Zap, Radio } from 'lucide-react';

export function HomeScreen() {
  const { setPhase } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Animated grid background */}
      <div
        className="fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,200,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-900/8 rounded-full blur-3xl" />
      <div className="fixed top-1/3 left-1/3 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />

      {/* Emergency ticker */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-950/80 border-b border-red-800/40 overflow-hidden">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-8 py-1.5 whitespace-nowrap"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-[10px] font-mono text-red-400 font-bold tracking-widest">
                <AlertTriangle size={9} />
                CRITICAL — AI VIRUS DETECTED — HOSPITAL NETWORK OFFLINE
              </span>
              <span className="text-[10px] font-mono text-orange-400 tracking-widest">
                ◆ MONITORING FAILURE — SECTOR 7 — INFECTED COUNT RISING ◆
              </span>
              <span className="text-[10px] font-mono text-yellow-400 tracking-widest">
                ◆ OMEGA DIVISION RESPONSE ACTIVATED ◆
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600" />
            <div
              className="absolute inset-0 rounded-xl opacity-30 animate-pulse"
              style={{ background: 'radial-gradient(circle, #00ffcc 0%, transparent 70%)' }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
              Ω
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-[10px] font-mono text-gray-600 tracking-[0.5em] mb-1">
              CLASSIFIED — OMEGA DIVISION
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
              AXIOM
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                PROTOCOL
              </span>
            </h1>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm md:text-base font-mono text-gray-500 max-w-lg leading-relaxed mb-8"
        >
          An AI-virus is spreading through the city data network. Hospitals are going dark.
          The outbreak is accelerating.{' '}
          <span className="text-cyan-400">You are our last operative.</span>
        </motion.p>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {[
            'Python', 'Data Science', 'Machine Learning',
            'Data Engineering', 'AI Engineering', 'Agentic AI', 'MCP Concepts',
          ].map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-gray-500 border border-gray-800 px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPhase('login')}
            className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-black text-sm font-black tracking-widest rounded-lg transition-all shadow-[0_0_30px_rgba(0,255,200,0.2)]"
          >
            <Zap size={14} />
            DEPLOY AS OPERATIVE
            <ChevronRight size={14} />
          </motion.button>
          <button
            onClick={() => setPhase('login')}
            className="flex items-center gap-2 px-6 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 text-sm font-mono tracking-widest rounded-lg transition-all"
          >
            <Radio size={12} />
            CONTINUE MISSION
          </button>
        </motion.div>
      </div>

      {/* Bottom manga panels */}
      <div className="relative z-10 grid grid-cols-3 gap-0 h-24 overflow-hidden opacity-20">
        {[
          { color: '#00ffcc', label: 'PANDAS' },
          { color: '#a855f7', label: 'ML MODELS' },
          { color: '#f97316', label: 'AI AGENTS' },
        ].map((panel) => (
          <div
            key={panel.label}
            className="border-t border-r last:border-r-0 flex items-center justify-center"
            style={{ borderColor: panel.color + '30', background: panel.color + '05' }}
          >
            <span
              className="text-[10px] font-mono font-bold tracking-[0.3em]"
              style={{ color: panel.color }}
            >
              {panel.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
