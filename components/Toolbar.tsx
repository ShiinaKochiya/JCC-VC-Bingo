"use client";

interface ToolbarProps {
  locked: boolean;
  hasBoard: boolean;
  onReshuffle: () => void;
  onLock: () => void;
  onExport: () => void;
  onReset: () => void;
  exporting?: boolean;
}

export function Toolbar({
  locked,
  hasBoard,
  onReshuffle,
  onLock,
  onExport,
  onReset,
  exporting = false,
}: ToolbarProps) {
  const buttonClass =
    "rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {!locked && (
        <button
          type="button"
          onClick={onReshuffle}
          disabled={!hasBoard}
          className={buttonClass}
          style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          Reshuffle
        </button>
      )}

      {!locked ? (
        <button
          type="button"
          onClick={onLock}
          disabled={!hasBoard}
          className={buttonClass}
          style={{
            background: "var(--accent)",
            color: "var(--banner-text)",
          }}
        >
          Lock Board
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onExport}
            disabled={!hasBoard || exporting}
            className={buttonClass}
            style={{
              background: "var(--accent)",
              color: "var(--banner-text)",
            }}
          >
            {exporting ? "Exporting..." : "Export PNG"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className={buttonClass}
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            Unlock / New Game
          </button>
        </>
      )}
    </div>
  );
}
