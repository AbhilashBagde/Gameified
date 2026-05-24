import { CommandResult, PuzzleConfig } from '@/game/types';

const normalize = (cmd: string) =>
  cmd.trim().replace(/\s+/g, ' ').replace(/[""'']/g, "'");

export function validateCommand(
  raw: string,
  puzzle: PuzzleConfig
): CommandResult {
  const cmd = normalize(raw);

  // Check exact / alternative matches
  const allValid = [puzzle.correctCommand, ...(puzzle.alternativeCommands ?? [])].map(
    (c) => normalize(c)
  );

  if (allValid.includes(cmd)) {
    return {
      success: true,
      output: `>>> ${raw}\n\n0    True\n1    False\n2    True\n3    True\n4    False\n5    True\nName: infected_status, dtype: bool`,
      tilesActivated: puzzle.targetTiles,
      xpGained: 50,
      effect: 'success',
    };
  }

  // Partial matches — give contextual hints
  if (/df\s*\[/.test(cmd) && !/'infected_status'/.test(cmd)) {
    return {
      success: false,
      output: `>>> ${raw}\nKeyError: Column not found. Check the column name carefully.`,
      errorMessage: "Close — you're using the right syntax. Double-check the column name: 'infected_status'.",
      effect: 'hint',
    };
  }

  if (/infected_status/.test(cmd) && !/df/.test(cmd)) {
    return {
      success: false,
      output: `>>> ${raw}\nNameError: name 'infected_status' is not defined`,
      errorMessage: "You need to reference the DataFrame. Try: df['infected_status']",
      effect: 'hint',
    };
  }

  if (/df\./.test(cmd)) {
    return {
      success: false,
      output: `>>> ${raw}\nAttributeError: Attribute access blocked on locked columns.`,
      errorMessage: "Almost — but use bracket notation for this one: df['infected_status']",
      effect: 'hint',
    };
  }

  if (cmd === '' || cmd.length < 2) {
    return {
      success: false,
      output: '',
      errorMessage: "Enter a command. The DataFrame is `df`. Try selecting the infected_status column.",
      effect: 'none',
    };
  }

  return {
    success: false,
    output: `>>> ${raw}\nSyntaxError: invalid syntax`,
    errorMessage:
      "That command wasn't recognized. Remember: df['column_name'] selects a column in pandas.",
    effect: 'error',
  };
}
