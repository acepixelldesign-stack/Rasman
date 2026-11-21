export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="relative min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none fixed top-[var(--grid-header)] start-[var(--grid-rail)] end-[var(--grid-rail)] z-30 h-[1.5px] animate-pulse bg-[var(--brand-primary)]/50"
      />
    </div>
  );
}
