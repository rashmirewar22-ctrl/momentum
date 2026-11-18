import { STATUSES, PRIORITIES, LABELS, MEMBERS, PROJECTS } from '../data/seed'

const index = (arr) => Object.fromEntries(arr.map((x) => [x.key || x.id, x]))

export const statusMap = index(STATUSES)
export const priorityMap = index(PRIORITIES)
export const labelMap = index(LABELS)
export const memberMap = index(MEMBERS)
export const projectMap = index(PROJECTS)

export function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hours = Math.floor(mins / 60)
  if (hours < 24) return hours + 'h ago'
  const days = Math.floor(hours / 24)
  if (days < 30) return days + 'd ago'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const avatarPalette = ['#6d5efc', '#00b8d4', '#ec4899', '#f59e0b', '#22b07d', '#f0466e']

export function avatarColor(seed) {
  let h = 0
  for (let i = 0; i < (seed || '').length; i++) h = (h + seed.charCodeAt(i) * (i + 1)) % avatarPalette.length
  return avatarPalette[h]
}

export function fuzzyScore(query, text) {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t === q) return 1000
  if (t.startsWith(q)) return 600
  const idx = t.indexOf(q)
  if (idx >= 0) return 400 - idx
  let qi = 0
  let score = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score += 1
      qi++
    }
  }
  return qi === q.length ? score : -1
}
