export type ThemeId = "mint" | "dark" | "white" | "pink" | "ocean";

export interface ThemeOption {
  id: ThemeId;
  label: string;
}

export const THEMES: ThemeOption[] = [
  { id: "mint", label: "Mint" },
  { id: "dark", label: "Dark" },
  { id: "white", label: "White" },
  { id: "pink", label: "Pink" },
  { id: "ocean", label: "Ocean" },
];

export const DEFAULT_THEME: ThemeId = "mint";
export const THEME_STORAGE_KEY = "jcc-vc-bingo-theme";

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
}

export function loadStoredTheme(): ThemeId {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && THEMES.some((theme) => theme.id === stored)) {
    return stored as ThemeId;
  }

  return DEFAULT_THEME;
}

export function storeTheme(theme: ThemeId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
