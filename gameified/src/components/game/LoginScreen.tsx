'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Shield, ChevronRight, User, Tag } from 'lucide-react';

const CODENAME_SUGGESTIONS = [
  'PHANTOM-7', 'GHOST-ZERO', 'CIPHER-X', 'NOVA-BLADE',
  'ECHO-NULL', 'VORTEX', 'AXIOM', 'SPECTRE-4',
];

export function LoginScreen() {
  const { startGame } = useGameStore();
  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [step, setStep] = useState<'identity' | 'oath'>('identity');

  const randomCodename = () => {
    const r = CODENAME_SUGGESTIONS[Math.floor(Math.random() * CODENAME_SUGGESTIONS.length)];
    setCodename(r);
  };

  const handleStart = () => {
    if (name.trim() && codename.trim()) {
      startGame(name.trim(), codename.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background effects */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,200,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-3xl" />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-scanlines" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {step === 'identity' ? (
          <IdentityForm
            name={name}
            codename={codename}
            onNameChange={setName}
            onCodenameChange={setCodename}
            onRandomCodename={randomCodename}
            onNext={() => setStep('oath')}
          />
        ) : (
          <OathScreen
            codename={codename}
            onBack={() => setStep('identity')}
            onStart={handleStart}
          />
        )}
      </motion.div>
    </div>
  );
}

function IdentityForm({
  name,
  codename,
  onNameChange,
  onCodenameChange,
  onRandomCodename,
  onNext,
}: {
  name: string;
  codename: string;
  onNameChange: (v: string) => void;
  onCodenameChange: (v: string) => void;
  onRandomCodename: () => void;
  onNext: () => void;
}) {
  return (
    <div className="border border-gray-700 bg-black/80 backdrop-blur-md rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 to-gray-950 border-b border-gray-800 px-6 py-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-lg">Ω</span>
          </div>
          <div>
            <div className="text-[9px] font-mono text-gray-500 tracking-[0.3em]">CLASSIFICATION: OMEGA</div>
            <div className="text-base font-black text-white tracking-tight">OMEGA DIVISION</div>
          </div>
        </div>
        <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
          An AI-virus has breached the city data network. Monitoring systems are going dark.
          We need operatives. You're being recruited.
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 tracking-widest mb-2 uppercase">
            <User size={9} />
            Operative Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your real name"
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2.5 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 tracking-widest mb-2 uppercase">
            <Tag size={9} />
            Operative Codename
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={codename}
              onChange={(e) => onCodenameChange(e.target.value.toUpperCase())}
              placeholder="PHANTOM-7"
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2.5 text-sm text-cyan-400 font-mono font-bold placeholder-gray-700 focus:outline-none focus:border-cyan-500 transition-colors tracking-widest"
            />
            <button
              onClick={onRandomCodename}
              className="px-3 py-2 bg-gray-800 border border-gray-700 hover:border-gray-600 rounded text-[10px] font-mono text-gray-400 hover:text-white transition-colors"
            >
              RANDOM
            </button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!name.trim() || !codename.trim()}
          className={`
            w-full py-3 rounded flex items-center justify-center gap-2 text-xs font-black tracking-widest transition-all
            ${
              name.trim() && codename.trim()
                ? 'bg-cyan-600 hover:bg-cyan-500 text-black cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          PROCEED TO BRIEFING
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </div>
  );
}

function OathScreen({
  codename,
  onBack,
  onStart,
}: {
  codename: string;
  onBack: () => void;
  onStart: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-gray-700 bg-black/80 backdrop-blur-md rounded-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-orange-950 to-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={14} className="text-orange-400" />
          <span className="text-[9px] font-mono text-orange-400 tracking-[0.3em]">OPERATIVE OATH</span>
        </div>
        <h2 className="text-lg font-black text-white">{codename}</h2>
      </div>

      <div className="px-6 py-5">
        <div className="border border-gray-800 bg-gray-900/40 rounded-lg p-4 mb-5 font-mono text-xs text-gray-400 leading-relaxed space-y-2">
          <p className="text-gray-300">
            "I, operative <span className="text-cyan-400">{codename}</span>, join Omega Division in service of the network."
          </p>
          <p>
            I understand that the city's AI infrastructure is under attack. Data systems are
            failing. Lives depend on fast, accurate intervention.
          </p>
          <p>
            I will learn Python, data science, machine learning, and AI engineering — not
            as academic exercises, but as weapons against the outbreak.
          </p>
          <p className="text-orange-400">
            The virus does not wait. Neither will I.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-5 cursor-pointer">
          <div
            onClick={() => setAccepted((a) => !a)}
            className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
              accepted ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
            }`}
          >
            {accepted && <span className="text-black text-[10px] font-black">✓</span>}
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            I accept the mission. Deploy me.
          </span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 text-[10px] font-mono rounded transition-colors"
          >
            ← BACK
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            disabled={!accepted}
            className={`
              flex-1 py-2.5 rounded flex items-center justify-center gap-2 text-xs font-black tracking-widest transition-all
              ${
                accepted
                  ? 'bg-orange-600 hover:bg-orange-500 text-black cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            ENTER THE DIVISION
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
