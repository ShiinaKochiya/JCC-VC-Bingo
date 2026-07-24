"use client";

interface CongratsBannerProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CongratsBanner({ visible, onDismiss }: CongratsBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="animate-fade-in-down pointer-events-auto relative flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg"
        style={{
          background: "var(--banner-bg)",
          color: "var(--banner-text)",
        }}
      >
        <p className="text-base font-bold sm:text-lg">Bingo! You got 5 in a row!</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="rounded-full px-2 py-1 text-lg leading-none opacity-80 transition hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
