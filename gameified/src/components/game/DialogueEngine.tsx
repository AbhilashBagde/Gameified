'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '@/game/data/characters';
import { Character, DialogueLine } from '@/game/types';
import { useGameStore } from '@/stores/gameStore';
import { ChevronRight } from 'lucide-react';
import { getMission } from '@/game/data/missions';

const TYPEWRITER_SPEED = 22; // ms per character

export function DialogueEngine() {
  const {
    currentMissionId,
    currentDialogueSceneId,
    currentDialogueLineIndex,
    advanceDialogue,
    currentMissionPhase,
  } = useGameStore();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState<DialogueLine | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mission = currentMissionId ? getMission(currentMissionId) : null;
  const scene =
    mission && currentDialogueSceneId != null
      ? mission.dialogueScenes[currentDialogueSceneId]
      : null;

  const line = scene?.lines[currentDialogueLineIndex] ?? null;

  // Reset typewriter when line changes
  useEffect(() => {
    if (!line) return;
    setCurrentLine(line);
    setDisplayedText('');
    setIsTyping(true);

    let i = 0;
    const tick = () => {
      if (i < line.text.length) {
        setDisplayedText(line.text.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
      } else {
        setIsTyping(false);
        if (line.delay !== undefined) {
          timerRef.current = setTimeout(() => advanceDialogue(), line.delay ?? 1500);
        }
      }
    };

    timerRef.current = setTimeout(tick, TYPEWRITER_SPEED);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [line?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback(() => {
    if (isTyping) {
      // Skip typewriter — show full text instantly
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedText(line?.text ?? '');
      setIsTyping(false);
    } else {
      advanceDialogue();
    }
  }, [isTyping, line, advanceDialogue]);

  if (!scene || !line || currentMissionPhase === 'puzzle') return null;

  const character = CHARACTERS[line.character];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={(currentDialogueSceneId ?? 'none') + currentDialogueLineIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        {/* Manga panel backdrop */}
        <div
          className="mx-auto max-w-5xl relative cursor-pointer select-none"
          onClick={handleClick}
        >
          {/* Side panel — character portrait */}
          <div className="flex gap-4 items-end">
            <CharacterPortrait character={character} isActive />

            {/* Dialogue box */}
            <div className="flex-1 relative">
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-scanlines rounded-lg" />

              <div
                className="relative rounded-lg border bg-black/90 backdrop-blur-md p-5"
                style={{ borderColor: `${character.color}44` }}
              >
                {/* Corner accents */}
                <span
                  className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl"
                  style={{ borderColor: character.color }}
                />
                <span
                  className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr"
                  style={{ borderColor: character.color }}
                />
                <span
                  className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl"
                  style={{ borderColor: character.color }}
                />
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br"
                  style={{ borderColor: character.color }}
                />

                {/* Speaker name */}
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ color: character.color }}
                  >
                    {character.name}
                  </span>
                  <span className="text-[10px] text-gray-500 tracking-widest">
                    — {character.title}
                  </span>
                </div>

                {/* Text */}
                <p className="text-sm text-gray-100 leading-relaxed font-mono min-h-[3em]">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse" />
                  )}
                </p>

                {/* Continue indicator */}
                {!isTyping && !line.delay && (
                  <div className="absolute bottom-3 right-4 flex items-center gap-1 text-gray-500 text-xs animate-bounce">
                    <ChevronRight size={12} />
                    <ChevronRight size={12} className="-ml-2" />
                  </div>
                )}
              </div>

              {/* Line counter */}
              <div className="absolute -top-5 right-0 text-[10px] text-gray-600 font-mono tracking-widest">
                {currentDialogueLineIndex + 1} / {scene.lines.length}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function CharacterPortrait({
  character,
  isActive,
}: {
  character: Character;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="hidden md:flex flex-col items-center gap-1 flex-shrink-0"
    >
      <div
        className="w-16 h-20 rounded-lg border-2 relative overflow-hidden"
        style={{
          background: character.portrait,
          borderColor: character.color,
          boxShadow: isActive ? `0 0 20px ${character.color}44` : 'none',
        }}
      >
        {/* Abstract portrait using initials */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white/80 tracking-tighter">
            {character.name.slice(0, 2)}
          </span>
        </div>
        {/* Scan line */}
        {isActive && (
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-white/30"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
      <span
        className="text-[9px] font-mono tracking-widest uppercase"
        style={{ color: character.color }}
      >
        {character.id}
      </span>
    </motion.div>
  );
}
