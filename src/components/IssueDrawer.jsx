import { useState, useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { StatusPicker, PriorityPicker, AssigneePicker, LabelPicker } from './Pickers'
import { Avatar } from './Glyphs'
import Icon from './Icon'
import { statusMap, memberMap, projectMap, timeAgo } from '../utils/format'

export default function IssueDrawer({ id, onClose }) {
  const { issues, updateIssue, moveIssue, deleteIssue, toggleSub, addSub, removeSub, addComment } = useStore()
  const toast = useToast()
  const issue = issues.find((i) => i.id === id)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [sub, setSub] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (issue) {
      setTitle(issue.title)
      setDesc(issue.description)
    }
  }, [id])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!issue) return null

  const project = projectMap[issue.project]
  const doneCount = issue.subtasks.filter((s) => s.done).length

  function saveTitle() {
    const t = title.trim()
    if (t && t !== issue.title) updateIssue(issue.id, { title: t }, 'renamed the issue')
  }
  function saveDesc() {
    if (desc !== issue.description) updateIssue(issue.id, { description: desc }, 'updated the description')
  }
  function onStatus(s) {
    moveIssue(issue.id, s, statusMap[s].label)
  }
  function addSubtask(e) {
    e.preventDefault()
    if (sub.trim()) {
      addSub(issue.id, sub.trim())
      setSub('')
    }
  }
  function postComment(e) {
    e.preventDefault()
    if (comment.trim()) {
      addComment(issue.id, comment.trim())
      setComment('')
    }
  }
  function remove() {
    deleteIssue(issue.id)
    toast.info(`${issue.id} deleted`)
    onClose()
  }

  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-top">
          <div className="drawer-crumbs mono">
            <span className="proj-dot" style={{ background: project?.color }} />
            {project?.name}<span className="sep">/</span><span className="d-id">{issue.id}</span>
          </div>
          <div className="drawer-top-actions">
            <button className="icon-btn danger" onClick={remove} title="Delete"><Icon name="trash" size={16} /></button>
            <button className="icon-btn" onClick={onClose} title="Close"><Icon name="close" size={17} /></button>
          </div>
        </div>

        <div className="drawer-body">
          <div className="drawer-main">
            <input
              className="drawer-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
            />
            <textarea
              className="drawer-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={saveDesc}
              placeholder="Add a description…"
            />

            <div className="sub-head">
              <h4>Sub-tasks</h4>
              {issue.subtasks.length > 0 && (
                <span className="sub-progress">
                  <span className="sub-bar"><span style={{ width: `${(doneCount / issue.subtasks.length) * 100}%` }} /></span>
                  {doneCount}/{issue.subtasks.length}
                </span>
              )}
            </div>
            <div className="sub-list">
              {issue.subtasks.map((s) => (
                <div key={s.id} className={`sub-item ${s.done ? 'done' : ''}`}>
                  <button className="sub-check" onClick={() => toggleSub(issue.id, s.id)}>
                    {s.done && <Icon name="check" size={12} />}
                  </button>
                  <span>{s.text}</span>
                  <button className="sub-remove" onClick={() => removeSub(issue.id, s.id)}><Icon name="close" size={14} /></button>
                </div>
              ))}
            </div>
            <form className="sub-add" onSubmit={addSubtask}>
              <Icon name="plus" size={15} />
              <input placeholder="Add sub-task…" value={sub} onChange={(e) => setSub(e.target.value)} />
            </form>

            <h4 style={{ marginTop: 26 }}>Comments</h4>
            <div className="comments">
              {(issue.comments || []).length === 0 && <p className="muted" style={{ fontSize: 13.5 }}>No comments yet.</p>}
              {(issue.comments || []).map((c) => (
                <div key={c.id} className="comment">
                  <Avatar member={memberMap[c.who]} size={28} />
                  <div className="comment-body">
                    <div className="comment-head"><strong>{memberMap[c.who]?.name || 'You'}</strong><span>{timeAgo(c.at)}</span></div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form className="comment-add" onSubmit={postComment}>
              <input placeholder="Leave a comment…" value={comment} onChange={(e) => setComment(e.target.value)} />
              <button className="btn btn-primary btn-sm" type="submit">Comment</button>
            </form>
          </div>

          <div className="drawer-side">
            <div className="side-prop">
              <label>Status</label>
              <StatusPicker value={issue.status} onChange={onStatus} />
            </div>
            <div className="side-prop">
              <label>Priority</label>
              <PriorityPicker value={issue.priority} onChange={(p) => updateIssue(issue.id, { priority: p }, 'changed priority')} />
            </div>
            <div className="side-prop">
              <label>Assignee</label>
              <AssigneePicker value={issue.assignee} onChange={(a) => updateIssue(issue.id, { assignee: a }, 'reassigned')} />
            </div>
            <div className="side-prop">
              <label>Labels</label>
              <LabelPicker value={issue.labels} onChange={(l) => updateIssue(issue.id, { labels: l }, 'updated labels')} />
            </div>

            <hr className="divider" style={{ margin: '18px 0' }} />

            <div className="side-prop">
              <label>Activity</label>
              <div className="activity-log">
                {issue.activity.map((a) => (
                  <div key={a.id} className="act-row">
                    <Avatar member={memberMap[a.who]} size={20} />
                    <span><strong>{memberMap[a.who]?.name || 'You'}</strong> {a.text}</span>
                    <em>{timeAgo(a.at)}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
