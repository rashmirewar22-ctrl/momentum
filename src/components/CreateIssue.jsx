import { useState, useRef, useEffect } from 'react'
import Modal from './Modal'
import { StatusPicker, PriorityPicker, AssigneePicker, LabelPicker } from './Pickers'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { PROJECTS } from '../data/seed'

export default function CreateIssue({ onClose, onCreated }) {
  const { addIssue, issues } = useStore()
  const toast = useToast()
  const titleRef = useRef(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'none',
    assignee: 'me',
    project: 'web',
    labels: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit() {
    if (form.title.trim().length < 3) {
      setError('Give the issue a title (3+ characters).')
      return
    }
    addIssue({ ...form, title: form.title.trim() })
    const created = 'MOM-' + (Math.max(141, ...issues.map((i) => parseInt(i.id.split('-')[1], 10))) + 1)
    toast.success(`${created} created`)
    onCreated(created)
  }

  function onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit()
  }

  return (
    <Modal
      title="New issue"
      onClose={onClose}
      width={580}
      footer={
        <>
          <span className="foot-hint"><span className="kbd">⌘</span><span className="kbd">↵</span> to create</span>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Create issue</button>
        </>
      }
    >
      <div onKeyDown={onKeyDown}>
        <input
          ref={titleRef}
          className="create-title"
          placeholder="Issue title"
          value={form.title}
          onChange={(e) => { set('title', e.target.value); if (error) setError('') }}
        />
        {error && <div className="field-error">{error}</div>}
        <textarea
          className="create-desc"
          placeholder="Add a description…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
        <div className="create-row">
          <StatusPicker value={form.status} onChange={(v) => set('status', v)} />
          <PriorityPicker value={form.priority} onChange={(v) => set('priority', v)} />
          <AssigneePicker value={form.assignee} onChange={(v) => set('assignee', v)} />
          <LabelPicker value={form.labels} onChange={(v) => set('labels', v)} />
          <select className="mini-select" value={form.project} onChange={(e) => set('project', e.target.value)}>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  )
}
