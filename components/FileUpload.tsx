"use client";

import { useRef, useState } from "react";

interface FileUploadProps {
  fileName: string | null;
  error: string | null;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onLoadSample?: () => void;
}

export function FileUpload({
  fileName,
  error,
  disabled = false,
  onFileSelect,
  onLoadSample,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (!disabled) {
            handleFiles(event.dataTransfer.files);
          }
        }}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
        style={{
          background: dragOver ? "var(--tile-marked)" : "var(--surface)",
          borderColor: dragOver ? "var(--accent)" : "var(--border)",
        }}
      >
        <p className="text-sm font-semibold sm:text-base">
          {fileName ? `Loaded: ${fileName}` : "A sample board is already ready to play"}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          Optional: drop a custom JSON file here if you want to swap in your own entries.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {onLoadSample && !disabled && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          >
            Load sample.json
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "#f87171", color: "#b91c1c", background: "#fef2f2" }}>
          {error}
        </p>
      )}
    </div>
  );
}
