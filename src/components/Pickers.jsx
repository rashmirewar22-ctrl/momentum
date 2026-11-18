import Menu, { MenuItem } from './Menu'
import Icon from './Icon'
import { StatusIcon, PriorityIcon, Avatar } from './Glyphs'
import { STATUSES, PRIORITIES, LABELS, MEMBERS } from '../data/seed'
import { statusMap, priorityMap, memberMap, labelMap } from '../utils/format'

export function StatusPicker({ value, onChange, compact }) {
  const s = statusMap[value]
  return (
    <Menu
      width={210}
      trigger={
        <button className={`pick ${compact ? 'compact' : ''}`}>
          <StatusIcon status={value} />
          {!compact && <span>{s?.label}</span>}
        </button>
      }
    >
      {(close) =>
        STATUSES.map((opt) => (
          <MenuItem key={opt.key} active={opt.key === value} onClick={() => { onChange(opt.key); close() }}>
            <StatusIcon status={opt.key} />
            <span>{opt.label}</span>
            {opt.key === value && <Icon name="check" size={14} className="pick-check" />}
          </MenuItem>
        ))
      }
    </Menu>
  )
}

export function PriorityPicker({ value, onChange, compact }) {
  const p = priorityMap[value]
  return (
    <Menu
      width={200}
      trigger={
        <button className={`pick ${compact ? 'compact' : ''}`}>
          <PriorityIcon priority={value} />
          {!compact && <span>{p?.label}</span>}
        </button>
      }
    >
      {(close) =>
        PRIORITIES.map((opt) => (
          <MenuItem key={opt.key} active={opt.key === value} onClick={() => { onChange(opt.key); close() }}>
            <PriorityIcon priority={opt.key} />
            <span>{opt.label}</span>
            {opt.key === value && <Icon name="check" size={14} className="pick-check" />}
          </MenuItem>
        ))
      }
    </Menu>
  )
}

export function AssigneePicker({ value, onChange, compact }) {
  const m = memberMap[value]
  return (
    <Menu
      width={220}
      trigger={
        <button className={`pick ${compact ? 'compact' : ''}`}>
          <Avatar member={m} size={compact ? 22 : 20} />
          {!compact && <span>{m?.name}</span>}
        </button>
      }
    >
      {(close) =>
        MEMBERS.map((opt) => (
          <MenuItem key={opt.id} active={opt.id === value} onClick={() => { onChange(opt.id); close() }}>
            <Avatar member={opt} size={20} />
            <span>{opt.name}</span>
            {opt.id === value && <Icon name="check" size={14} className="pick-check" />}
          </MenuItem>
        ))
      }
    </Menu>
  )
}

export function LabelPicker({ value = [], onChange }) {
  function toggle(key) {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key])
  }
  return (
    <Menu
      width={210}
      trigger={
        <button className="pick">
          <Icon name="tag" size={15} />
          <span>{value.length ? `${value.length} label${value.length > 1 ? 's' : ''}` : 'Labels'}</span>
        </button>
      }
    >
      {() =>
        LABELS.map((opt) => (
          <MenuItem key={opt.key} active={value.includes(opt.key)} onClick={() => toggle(opt.key)}>
            <span className="label-dot" style={{ background: opt.color }} />
            <span>{opt.label}</span>
            {value.includes(opt.key) && <Icon name="check" size={14} className="pick-check" />}
          </MenuItem>
        ))
      }
    </Menu>
  )
}

export function LabelChips({ labels = [] }) {
  if (!labels.length) return null
  return (
    <span className="chips">
      {labels.map((k) => {
        const l = labelMap[k]
        if (!l) return null
        return (
          <span key={k} className="chip" style={{ color: l.color, borderColor: l.color }}>
            <span className="label-dot" style={{ background: l.color }} />
            {l.label}
          </span>
        )
      })}
    </span>
  )
}
