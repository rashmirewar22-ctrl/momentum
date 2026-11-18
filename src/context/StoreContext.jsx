import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { seedIssues } from '../data/seed'

const StoreContext = createContext(null)
const KEY = 'mm.issues'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return seedIssues()
}

function nextId(issues) {
  const nums = issues.map((i) => parseInt(i.id.split('-')[1], 10)).filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 141
  return 'MOM-' + (max + 1)
}

function touch(issue, text, who = 'me') {
  const entry = { id: 'a_' + Date.now().toString(36), text, who, at: Date.now() }
  return { ...issue, updatedAt: Date.now(), activity: [entry, ...(issue.activity || [])] }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const issue = {
        id: nextId(state),
        title: action.data.title,
        description: action.data.description || '',
        status: action.data.status || 'backlog',
        priority: action.data.priority || 'none',
        assignee: action.data.assignee || 'me',
        labels: action.data.labels || [],
        project: action.data.project || 'web',
        subtasks: [],
        comments: [],
        activity: [{ id: 'a0', text: 'created the issue', who: 'me', at: Date.now() }],
        order: state.length,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      return [issue, ...state]
    }
    case 'update':
      return state.map((i) => (i.id === action.id ? touch({ ...i, ...action.patch }, action.note || 'updated the issue') : i))
    case 'move':
      return state.map((i) => (i.id === action.id ? touch({ ...i, status: action.status }, `moved to ${action.statusLabel}`) : i))
    case 'delete':
      return state.filter((i) => i.id !== action.id)
    case 'toggleSub':
      return state.map((i) =>
        i.id === action.id
          ? { ...i, updatedAt: Date.now(), subtasks: i.subtasks.map((s) => (s.id === action.subId ? { ...s, done: !s.done } : s)) }
          : i
      )
    case 'addSub':
      return state.map((i) =>
        i.id === action.id
          ? { ...i, updatedAt: Date.now(), subtasks: [...i.subtasks, { id: 'st_' + Date.now().toString(36), text: action.text, done: false }] }
          : i
      )
    case 'removeSub':
      return state.map((i) =>
        i.id === action.id ? { ...i, subtasks: i.subtasks.filter((s) => s.id !== action.subId) } : i
      )
    case 'comment':
      return state.map((i) =>
        i.id === action.id
          ? { ...i, updatedAt: Date.now(), comments: [...(i.comments || []), { id: 'cm_' + Date.now().toString(36), text: action.text, who: 'me', at: Date.now() }] }
          : i
      )
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [issues, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(issues))
    } catch {
      // ignore
    }
  }, [issues])

  const api = useMemo(
    () => ({
      issues,
      addIssue: (data) => dispatch({ type: 'add', data }),
      updateIssue: (id, patch, note) => dispatch({ type: 'update', id, patch, note }),
      moveIssue: (id, status, statusLabel) => dispatch({ type: 'move', id, status, statusLabel }),
      deleteIssue: (id) => dispatch({ type: 'delete', id }),
      toggleSub: (id, subId) => dispatch({ type: 'toggleSub', id, subId }),
      addSub: (id, text) => dispatch({ type: 'addSub', id, text }),
      removeSub: (id, subId) => dispatch({ type: 'removeSub', id, subId }),
      addComment: (id, text) => dispatch({ type: 'comment', id, text })
    }),
    [issues]
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
