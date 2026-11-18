import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import './auth.css'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.password.length < 6) next.password = 'At least 6 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    window.setTimeout(() => {
      const res = login(form)
      if (res.ok) {
        toast.success('Welcome back')
        navigate('/app/board')
      } else {
        setBusy(false)
        setErrors({ password: res.error })
      }
    }, 420)
  }

  function useDemo() {
    setForm({ email: 'demo@momentum.dev', password: 'momentum' })
    setErrors({})
  }

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-top"><Link to="/"><Logo /></Link></div>
        <div className="auth-aside-mid">
          <div className="aside-badge mono">ISSUE TRACKER</div>
          <h2>Ship what matters, in order.</h2>
          <p>Board and list views, a command palette, and keyboard shortcuts that keep your team in flow.</p>
          <div className="aside-kbd mono">
            <span><span className="kbd">C</span> create</span>
            <span><span className="kbd">⌘K</span> search</span>
            <span><span className="kbd">/</span> jump</span>
          </div>
        </div>
        <div className="auth-aside-bottom mono">// built front-end only · data in your browser</div>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link to="/" className="auth-back">← Back</Link>
          <ThemeToggle />
        </div>
        <form className="auth-form" onSubmit={submit} noValidate>
          <h1>Log in to Momentum</h1>
          <p className="auth-lead">Pick up right where you left off.</p>

          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@team.com" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="input-affix">
              <input className="input" type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => set('password', e.target.value)} autoComplete="current-password" />
              <button type="button" className="affix-btn" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
          <button type="button" className="demo-link" onClick={useDemo}>Use demo credentials</button>
          <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
        </form>
      </main>
    </div>
  )
}
