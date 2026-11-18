import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { Avatar } from '../components/Glyphs'

export default function SettingsView() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()

  function reset() {
    localStorage.removeItem('mm.issues')
    toast.success('Workspace reset')
    window.setTimeout(() => window.location.reload(), 500)
  }

  function initials(name) {
    if (!name) return '?'
    const p = name.trim().split(/\s+/)
    return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase()
  }

  return (
    <div className="view">
      <div className="view-head"><div className="view-title"><h1>Settings</h1></div></div>

      <div className="settings">
        <section className="set-card">
          <h3>Profile</h3>
          <div className="set-profile">
            <Avatar member={{ name: user?.name, initials: initials(user?.name) }} size={52} />
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="set-card">
          <h3>Appearance</h3>
          <div className="set-row">
            <div><div className="set-title">Theme</div><div className="set-desc">Momentum in light or dark.</div></div>
            <div className="seg">
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Light</button>
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>Dark</button>
            </div>
          </div>
        </section>

        <section className="set-card">
          <h3>Keyboard shortcuts</h3>
          <div className="shortcuts">
            {[['C', 'Create a new issue'], ['⌘ K', 'Open command palette'], ['/', 'Focus search'], ['Esc', 'Close dialogs'], ['↑ ↓', 'Navigate the palette'], ['↵', 'Open / run selection']].map(([k, d]) => (
              <div key={d} className="shortcut"><span className="kbd">{k}</span><span>{d}</span></div>
            ))}
          </div>
        </section>

        <section className="set-card">
          <h3>Workspace</h3>
          <div className="set-row">
            <div><div className="set-title">Reset demo data</div><div className="set-desc">Restore the sample issues.</div></div>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
          </div>
          <div className="set-row">
            <div><div className="set-title">Sign out</div><div className="set-desc">End your session.</div></div>
            <button className="btn btn-danger btn-sm" onClick={() => { logout(); navigate('/') }}>Sign out</button>
          </div>
        </section>
      </div>
    </div>
  )
}
