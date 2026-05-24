'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/stores/gameStore';
import { validateCommand } from '@/game/engine/commandValidator';
import { getMission } from '@/game/data/missions';
import { Terminal, ChevronRight, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

// Monaco loads client-side only
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-gray-600 font-mono text-xs">
      Initializing terminal...
    </div>
  ),
});

export function CodeTerminal() {
  const {
    currentMissionId,
    currentMissionPhase,
    submitCommand,
    addToHistory,
    commandHistory,
    lastCommandResult,
    goToScene,
    setMissionPhase,
    completeMission,
    awardXP,
  } = useGameStore();

  const [code, setCode] = useState("df['infected_status']");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const mission = currentMissionId ? getMission(currentMissionId) : null;
  const puzzle = mission?.puzzle;

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lastCommandResult]);

  const handleRun = useCallback(async () => {
    if (!puzzle || !code.trim() || isExecuting) return;

    setIsExecuting(true);
    addToHistory(code);

    // Dramatic execution pause
    await new Promise((r) => setTimeout(r, 600));

    const result = validateCommand(code, puzzle);
    submitCommand(result);

    if (result.success) {
      await new Promise((r) => setTimeout(r, 1200));
      awardXP(result.xpGained ?? 50);
      setMissionPhase('resolution');
      goToScene('success');
    }

    setIsExecuting(false);
  }, [code, puzzle, isExecuting, submitCommand, addToHistory, goToScene, setMissionPhase, awardXP]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleRun();
      }
    },
    [handleRun]
  );

  if (currentMissionPhase !== 'puzzle' && currentMissionPhase !== 'resolution') return null;

  const isResolved = currentMissionPhase === 'resolution';

  return (
    <div className="flex flex-col h-full">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-600 tracking-widest uppercase">
            Omega Terminal — Python 3.12
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Context banner */}
      {puzzle && (
        <div className="px-3 py-2 bg-gray-900/60 border-b border-gray-800">
          <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
            <span className="text-cyan-600"># </span>
            {puzzle.context}
          </p>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 min-h-[120px] relative">
        {isResolved ? (
          <div className="h-full flex items-center justify-center bg-green-950/20">
            <span className="text-green-400 font-mono text-xs tracking-widest">
              ✓ COMMAND ACCEPTED
            </span>
          </div>
        ) : (
          <MonacoEditor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v ?? '')}
            onMount={(editor) => {
              editor.addCommand(
                // Ctrl+Enter / Cmd+Enter — keybinding wired up here
                2048 | 3, // KeyMod.CtrlCmd | KeyCode.Enter
                handleRun
              );
              editor.focus();
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineNumbers: 'off',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 12, bottom: 12 },
              scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
              overviewRulerLanes: 0,
              renderLineHighlight: 'none',
              suggestOnTriggerCharacters: true,
            }}
          />
        )}
      </div>

      {/* Output panel */}
      <AnimatePresence>
        {lastCommandResult && (
          <motion.div
            ref={outputRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800 bg-black overflow-hidden"
          >
            <div className="px-3 py-2 max-h-32 overflow-y-auto">
              {lastCommandResult.output && (
                <pre className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {lastCommandResult.output}
                </pre>
              )}
              {lastCommandResult.errorMessage && (
                <div className="mt-2 flex items-start gap-2">
                  {lastCommandResult.success ? (
                    <CheckCircle2 size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={12} className="text-orange-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-[11px] font-mono text-orange-300">
                    {lastCommandResult.errorMessage}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action bar */}
      <div className="px-3 py-2 bg-gray-950 border-t border-gray-800 flex items-center justify-between gap-2">
        {/* Hint */}
        <button
          onClick={() => setShowHint((h) => !h)}
          className="flex items-center gap-1 text-[10px] text-yellow-600 hover:text-yellow-400 transition-colors font-mono"
        >
          <Lightbulb size={10} />
          {showHint ? 'HIDE HINT' : 'HINT'}
        </button>

        <AnimatePresence>
          {showHint && puzzle && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-[10px] font-mono text-yellow-600/80 flex-1 text-center"
            >
              {puzzle.hint}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Run button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRun}
          disabled={isExecuting || isResolved}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded text-[11px] font-mono font-bold
            tracking-widest transition-all
            ${
              isResolved
                ? 'bg-green-900/40 text-green-500 cursor-not-allowed'
                : isExecuting
                ? 'bg-cyan-900/40 text-cyan-400 cursor-wait animate-pulse'
                : 'bg-cyan-600 hover:bg-cyan-500 text-black cursor-pointer'
            }
          `}
        >
          {isExecuting ? (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
              RUNNING
            </>
          ) : isResolved ? (
            '✓ EXECUTED'
          ) : (
            <>
              <ChevronRight size={12} />
              RUN ⌘↵
            </>
          )}
        </motion.button>
      </div>

      {/* Command history */}
      {commandHistory.length > 0 && (
        <div className="px-3 py-1.5 bg-gray-950 border-t border-gray-800/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[9px] text-gray-600 font-mono flex-shrink-0">HISTORY:</span>
            {commandHistory.slice(0, 5).map((cmd, i) => (
              <button
                key={i}
                onClick={() => setCode(cmd)}
                className="text-[9px] font-mono text-gray-500 hover:text-cyan-400 transition-colors bg-gray-900 px-2 py-0.5 rounded flex-shrink-0 whitespace-nowrap"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
