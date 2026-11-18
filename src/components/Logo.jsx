export default function Logo({ size = 26, withText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="3" width="26" height="26" rx="7" fill="var(--brand)" />
        <path d="M9 22V10l7 7 7-7v12" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {withText && <span className="logo-text">Momentum</span>}
    </span>
  )
}
