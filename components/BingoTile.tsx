"use client";

import type { BoardTile } from "@/lib/bingo";

interface BingoTileProps {
  tile: BoardTile;
  marked: boolean;
  locked: boolean;
  isWinning: boolean;
  onToggle: () => void;
}

export function BingoTile({
  tile,
  marked,
  locked,
  isWinning,
  onToggle,
}: BingoTileProps) {
  const clickable = locked && !tile.isFree;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!clickable}
      aria-pressed={marked}
      aria-label={tile.label}
      className={`relative flex min-h-[4.5rem] items-center justify-center rounded-xl border px-1 py-2 text-center text-[0.65rem] leading-tight font-medium transition sm:min-h-[5.5rem] sm:px-2 sm:text-xs md:text-sm ${
        clickable ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
      } ${marked ? "border-[var(--accent)]" : "border-[var(--border)]"} ${
        isWinning ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]" : ""
      }`}
      style={{
        background: marked ? "var(--tile-marked)" : "var(--tile)",
        color: "var(--text)",
      }}
    >
      <span className={`line-clamp-4 ${marked && !tile.isFree ? "opacity-80 line-through" : ""}`}>
        {tile.label}
      </span>
      {marked && (
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
          style={{
            background: "var(--accent)",
            color: "var(--banner-text)",
          }}
        >
          ✓
        </span>
      )}
    </button>
  );
}
