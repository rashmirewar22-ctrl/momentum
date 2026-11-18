import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import './auth.css'

function strength(pw) {
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(s, 4)
}

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']

export default function Signup() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', agree: false })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.password.length < 6) next.password = 'At least 6 characters.'
    if (!form.agree) next.agree = 'Please accept the terms.'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    window.setTimeout(() => {
      const res = register(form)
      if (res.ok) {
        toast.success('Workspace ready')
        navigate('/app/board')
      } else {
        setBusy(false)
        setErrors({ email: res.error })
      }
    }, 480)
  }

  const s = strength(form.password)

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-top"><Link to="/"><Logo /></Link></div>
        <div className="auth-aside-mid">
          <div className="aside-badge mono">FREE · FRONT-END ONLY</div>
          <h2>Start a workspace in seconds.</h2>
          <p>Spin up projects, file issues, and move them across the board — no backend, no wait.</p>
          <div className="aside-kbd mono">
            <span><span className="kbd">C</span> create</span>
            <span><span className="kbd">⌘K</span> search</span>
            <span><span className="kbd">/</span> jump</span>
          </div>
        </div>
        <div className="auth-aside-bottom mono">// your data never leaves this device</div>
      </aside>

      <main className="auth-main">
        <div className="auth-topbar">
          <Link to="/" className="auth-back">← Back</Link>
          <ThemeToggle />
        </div>
        <form className="auth-form" onSubmit={submit} noValidate>
          <h1>Create your workspace</h1>
          <p className="auth-lead">Free forever. No card needed.</p>

          <div className="field">
            <label className="label">Full name</label>
            <input className="input" placeholder="Ada Reyes" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div className="field">
            <label className="label">Work email</label>
            <input className="input" type="email" placeholder="you@team.com" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
            {form.password && (
              <div className="meter">
                <div className="meter-track">{[0, 1, 2, 3].map((i) => <span key={i} className={i < s ? `on s${s}` : ''} />)}</div>
                <span className="meter-label">{labels[s]}</span>
              </div>
            )}
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <label className="check">
            <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} />
            <span>I agree to the Terms and Privacy Policy.</span>
          </label>
          {errors.agree && <div className="field-error">{errors.agree}</div>}

          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy} style={{ marginTop: 16 }}>{busy ? 'Creating…' : 'Create workspace'}</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </main>
    </div>
  )
}
