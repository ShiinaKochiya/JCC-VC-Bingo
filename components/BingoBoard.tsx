"use client";

import { useRef } from "react";
import type { BoardState } from "@/lib/bingo";
import { BingoTile } from "./BingoTile";

interface BingoBoardProps {
  board: BoardState;
  locked: boolean;
  winningLine: number[];
  onToggle: (index: number) => void;
  exportRef?: React.RefObject<HTMLDivElement | null>;
}

export function BingoBoard({
  board,
  locked,
  winningLine,
  onToggle,
  exportRef,
}: BingoBoardProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const boardRef = exportRef ?? internalRef;

  return (
    <div
      ref={boardRef}
      className={`mx-auto grid w-full max-w-3xl grid-cols-5 gap-2 rounded-2xl border p-3 sm:gap-3 sm:p-4 ${
        locked ? "border-[var(--accent)] shadow-lg" : "border-[var(--border)]"
      }`}
      style={{
        background: "var(--surface)",
        boxShadow: locked ? "0 12px 40px var(--shadow)" : undefined,
      }}
    >
      {board.tiles.map((tile) => (
        <BingoTile
          key={tile.index}
          tile={tile}
          marked={board.marked[tile.index]}
          locked={locked}
          isWinning={winningLine.includes(tile.index)}
          onToggle={() => onToggle(tile.index)}
        />
      ))}
    </div>
  );
}
