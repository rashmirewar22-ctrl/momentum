import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { STATUSES } from '../data/seed'
import { priorityMap, statusMap, memberMap, timeAgo } from '../utils/format'
import { StatusPicker, PriorityPicker } from '../components/Pickers'
import { Avatar } from '../components/Glyphs'
import { LabelChips } from '../components/Pickers'
import FilterBar, { applyFilters } from '../components/FilterBar'
import { ViewHeader } from './BoardView'
import Icon from '../components/Icon'

const scopes = {
  all: () => true,
  my: (i) => i.assignee === 'me',
  active: (i) => i.status === 'todo' || i.status === 'progress',
  backlog: (i) => i.status === 'backlog'
}

export default function ListView({ scope, title }) {
  const { openIssue, openCreate } = useOutletContext()
  const { issues, moveIssue, updateIssue } = useStore()
  const toast = useToast()
  const [filters, setFilters] = useState({ priority: null, assignee: null, label: null })
  const [collapsed, setCollapsed] = useState({})

  const base = useMemo(() => issues.filter(scopes[scope] || scopes.all), [issues, scope])
  const filtered = useMemo(() => applyFilters(base, filters), [base, filters])

  const groups = useMemo(() => {
    return STATUSES.map((s) => ({
      ...s,
      items: filtered
        .filter((i) => i.status === s.key)
        .sort((a, b) => (priorityMap[b.priority].rank - priorityMap[a.priority].rank) || b.updatedAt - a.updatedAt)
    })).filter((g) => g.items.length > 0)
  }, [filtered])

  function toggle(key) {
    setCollapsed((c) => ({ ...c, [key]: !c[key] }))
  }

  return (
    <div className="view">
      <ViewHeader title={title} count={filtered.length} onCreate={openCreate} />
      <FilterBar filters={filters} setFilters={setFilters} />

      {groups.length === 0 ? (
        <div className="empty">
          <span className="empty-ico"><Icon name="inbox" size={24} /></span>
          <h3>Nothing here yet</h3>
          <p>No issues match this view. Create one with <span className="kbd">C</span>.</p>
        </div>
      ) : (
        <div className="list">
          {groups.map((g) => (
            <div key={g.key} className="group">
              <button className="group-head" onClick={() => toggle(g.key)}>
                <Icon name="chevron" size={15} className={`group-caret ${collapsed[g.key] ? 'closed' : ''}`} />
                <span className="bcol-dot" style={{ background: g.color }} />
                <span className="group-title">{g.label}</span>
                <span className="group-count">{g.items.length}</span>
              </button>
              {!collapsed[g.key] && (
                <div className="rows">
                  {g.items.map((issue) => (
                    <div key={issue.id} className="row" onClick={() => openIssue(issue.id)}>
                      <PriorityPicker value={issue.priority} compact onChange={(p) => updateIssue(issue.id, { priority: p }, 'changed priority')} />
                      <StatusPicker value={issue.status} compact onChange={(s) => { moveIssue(issue.id, s, statusMap[s].label); toast.success(`${issue.id} → ${statusMap[s].label}`) }} />
                      <span className="row-id mono">{issue.id}</span>
                      <span className="row-title">{issue.title}</span>
                      <LabelChips labels={issue.labels} />
                      <span className="row-right">
                        <span className="row-time">{timeAgo(issue.updatedAt)}</span>
                        <Avatar member={memberMap[issue.assignee]} size={24} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
