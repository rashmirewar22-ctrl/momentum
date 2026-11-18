import { statusMap, priorityMap } from '../utils/format'

export function StatusIcon({ status, size = 15 }) {
  const color = statusMap[status]?.color || 'var(--text-faint)'
  const common = { width: size, height: size, viewBox: '0 0 16 16' }
  if (status === 'backlog') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.2" fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="2.6 2.4" />
      </svg>
    )
  }
  if (status === 'todo') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.2" fill="none" stroke={color} strokeWidth="1.6" />
      </svg>
    )
  }
  if (status === 'progress') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.2" fill="none" stroke={color} strokeWidth="1.6" />
        <path d="M8 8 V2.3 A5.7 5.7 0 0 1 13 8 Z" fill={color} />
      </svg>
    )
  }
  if (status === 'done') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="7" fill={color} />
        <path d="M5 8.2l2 2 4-4.2" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="8" cy="8" r="7" fill={color} opacity="0.85" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PriorityIcon({ priority, size = 15 }) {
  const color = priorityMap[priority]?.color || 'var(--text-faint)'
  if (priority === 'urgent') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        <rect x="1.5" y="1.5" width="13" height="13" rx="3" fill={color} />
        <rect x="7" y="4" width="2" height="5" rx="1" fill="#fff" />
        <rect x="7" y="10.5" width="2" height="2" rx="1" fill="#fff" />
      </svg>
    )
  }
  const levels = { none: 0, low: 1, medium: 2, high: 3 }
  const active = levels[priority] ?? 0
  const bars = [
    { x: 2, h: 5, y: 9 },
    { x: 6.5, h: 9, y: 5 },
    { x: 11, h: 13, y: 1 }
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width="3"
          height={b.h}
          rx="1"
          fill={i < active ? color : 'var(--border-strong)'}
        />
      ))}
    </svg>
  )
}

export function Avatar({ member, size = 22 }) {
  const name = member?.name || '?'
  const initials = member?.initials || name.slice(0, 2).toUpperCase()
  let h = 0
  const palette = ['#6d5efc', '#00b8d4', '#ec4899', '#f59e0b', '#22b07d', '#f0466e']
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % palette.length
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, background: palette[h] }}
      title={name}
    >
      {initials}
    </span>
  )
}
