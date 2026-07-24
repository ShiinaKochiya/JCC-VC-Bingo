export const BOARD_SIZE = 5;
export const FREE_INDEX = 12;
export const FREE_LABEL = "Free Tile";

export interface BingoData {
  entries: string[];
}

export interface BoardTile {
  index: number;
  label: string;
  isFree: boolean;
}

export interface BoardState {
  tiles: BoardTile[];
  marked: boolean[];
}

export type ValidationResult =
  | { ok: true; data: BingoData }
  | { ok: false; error: string };

const WINNING_LINES: number[][] = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export function normalizeEntries(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof raw !== "object" || raw === null) {
    return [];
  }

  const entries = (raw as { entries?: unknown }).entries;
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.filter((entry): entry is string => typeof entry === "string");
}

export function validateBingoData(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "JSON must be an object with an entries array." };
  }

  const entries = (raw as { entries?: unknown }).entries;

  if (!Array.isArray(entries)) {
    return { ok: false, error: "Missing or invalid entries array." };
  }

  const strings = entries.filter((entry): entry is string => typeof entry === "string");

  if (strings.length !== entries.length) {
    return { ok: false, error: "All entries must be strings." };
  }

  if (strings.length < 24) {
    return {
      ok: false,
      error: `Need at least 24 entries (found ${strings.length}).`,
    };
  }

  return { ok: true, data: { entries: strings } };
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomEntries(pool: string[], count = 24): string[] {
  if (pool.length <= count) {
    return shuffle(pool);
  }

  return shuffle(pool).slice(0, count);
}

export function createBoard(entries: string[]): BoardState {
  const selected = pickRandomEntries(entries, 24);
  const shuffled = shuffle(selected);
  const tiles: BoardTile[] = [];
  let entryIndex = 0;

  for (let index = 0; index < BOARD_SIZE * BOARD_SIZE; index += 1) {
    if (index === FREE_INDEX) {
      tiles.push({ index, label: FREE_LABEL, isFree: true });
    } else {
      tiles.push({
        index,
        label: shuffled[entryIndex],
        isFree: false,
      });
      entryIndex += 1;
    }
  }

  return {
    tiles,
    marked: Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => false),
  };
}

export function createLockedMarkedState(board: BoardState): boolean[] {
  return board.marked.map((marked, index) =>
    board.tiles[index]?.isFree ? true : marked,
  );
}

export function toggleTileMark(
  marked: boolean[],
  index: number,
  tile: BoardTile,
  locked: boolean,
): boolean[] {
  if (!locked || tile.isFree) {
    return marked;
  }

  const next = [...marked];
  next[index] = !next[index];
  return next;
}

export function hasBingo(marked: boolean[]): boolean {
  return WINNING_LINES.some((line) => line.every((index) => marked[index]));
}

export function getWinningLineIndexes(marked: boolean[]): number[] {
  const winningLine = WINNING_LINES.find((line) =>
    line.every((index) => marked[index]),
  );
  return winningLine ?? [];
}

export function parseBingoJson(text: string): ValidationResult {
  try {
    const parsed: unknown = JSON.parse(text);
    return validateBingoData(parsed);
  } catch {
    return { ok: false, error: "Invalid JSON file." };
  }
}
