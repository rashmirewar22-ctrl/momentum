import { useState, useMemo } from 'react'
import { useOutletContext, Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { STATUSES } from '../data/seed'
import { priorityMap } from '../utils/format'
import { PriorityIcon, Avatar } from '../components/Glyphs'
import { LabelChips } from '../components/Pickers'
import { memberMap } from '../utils/format'
import FilterBar, { applyFilters } from '../components/FilterBar'
import Icon from '../components/Icon'

export default function BoardView() {
  const { openIssue, openCreate } = useOutletContext()
  const { issues, moveIssue } = useStore()
  const toast = useToast()
  const [filters, setFilters] = useState({ priority: null, assignee: null, label: null })
  const [dragId, setDragId] = useState(null)
  const [overCol, setOverCol] = useState(null)

  const filtered = useMemo(() => applyFilters(issues, filters), [issues, filters])

  const columns = useMemo(() => {
    return STATUSES.map((s) => ({
      ...s,
      items: filtered
        .filter((i) => i.status === s.key)
        .sort((a, b) => (priorityMap[b.priority].rank - priorityMap[a.priority].rank) || a.order - b.order)
    }))
  }, [filtered])

  function onDrop(statusKey, statusLabel) {
    if (dragId) {
      const issue = issues.find((i) => i.id === dragId)
      if (issue && issue.status !== statusKey) {
        moveIssue(dragId, statusKey, statusLabel)
        toast.success(`${dragId} → ${statusLabel}`)
      }
    }
    setDragId(null)
    setOverCol(null)
  }

  return (
    <div className="view">
      <ViewHeader title="Board" count={filtered.length} onCreate={openCreate} />
      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="board">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`bcol ${overCol === col.key ? 'over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.key) }}
            onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
            onDrop={() => onDrop(col.key, col.label)}
          >
            <div className="bcol-head">
              <span className="bcol-title">
                <span className="bcol-dot" style={{ background: col.color }} />
                {col.label}
                <span className="bcol-count">{col.items.length}</span>
              </span>
            </div>
            <div className="bcol-body">
              {col.items.map((issue) => (
                <article
                  key={issue.id}
                  className={`card ${dragId === issue.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => setDragId(issue.id)}
                  onDragEnd={() => { setDragId(null); setOverCol(null) }}
                  onClick={() => openIssue(issue.id)}
                >
                  <div className="card-top">
                    <span className="card-id mono">{issue.id}</span>
                    <PriorityIcon priority={issue.priority} />
                  </div>
                  <div className="card-title">{issue.title}</div>
                  <LabelChips labels={issue.labels} />
                  <div className="card-foot">
                    {issue.subtasks.length > 0 && (
                      <span className="card-sub"><Icon name="check" size={13} />{issue.subtasks.filter((s) => s.done).length}/{issue.subtasks.length}</span>
                    )}
                    <Avatar member={memberMap[issue.assignee]} size={22} />
                  </div>
                </article>
              ))}
              {col.items.length === 0 && <div className="bcol-empty">Drop here</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ViewHeader({ title, count, onCreate }) {
  const location = useLocation()
  const isBoard = location.pathname.endsWith('/board')
  return (
    <div className="view-head">
      <div className="view-title">
        <h1>{title}</h1>
        <span className="view-count">{count}</span>
      </div>
      <div className="view-tools">
        <div className="view-toggle">
          <Link to="/app/board" className={isBoard ? 'on' : ''}><Icon name="board" size={15} /> Board</Link>
          <Link to="/app/all" className={!isBoard ? 'on' : ''}><Icon name="list" size={15} /> List</Link>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onCreate}><Icon name="plus" size={15} /> New</button>
      </div>
    </div>
  )
}
