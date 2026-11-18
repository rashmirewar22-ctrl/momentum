import Menu, { MenuItem } from './Menu'
import Icon from './Icon'
import { PriorityIcon, Avatar } from './Glyphs'
import { PRIORITIES, MEMBERS, LABELS } from '../data/seed'
import { priorityMap, memberMap, labelMap } from '../utils/format'

export default function FilterBar({ filters, setFilters, right }) {
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: f[key] === value ? null : value }))
  const active = filters.priority || filters.assignee || filters.label

  return (
    <div className="filterbar">
      <div className="filter-left">
        <Menu
          width={200}
          trigger={
            <button className={`filter-chip ${filters.priority ? 'on' : ''}`}>
              {filters.priority ? <PriorityIcon priority={filters.priority} /> : <Icon name="filter" size={14} />}
              {filters.priority ? priorityMap[filters.priority].label : 'Priority'}
            </button>
          }
        >
          {(close) =>
            PRIORITIES.map((p) => (
              <MenuItem key={p.key} active={filters.priority === p.key} onClick={() => { set('priority', p.key); close() }}>
                <PriorityIcon priority={p.key} /><span>{p.label}</span>
              </MenuItem>
            ))
          }
        </Menu>

        <Menu
          width={220}
          trigger={
            <button className={`filter-chip ${filters.assignee ? 'on' : ''}`}>
              {filters.assignee ? <Avatar member={memberMap[filters.assignee]} size={18} /> : <Icon name="user" size={14} />}
              {filters.assignee ? memberMap[filters.assignee].name : 'Assignee'}
            </button>
          }
        >
          {(close) =>
            MEMBERS.map((m) => (
              <MenuItem key={m.id} active={filters.assignee === m.id} onClick={() => { set('assignee', m.id); close() }}>
                <Avatar member={m} size={20} /><span>{m.name}</span>
              </MenuItem>
            ))
          }
        </Menu>

        <Menu
          width={200}
          trigger={
            <button className={`filter-chip ${filters.label ? 'on' : ''}`}>
              {filters.label ? <span className="label-dot" style={{ background: labelMap[filters.label].color }} /> : <Icon name="tag" size={14} />}
              {filters.label ? labelMap[filters.label].label : 'Label'}
            </button>
          }
        >
          {(close) =>
            LABELS.map((l) => (
              <MenuItem key={l.key} active={filters.label === l.key} onClick={() => { set('label', l.key); close() }}>
                <span className="label-dot" style={{ background: l.color }} /><span>{l.label}</span>
              </MenuItem>
            ))
          }
        </Menu>

        {active && (
          <button className="filter-clear" onClick={() => setFilters({ priority: null, assignee: null, label: null })}>
            <Icon name="close" size={13} /> Clear
          </button>
        )}
      </div>
      <div className="filter-right">{right}</div>
    </div>
  )
}

export function applyFilters(issues, filters) {
  return issues.filter((i) => {
    if (filters.priority && i.priority !== filters.priority) return false
    if (filters.assignee && i.assignee !== filters.assignee) return false
    if (filters.label && !i.labels.includes(filters.label)) return false
    return true
  })
}
