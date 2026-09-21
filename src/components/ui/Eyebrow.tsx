export function Eyebrow({
  children,
  className = 'text-latao',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <p className={`font-mono text-[9.5px] tracking-[0.22em] uppercase ${className}`} style={style}>
      {children}
    </p>
  )
}
