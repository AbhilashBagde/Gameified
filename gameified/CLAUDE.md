# Axiom Protocol — Omega Division

Narrative puzzle game that teaches Python/DS/ML/AI through cyberpunk storytelling.

## Tech Stack
- Next.js 16 App Router (Turbopack), TypeScript, TailwindCSS 4
- Framer Motion (animations), Zustand (state), Monaco Editor (code input)
- shadcn/ui components

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   └── page.tsx            # Phase router → HomeScreen/LoginScreen/HubScreen/MissionScreen
├── game/
│   ├── types/index.ts      # All TypeScript types (Mission, DialogueScene, GridTile, etc.)
│   ├── data/
│   │   ├── characters.ts   # Character definitions with portraits/colors
│   │   └── missions/       # One file per mission
│   │       ├── index.ts
│   │       └── containment-failure.ts   # Mission 1 — pandas df['col'] selection
│   └── engine/
│       ├── commandValidator.ts   # Python command validation (no backend, pure regex)
│       └── xpSystem.ts          # XP, levels, rank names
├── stores/
│   └── gameStore.ts        # Zustand store (persisted to localStorage)
└── components/game/
    ├── HomeScreen.tsx       # Landing page with animated ticker
    ├── LoginScreen.tsx      # Identity/oath flow
    ├── HubScreen.tsx        # Mission select + learning paths
    ├── MissionScreen.tsx    # Main game wrapper
    ├── DialogueEngine.tsx   # Typewriter dialogue system
    ├── PuzzleGrid.tsx       # 6×6 DataFrame visualization
    ├── CodeTerminal.tsx     # Monaco editor + command validation
    ├── HUD.tsx              # Top bar, objectives sidebar
    └── MissionComplete.tsx  # XP reward + concept debrief
```

## Dev Commands
```bash
npm run dev      # Start dev server on :3000
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type check only
```

## Adding a New Mission

1. Create `src/game/data/missions/my-mission.ts` — implement `Mission` type
2. Add to `src/game/data/missions/index.ts` `ALL_MISSIONS` record
3. Define `dialogueScenes`, `puzzle`, `objectives`, `tags`
4. Command validation is purely client-side in `commandValidator.ts` — extend patterns there

## Adding New Commands / Concepts

In `commandValidator.ts`:
- Add regex patterns to detect partial/full matches
- Return `CommandResult` with `success`, `output`, `tilesActivated`, `xpGained`
- Grid tiles activate based on `PuzzleConfig.targetTiles` ids

## Game Flow (State Machine)

```
home → login → hub → mission
                        ├── briefing (dialogue: intro → briefing → puzzle)
                        ├── puzzle (grid + terminal active)
                        ├── resolution (success dialogue)
                        └── complete (MissionComplete modal)
```

## Key Design Rules
- Story dialogue before any puzzle
- Commands are 1-liner, satisfying, immediately rewarded
- No theory dumps — concepts emerge through debrief after success
- `alertLevel` in store drives ambient UI urgency

## Future Paths to Build
- `signal-lost` — numpy arrays (Mission 2)
- `zero-protocol` — sklearn classification (Mission 3)
- `neural-breach` — LLM prompt engineering (Mission 4)
- `mcp-override` — MCP tool calling (Mission 5)
