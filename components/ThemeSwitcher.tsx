"use client";

import { THEMES, type ThemeId } from "@/lib/themes";

interface ThemeSwitcherProps {
  theme: ThemeId;
  onChange: (theme: ThemeId) => void;
}

export function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Theme
      </span>
      <div className="flex flex-wrap gap-2">
        {THEMES.map((option) => {
          const active = option.id === theme;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className="rounded-full border px-3 py-1.5 text-sm font-medium transition"
              style={{
                borderColor: active ? "var(--accent)" : "var(--border)",
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "var(--banner-text)" : "var(--text)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
