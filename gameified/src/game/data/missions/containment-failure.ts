import { Mission, GridTile } from '@/game/types';

// ─── Grid: 6×6 hospital dataset visualization ─────────────────────────────
// Columns: patient_id | name | ward | infected_status | severity | timestamp
// Rows represent hospital records. The "infected_status" column is corrupted.

const buildGrid = (): GridTile[] => {
  const cols = ['patient_id', 'name', 'ward', 'infected_status', 'severity', 'timestamp'];
  const rows = [
    ['P-001', 'A. Chen', 'ICU-3', '???', 'HIGH', '06:14'],
    ['P-002', 'M. Park', 'Ward-7', '???', 'MED', '06:22'],
    ['P-003', 'J. Reed', 'ICU-1', '???', 'CRIT', '06:31'],
    ['P-004', 'S. Nair', 'Ward-2', '???', 'LOW', '06:45'],
    ['P-005', 'L. Osei', 'ICU-2', '???', 'HIGH', '06:58'],
    ['P-006', 'R. Vega', 'Ward-9', '???', 'MED', '07:12'],
  ];

  const tiles: GridTile[] = [];

  // Header row
  cols.forEach((col, c) => {
    tiles.push({
      id: `h-${c}`,
      row: 0,
      col: c,
      state: 'idle',
      label: col.replace('_', ' ').toUpperCase(),
      dataKey: col,
    });
  });

  // Data rows
  rows.forEach((row, r) => {
    row.forEach((val, c) => {
      tiles.push({
        id: `t-${r + 1}-${c}`,
        row: r + 1,
        col: c,
        state: c === 3 ? 'locked' : 'idle', // infected_status col is locked/corrupted
        label: val,
        dataKey: cols[c],
        value: val,
      });
    });
  });

  return tiles;
};

export const MISSION_CONTAINMENT_FAILURE: Mission = {
  id: 'containment-failure',
  title: 'CONTAINMENT FAILURE',
  subtitle: 'City Hospital Network — Node 7',
  classification: 'PRIORITY OMEGA',
  description:
    'The outbreak monitoring system at St. Elara General has gone dark. Infected status tracking has corrupted. Manual intervention required.',
  difficulty: 1,
  tags: ['python', 'pandas', 'dataframes', 'column-selection'],
  xpReward: 150,
  nextMissionId: 'signal-lost',

  objectives: [
    { id: 'obj-1', text: 'Establish contact with on-site team', completed: false },
    { id: 'obj-2', text: 'Identify corrupted data column', completed: false },
    { id: 'obj-3', text: 'Execute recovery command', completed: false },
    { id: 'obj-4', text: 'Stabilize monitoring system', completed: false },
  ],

  puzzle: {
    id: 'puzzle-cf-1',
    gridSize: 6,
    tiles: buildGrid(),
    targetTiles: ['t-1-3', 't-2-3', 't-3-3', 't-4-3', 't-5-3', 't-6-3'],
    correctCommand: "df['infected_status']",
    alternativeCommands: [
      "df['infected_status']",
      'df["infected_status"]',
      'df.infected_status',
    ],
    hint: "The dataset is a pandas DataFrame called `df`. Think about how you'd grab one column by its name.",
    context:
      'Hospital patient records are stored in a DataFrame. The infected_status column holds outbreak data — but it has been flagged as inaccessible. You need to SELECT it to unlock monitoring.',
  },

  dialogueScenes: {
    intro: {
      id: 'intro',
      nextSceneId: 'briefing',
      lines: [
        {
          id: 'intro-1',
          character: 'system',
          text: '⚠ AXIOM ALERT — PRIORITY OMEGA. Outbreak monitoring failure detected. City Hospital Network — Sector 7. Estimated data gap: 47 minutes.',
          delay: 0,
        },
        {
          id: 'intro-2',
          character: 'kael',
          text: "You just walked in the door and we already have a crisis. Good timing, Recruit.",
        },
        {
          id: 'intro-3',
          character: 'kael',
          text: "I'm Dr. Kael. I run data ops for Ω Division. The monitoring system at St. Elara just went dark. 847 patients. No live status.",
        },
        {
          id: 'intro-4',
          character: 'mira',
          text: "Mira here. Systems side. I'm seeing a corrupted column in the hospital DataFrame. The infected_status field is returning null across all records.",
        },
        {
          id: 'intro-5',
          character: 'player',
          text: "What caused it?",
        },
        {
          id: 'intro-6',
          character: 'mira',
          text: "We don't know yet. But if we don't restore the column access in the next 20 minutes, the outbreak AI will lose its tracking baseline. Cities go dark after that.",
        },
        {
          id: 'intro-7',
          character: 'kael',
          text: "The data exists. The DataFrame loaded. We just need someone to SELECT the right column and force a re-link. Can you do that?",
        },
      ],
    },
    briefing: {
      id: 'briefing',
      nextSceneId: 'puzzle',
      lines: [
        {
          id: 'brief-1',
          character: 'mira',
          text: "I'm pulling up the hospital dataset now. You'll see it in the grid on your terminal.",
        },
        {
          id: 'brief-2',
          character: 'kael',
          text: "The DataFrame is called `df`. Six columns. Six patients per visible block. The infected_status column is highlighted — locked and unreadable.",
        },
        {
          id: 'brief-3',
          character: 'kael',
          text: "In Python — with pandas — selecting a column is simple. The syntax will come to you. Think about how you'd GET a single column from a DataFrame.",
        },
        {
          id: 'brief-4',
          character: 'mira',
          text: "Terminal is live. Enter the access command when you're ready. No pressure. Just... 847 lives.",
        },
      ],
    },
    success: {
      id: 'success',
      lines: [
        {
          id: 'suc-1',
          character: 'system',
          text: '✓ Column access restored. infected_status — 847 records — LIVE. Outbreak AI re-synchronized.',
          triggerEffect: 'grid-stabilize',
        },
        {
          id: 'suc-2',
          character: 'mira',
          text: "It worked! All six wards reporting. The column is back online.",
        },
        {
          id: 'suc-3',
          character: 'kael',
          text: "Good work. You just prevented a city-wide tracking failure. And you used pandas. Welcome to Ω Division.",
        },
        {
          id: 'suc-4',
          character: 'kael',
          text: "What you used — df['column_name'] — that's column selection in pandas. Every data scientist uses it dozens of times a day. Now you've used it to save lives.",
        },
        {
          id: 'suc-5',
          character: 'unknown',
          text: ". . . Interesting. The recruit succeeded. Accelerate the second phase.",
        },
      ],
    },
    failure: {
      id: 'failure',
      lines: [
        {
          id: 'fail-1',
          character: 'system',
          text: '⚠ ACCESS DENIED. Command syntax error. Monitoring gap widening.',
        },
        {
          id: 'fail-2',
          character: 'mira',
          text: "That didn't work. Don't panic — try again. The DataFrame is `df`. You need the column named `infected_status`.",
        },
        {
          id: 'fail-3',
          character: 'kael',
          text: "Hint: In pandas, you access a column like this — df['column_name']. Replace column_name with what we need.",
        },
      ],
    },
  },
};
