export function Eyebrow({
  children,
  className = 'text-latao',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={`font-mono text-[9.5px] tracking-[0.22em] uppercase ${className}`}>
      {children}
    </p>
  )
}
