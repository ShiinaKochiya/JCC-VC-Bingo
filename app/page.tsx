"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BingoBoard } from "@/components/BingoBoard";
import { CongratsBanner } from "@/components/CongratsBanner";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Toolbar } from "@/components/Toolbar";
import entriesData from "@/lib/entries.json";
import {
  createBoard,
  createLockedMarkedState,
  getWinningLineIndexes,
  hasBingo,
  parseBingoJson,
  toggleTileMark,
  type BoardState,
} from "@/lib/bingo";
import { exportBoardAsPng } from "@/lib/exportBoard";
import { loadSessionState, saveSessionState } from "@/lib/session";
import {
  applyTheme,
  DEFAULT_THEME,
  loadStoredTheme,
  storeTheme,
  type ThemeId,
} from "@/lib/themes";

export default function HomePage() {
  const boardExportRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [fileName, setFileName] = useState<string | null>(null);
  const [entries, setEntries] = useState<string[] | null>(null);
  const [board, setBoard] = useState<BoardState | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const initializeBoard = useCallback(
    (entriesData: string[], sourceName: string) => {
      setError(null);
      setFileName(sourceName);
      setEntries(entriesData);
      setBoard(createBoard(entriesData));
      setLocked(false);
      setHasWon(false);
      setBannerDismissed(false);
    },
    [],
  );

  const handleLoadEntries = useCallback(() => {
    const result = parseBingoJson(JSON.stringify(entriesData));

    if (!result.ok) {
      setError(result.error);
      return;
    }

    initializeBoard(result.data.entries, "entries.json");
  }, [initializeBoard]);

  useEffect(() => {
    const storedTheme = loadStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);

    const session = loadSessionState();
    if (session) {
      setFileName(session.fileName);
      setEntries(session.entries);
      setBoard(session.board);
      setLocked(session.locked);
      setHasWon(session.hasBingo);
      setTheme(session.theme);
      applyTheme(session.theme);
    } else {
      handleLoadEntries();
    }

    setHydrated(true);
  }, [handleLoadEntries]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!entries || !board) {
      saveSessionState(null);
      return;
    }

    saveSessionState({
      fileName: fileName ?? "entries.json",
      entries,
      board,
      locked,
      hasBingo: hasWon,
      theme,
    });
  }, [hydrated, fileName, entries, board, locked, hasWon, theme]);

  const winningLine =
    board && locked ? getWinningLineIndexes(board.marked) : [];

  const handleThemeChange = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  };

  const handleReshuffle = () => {
    if (!entries) {
      return;
    }

    setBoard(createBoard(entries));
    setHasWon(false);
    setBannerDismissed(false);
  };

  const handleLock = () => {
    if (!board) {
      return;
    }

    setLocked(true);
    setBoard({
      ...board,
      marked: createLockedMarkedState(board),
    });
  };

  const handleToggle = (index: number) => {
    if (!board || !locked) {
      return;
    }

    const tile = board.tiles[index];
    const nextMarked = toggleTileMark(board.marked, index, tile, locked);
    const nextBoard = { ...board, marked: nextMarked };

    setBoard(nextBoard);

    if (hasBingo(nextMarked)) {
      setHasWon(true);
      setBannerDismissed(false);
    } else {
      setHasWon(false);
    }
  };

  const handleExport = async () => {
    if (!boardExportRef.current) {
      return;
    }

    setExporting(true);
    try {
      await exportBoardAsPng(boardExportRef.current);
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    if (!entries) {
      return;
    }

    setLocked(false);
    setBoard(createBoard(entries));
    setHasWon(false);
    setBannerDismissed(false);
  };

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <CongratsBanner
        visible={hasWon && !bannerDismissed}
        onDismiss={() => setBannerDismissed(true)}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">JCC VC Bingo</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              A ready-made bingo board loads automatically from the local entries file.
            </p>
          </div>
          <ThemeSwitcher theme={theme} onChange={handleThemeChange} />
        </header>

        {error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {board && (
          <>
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium">
                {locked
                  ? "Board locked — click tiles to mark them."
                  : "Preview your board, then lock it when ready."}
              </p>
              {locked && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Get 5 in a row (row, column, or diagonal) to win.
                </p>
              )}
            </div>

            <BingoBoard
              board={board}
              locked={locked}
              winningLine={winningLine}
              onToggle={handleToggle}
              exportRef={boardExportRef}
            />

            <Toolbar
              locked={locked}
              hasBoard={Boolean(board)}
              onReshuffle={handleReshuffle}
              onLock={handleLock}
              onExport={handleExport}
              onReset={handleReset}
              exporting={exporting}
            />
          </>
        )}
      </div>
    </main>
  );
}
