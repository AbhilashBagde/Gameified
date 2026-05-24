// ─── Core Game Types ───────────────────────────────────────────────────────

export type CharacterId = 'player' | 'kael' | 'mira' | 'system' | 'unknown';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  portrait: string; // CSS gradient or image path
  color: string;    // accent color for UI
}

export interface DialogueLine {
  id: string;
  character: CharacterId;
  text: string;
  delay?: number;        // ms before auto-advance (undefined = manual)
  choices?: DialogueChoice[];
  triggerEffect?: string; // game effect to trigger after this line
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextDialogueId: string;
  effect?: string;
}

export interface DialogueScene {
  id: string;
  lines: DialogueLine[];
  nextSceneId?: string;
}

// ─── Puzzle System ─────────────────────────────────────────────────────────

export type TileState = 'idle' | 'active' | 'correct' | 'error' | 'locked' | 'scanning';

export interface GridTile {
  id: string;
  row: number;
  col: number;
  state: TileState;
  label?: string;
  dataKey?: string; // pandas column key this tile represents
  value?: string | number;
}

export interface PuzzleConfig {
  id: string;
  gridSize: number; // 6 for 6x6
  tiles: GridTile[];
  targetTiles: string[]; // tile ids that must be activated
  correctCommand: string;
  alternativeCommands?: string[];
  hint: string;
  context: string; // what the puzzle represents
}

// ─── Mission System ────────────────────────────────────────────────────────

export type MissionStatus = 'locked' | 'active' | 'completed' | 'failed';
export type MissionPhase = 'briefing' | 'investigation' | 'puzzle' | 'resolution' | 'complete';

export interface MissionObjective {
  id: string;
  text: string;
  completed: boolean;
  optional?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  classification: string; // "TOP SECRET" / "URGENT" etc
  description: string;
  objectives: MissionObjective[];
  dialogueScenes: Record<string, DialogueScene>;
  puzzle: PuzzleConfig;
  xpReward: number;
  nextMissionId?: string;
  tags: string[]; // e.g. ['python', 'pandas', 'data-engineering']
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// ─── Player State ──────────────────────────────────────────────────────────

export interface PlayerProfile {
  name: string;
  codename: string;
  xp: number;
  level: number;
  completedMissions: string[];
  failedMissions: string[];
  unlockedConcepts: string[];
  badges: string[];
  joinedAt: number; // timestamp
}

export type GamePhase = 'home' | 'login' | 'hub' | 'mission' | 'cutscene';

export interface GameState {
  phase: GamePhase;
  currentMissionId: string | null;
  currentMissionPhase: MissionPhase;
  currentDialogueSceneId: string | null;
  currentDialogueLineIndex: number;
  player: PlayerProfile;
  grid: GridTile[];
  commandHistory: string[];
  lastCommandResult: CommandResult | null;
  alertLevel: 'nominal' | 'elevated' | 'critical' | 'catastrophic';
}

// ─── Command Validation ────────────────────────────────────────────────────

export interface CommandResult {
  success: boolean;
  output: string;
  errorMessage?: string;
  tilesActivated?: string[];
  xpGained?: number;
  effect?: string;
}

export interface ValidationRule {
  pattern: RegExp;
  description: string;
  partial?: boolean; // true = partial credit / hint
}
