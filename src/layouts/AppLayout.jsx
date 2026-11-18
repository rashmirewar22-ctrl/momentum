import { useState, useRef, useCallback } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../context/ToastContext'
import { useHotkeys } from '../hooks/useHotkeys'
import { PROJECTS } from '../data/seed'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import ThemeToggle from '../components/ThemeToggle'
import { Avatar } from '../components/Glyphs'
import CommandPalette from '../components/CommandPalette'
import CreateIssue from '../components/CreateIssue'
import IssueDrawer from '../components/IssueDrawer'
import '../pages/app.css'

const views = [
  { to: '/app/my', label: 'My issues', icon: 'user' },
  { to: '/app/board', label: 'Board', icon: 'board' },
  { to: '/app/active', label: 'Active', icon: 'bolt' },
  { to: '/app/all', label: 'All issues', icon: 'list' },
  { to: '/app/backlog', label: 'Backlog', icon: 'inbox' }
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { issues } = useStore()
  const toast = useToast()
  const navigate = useNavigate()

  const [selectedId, setSelectedId] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)

  const openIssue = useCallback((id) => setSelectedId(id), [])
  const openCreate = useCallback(() => setCreateOpen(true), [])

  useHotkeys(
    {
      'mod+k': () => setPaletteOpen((v) => !v),
      c: () => setCreateOpen(true),
      '/': () => searchRef.current?.focus()
    },
    []
  )

  function handleLogout() {
    logout()
    toast.info('Signed out')
    navigate('/')
  }

  const open = issues.filter((i) => i.status !== 'done' && i.status !== 'canceled').length

  return (
    <div className="shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="side-top">
          <Logo size={24} />
        </div>

        <button className="create-btn" onClick={() => setCreateOpen(true)}>
          <Icon name="plus" size={16} /> New issue <span className="kbd" style={{ marginLeft: 'auto' }}>C</span>
        </button>

        <button className="search-trigger" onClick={() => setPaletteOpen(true)}>
          <Icon name="search" size={15} /> Search… <span className="kbd" style={{ marginLeft: 'auto' }}>⌘K</span>
        </button>

        <div className="side-section">Views</div>
        <nav className="side-nav">
          {views.map((v) => (
            <NavLink
              key={v.to}
              to={v.to}
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon name={v.icon} size={17} /> <span>{v.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="side-section">Projects</div>
        <nav className="side-nav">
          {PROJECTS.map((p) => (
            <div key={p.id} className="side-proj">
              <span className="proj-dot" style={{ background: p.color }} />
              <span>{p.name}</span>
              <span className="proj-count">{issues.filter((i) => i.project === p.id).length}</span>
            </div>
          ))}
        </nav>

        <div className="side-foot">
          <div className="side-stat"><strong>{open}</strong> open · <strong>{issues.length}</strong> total</div>
        </div>
      </aside>

      {sidebarOpen && <div className="scrim" onClick={() => setSidebarOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Menu"><Icon name="menu" size={18} /></button>
          <div className="top-search">
            <Icon name="search" size={16} />
            <input
              ref={searchRef}
              placeholder="Search issues…  (press / )"
              onFocus={() => setPaletteOpen(true)}
            />
          </div>
          <div className="top-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={15} /> New
            </button>
            <ThemeToggle />
            <div className="user-menu">
              <button className="avatar-btn" onClick={() => setMenuOpen((m) => !m)}>
                <Avatar member={{ name: user?.name, initials: initialsOf(user?.name) }} size={30} />
              </button>
              {menuOpen && (
                <>
                  <div className="menu-scrim" onClick={() => setMenuOpen(false)} />
                  <div className="dropdown">
                    <div className="dropdown-head">
                      <Avatar member={{ name: user?.name, initials: initialsOf(user?.name) }} size={34} />
                      <div>
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <hr className="divider" />
                    <button className="dropdown-item" onClick={() => { setMenuOpen(false); navigate('/app/settings') }}>
                      <Icon name="settings" size={16} /> Settings
                    </button>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <Icon name="logout" size={16} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet context={{ openIssue, openCreate }} />
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onOpenIssue={(id) => { setPaletteOpen(false); openIssue(id) }}
          onCreate={() => { setPaletteOpen(false); setCreateOpen(true) }}
        />
      )}
      {createOpen && (
        <CreateIssue onClose={() => setCreateOpen(false)} onCreated={(id) => { setCreateOpen(false); openIssue(id) }} />
      )}
      {selectedId && <IssueDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  )
}

function initialsOf(name) {
  if (!name) return '?'
  const p = name.trim().split(/\s+/)
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase()
}
