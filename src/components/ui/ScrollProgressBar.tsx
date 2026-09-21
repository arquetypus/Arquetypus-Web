export function ScrollProgressBar({ fillPct }: { fillPct: number }) {
  return (
    <div aria-hidden className="relative mx-auto mt-5 h-[3px] w-28 overflow-hidden rounded-full bg-linha">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-latao transition-[width] duration-150 ease-out"
        style={{ width: `${fillPct}%` }}
      />
    </div>
  )
}
