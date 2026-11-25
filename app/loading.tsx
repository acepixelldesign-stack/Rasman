export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="relative min-h-[calc(100dvh-var(--grid-header)-var(--grid-bottom))] w-full"
    />
  );
}
