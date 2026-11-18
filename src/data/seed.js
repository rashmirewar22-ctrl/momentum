export const STATUSES = [
  { key: 'backlog', label: 'Backlog', color: 'var(--s-backlog)' },
  { key: 'todo', label: 'Todo', color: 'var(--s-todo)' },
  { key: 'progress', label: 'In Progress', color: 'var(--s-progress)' },
  { key: 'done', label: 'Done', color: 'var(--s-done)' },
  { key: 'canceled', label: 'Canceled', color: 'var(--s-canceled)' }
]

export const PRIORITIES = [
  { key: 'urgent', label: 'Urgent', rank: 4, color: 'var(--p-urgent)' },
  { key: 'high', label: 'High', rank: 3, color: 'var(--p-high)' },
  { key: 'medium', label: 'Medium', rank: 2, color: 'var(--p-med)' },
  { key: 'low', label: 'Low', rank: 1, color: 'var(--p-low)' },
  { key: 'none', label: 'No priority', rank: 0, color: 'var(--text-faint)' }
]

export const LABELS = [
  { key: 'bug', label: 'Bug', color: '#f0466e' },
  { key: 'feature', label: 'Feature', color: '#6d5efc' },
  { key: 'design', label: 'Design', color: '#ec4899' },
  { key: 'improvement', label: 'Improvement', color: '#00b8d4' },
  { key: 'docs', label: 'Docs', color: '#f59e0b' },
  { key: 'infra', label: 'Infra', color: '#22b07d' }
]

export const MEMBERS = [
  { id: 'me', name: 'You', initials: 'Yo' },
  { id: 'u1', name: 'Ava Thompson', initials: 'AT' },
  { id: 'u2', name: 'Marcus Hale', initials: 'MH' },
  { id: 'u3', name: 'Priya Nair', initials: 'PN' },
  { id: 'u4', name: 'Diego Fuentes', initials: 'DF' }
]

export const PROJECTS = [
  { id: 'web', name: 'Web App', color: '#6d5efc' },
  { id: 'api', name: 'Platform API', color: '#00b8d4' },
  { id: 'mobile', name: 'Mobile', color: '#ec4899' }
]

const raw = [
  ['Fix keyboard trap in command palette', 'bug', 'urgent', 'progress', 'me', 'web', ['When the palette is open, Tab escapes the overlay and focus lands behind it.', 'Repro: open with Cmd+K, press Tab twice.'], [['Trap focus within the dialog', true], ['Restore focus to trigger on close', false], ['Add aria-modal and role', false]]],
  ['Virtualize the issue list over 1k rows', 'improvement', 'high', 'todo', 'u1', 'web', ['List renders every row; jank starts around 800 issues. Introduce windowing.'], [['Measure baseline frame time', true], ['Add windowing', false]]],
  ['Dark mode contrast pass on badges', 'design', 'medium', 'todo', 'u3', 'web', ['Several status badges fail AA in dark mode. Audit and fix tokens.'], []],
  ['Board drag-and-drop drops card on wrong column at edges', 'bug', 'high', 'progress', 'u2', 'web', ['Dropping near a column edge sometimes assigns the neighbouring column.'], [['Reproduce at 1440px', true], ['Fix hit-testing', false]]],
  ['Persist filter + view preference per user', 'feature', 'medium', 'backlog', 'me', 'web', ['Remember the last view (board/list) and active filters across reloads.'], []],
  ['Rate-limit the search endpoint', 'infra', 'high', 'backlog', 'u4', 'api', ['Add a token bucket in front of /search to protect the DB.'], [['Choose limits', false]]],
  ['Webhook retries use fixed backoff', 'bug', 'medium', 'backlog', 'u4', 'api', ['Switch to exponential backoff with jitter.'], []],
  ['Document the public REST schema', 'docs', 'low', 'todo', 'u1', 'api', ['Publish an OpenAPI spec and a quickstart.'], []],
  ['Offline draft recovery on mobile', 'feature', 'high', 'backlog', 'u2', 'mobile', ['If the app is killed mid-compose, restore the draft on next open.'], []],
  ['Haptics on status change', 'improvement', 'low', 'done', 'u3', 'mobile', ['Light haptic tick when an issue changes status.'], [['Wire up on iOS', true], ['Wire up on Android', true]]],
  ['Command palette fuzzy ranking feels random', 'improvement', 'medium', 'progress', 'me', 'web', ['Weight title matches over description and prefer prefix hits.'], [['Add scoring function', true], ['Tune weights', false]]],
  ['Empty states for every view', 'design', 'low', 'done', 'u3', 'web', ['Backlog, My Issues and search all need friendly empty states.'], []],
  ['Add inline sub-task checklist', 'feature', 'medium', 'done', 'u1', 'web', ['Checkbox list inside the issue detail with progress count.'], [['Model', true], ['UI', true], ['Persist', true]]],
  ['Flaky test: pipeline reorder', 'bug', 'low', 'canceled', 'u2', 'web', ['Passes locally, fails in CI ~1/10. Likely a timing assumption.'], []],
  ['Session token rotation', 'infra', 'urgent', 'todo', 'u4', 'api', ['Rotate tokens on privilege change; invalidate old sessions.'], [['Spec', false]]]
]

export function seedIssues() {
  const now = Date.now()
  return raw.map((r, i) => {
    const [title, label, priority, status, assignee, project, desc, subs] = r
    return {
      id: 'MOM-' + (142 + i),
      title,
      description: desc.join('\n\n'),
      status,
      priority,
      assignee,
      labels: [label],
      project,
      subtasks: (subs || []).map((s, j) => ({ id: `st_${i}_${j}`, text: s[0], done: s[1] })),
      comments: [],
      activity: [{ id: 'a0', text: 'created the issue', who: assignee, at: now - (i + 2) * 3600000 * 9 }],
      order: i,
      createdAt: now - (i + 2) * 3600000 * 9,
      updatedAt: now - i * 3600000 * 3
    }
  })
}
