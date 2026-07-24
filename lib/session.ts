import type { BoardState } from "./bingo";
import type { ThemeId } from "./themes";

export interface PersistedGameState {
  fileName: string;
  entries: string[];
  board: BoardState;
  locked: boolean;
  hasBingo: boolean;
  theme: ThemeId;
}

export const SESSION_STORAGE_KEY = "jcc-vc-bingo-session";

export function loadSessionState(): PersistedGameState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedGameState;
  } catch {
    return null;
  }
}

export function saveSessionState(state: PersistedGameState | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!state) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
}
