import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import { fuzzyScore } from '../utils/format'
import { StatusIcon, PriorityIcon } from './Glyphs'
import Icon from './Icon'

export default function CommandPalette({ onClose, onOpenIssue, onCreate }) {
  const { issues } = useStore()
  const { toggle } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const actions = useMemo(
    () => [
      { id: 'new', kind: 'action', label: 'Create new issue', hint: 'C', icon: 'plus', run: onCreate },
      { id: 'board', kind: 'action', label: 'Go to Board', icon: 'board', run: () => { navigate('/app/board'); onClose() } },
      { id: 'my', kind: 'action', label: 'Go to My issues', icon: 'user', run: () => { navigate('/app/my'); onClose() } },
      { id: 'all', kind: 'action', label: 'Go to All issues', icon: 'list', run: () => { navigate('/app/all'); onClose() } },
      { id: 'backlog', kind: 'action', label: 'Go to Backlog', icon: 'inbox', run: () => { navigate('/app/backlog'); onClose() } },
      { id: 'theme', kind: 'action', label: 'Toggle theme', icon: 'moon', run: () => { toggle(); onClose() } }
    ],
    [navigate, onClose, onCreate, toggle]
  )

  const results = useMemo(() => {
    const q = query.trim()
    const act = actions
      .map((a) => ({ item: a, score: q ? fuzzyScore(q, a.label) : 100 }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item)

    const iss = issues
      .map((i) => {
        const score = q ? Math.max(fuzzyScore(q, i.title), fuzzyScore(q, i.id) + 50) : i.updatedAt / 1e12
        return { item: i, score }
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, q ? 8 : 6)
      .map((r) => ({ ...r.item, kind: 'issue' }))

    return [...act, ...iss]
  }, [query, issues, actions])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function run(item) {
    if (item.kind === 'issue') onOpenIssue(item.id)
    else item.run()
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) run(results[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const firstIssueIdx = results.findIndex((r) => r.kind === 'issue')

  return (
    <div className="overlay palette-overlay" onMouseDown={onClose}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="palette-input">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search issues or run a command…"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="palette-list" ref={listRef}>
          {results.length === 0 && <div className="palette-empty">No matches for “{query}”</div>}
          {results.map((item, idx) => (
            <div key={item.kind === 'issue' ? item.id : item.id}>
              {idx === 0 && item.kind === 'action' && <div className="palette-group">Actions</div>}
              {idx === firstIssueIdx && firstIssueIdx > -1 && <div className="palette-group">Issues</div>}
              <button
                data-idx={idx}
                className={`palette-item ${idx === active ? 'active' : ''}`}
                onMouseEnter={() => setActive(idx)}
                onClick={() => run(item)}
              >
                {item.kind === 'issue' ? (
                  <>
                    <StatusIcon status={item.status} />
                    <span className="pi-id mono">{item.id}</span>
                    <span className="pi-title">{item.title}</span>
                    <PriorityIcon priority={item.priority} />
                  </>
                ) : (
                  <>
                    <span className="pi-ico"><Icon name={item.icon} size={16} /></span>
                    <span className="pi-title">{item.label}</span>
                    {item.hint && <span className="kbd">{item.hint}</span>}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="palette-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  )
}
