import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import Icon from '../components/Icon'
import { StatusIcon, PriorityIcon, Avatar } from '../components/Glyphs'
import './landing.css'

const paletteRows = [
  ['MOM-142', 'Fix keyboard trap in command palette', 'progress', 'urgent'],
  ['MOM-143', 'Virtualize the issue list over 1k rows', 'todo', 'high'],
  ['MOM-152', 'Command palette fuzzy ranking', 'progress', 'medium'],
  ['MOM-156', 'Session token rotation', 'todo', 'urgent']
]

const shortcuts = [
  ['C', 'New issue'],
  ['⌘K', 'Command palette'],
  ['/', 'Search'],
  ['E', 'Edit'],
  ['↑ ↓', 'Navigate'],
  ['↵', 'Open'],
  ['X', 'Select'],
  ['Esc', 'Close']
]

export default function Landing() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="mk">
      <header className={`mkn ${scrolled ? 'stuck' : ''}`}>
        <div className="mkn-in">
          <Link to="/"><Logo /></Link>
          <nav className={`mkn-nav ${open ? 'open' : ''}`}>
            <a href="#how" onClick={() => setOpen(false)}>How it works</a>
            <a href="#keys" onClick={() => setOpen(false)}>Shortcuts</a>
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          </nav>
          <div className="mkn-act">
            <ThemeToggle />
            <Link to="/login" className="mkn-login">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Start free</Link>
            <button className="mkn-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu"><Icon name="menu" size={18} /></button>
          </div>
        </div>
      </header>

      <section className="mk-hero">
        <div className="mk-glow" />
        <div className="mk-badge"><span className="live-dot" /> Keyboard-first issue tracking</div>
        <h1>The tracker that moves<br />at the speed of <span className="mk-grad">your keyboard.</span></h1>
        <p>Momentum keeps small teams in flow — file an issue, triage it, ship it, without ever reaching for the mouse. Board, list and a command palette that ties it all together.</p>
        <div className="mk-hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">Start free <Icon name="arrowRight" size={16} /></Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Open live demo</Link>
        </div>

        <div className="mk-palette">
          <div className="mk-palette-input">
            <Icon name="search" size={18} />
            <span className="mk-type">fix keyboard<span className="caret" /></span>
            <span className="kbd">esc</span>
          </div>
          <div className="mk-palette-group">ISSUES</div>
          {paletteRows.map(([id, title, st, pr], i) => (
            <div className={`mk-palette-row ${i === 0 ? 'active' : ''}`} key={id}>
              <StatusIcon status={st} />
              <span className="mono mk-pr-id">{id}</span>
              <span className="mk-pr-title">{title}</span>
              <PriorityIcon priority={pr} />
            </div>
          ))}
          <div className="mk-palette-foot">
            <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
            <span><span className="kbd">↵</span> open</span>
            <span><span className="kbd">esc</span> close</span>
          </div>
        </div>
      </section>

      <section className="mk-trust">
        <span>TRUSTED BY FAST-MOVING TEAMS</span>
        <div className="mk-trust-row">
          {['Lumen', 'Northwind', 'Vertex', 'Cobalt', 'Harbor', 'Stellar'].map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
      </section>

      <section id="how" className="zz">
        <div className="zz-row">
          <div className="zz-text">
            <span className="zz-k">01 · BOARD</span>
            <h2>A board that's the single source of truth.</h2>
            <p>Drag an issue from Backlog to Done and the pipeline updates for everyone. Priorities, labels and sub-task progress sit right on the card — no opening required.</p>
            <ul className="zz-list">
              <li><Icon name="check" size={15} /> Five stages, drag-and-drop</li>
              <li><Icon name="check" size={15} /> Weighted by priority automatically</li>
            </ul>
          </div>
          <div className="zz-media">
            <div className="mini-board">
              {[
                { s: 'todo', t: 'Todo', cards: [['MOM-143', 'high'], ['MOM-156', 'urgent']] },
                { s: 'progress', t: 'In Progress', cards: [['MOM-142', 'urgent']] },
                { s: 'done', t: 'Done', cards: [['MOM-154', 'medium']] }
              ].map((c) => (
                <div className="mb-col" key={c.s}>
                  <div className="mb-col-h"><StatusIcon status={c.s} /> {c.t}</div>
                  {c.cards.map(([id, pr]) => (
                    <div className="mb-card" key={id}>
                      <div className="mb-card-top"><span className="mono">{id}</span><PriorityIcon priority={pr} /></div>
                      <div className="mb-bar" /><div className="mb-bar short" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="zz-row rev">
          <div className="zz-text">
            <span className="zz-k">02 · COMMAND PALETTE</span>
            <h2>Everything is one keystroke away.</h2>
            <p>Hit <span className="kbd">⌘K</span> from anywhere to jump to an issue or run an action. Fuzzy-ranked results, full keyboard navigation, and it closes the moment you're done.</p>
            <ul className="zz-list">
              <li><Icon name="check" size={15} /> Fuzzy search across every issue</li>
              <li><Icon name="check" size={15} /> Run actions without leaving the keys</li>
            </ul>
          </div>
          <div className="zz-media">
            <div className="mini-cmd">
              <div className="mc-input"><Icon name="search" size={15} /> session<span className="caret" /></div>
              {[['MOM-156', 'Session token rotation', 'todo'], ['MOM-152', 'Fuzzy ranking feels random', 'progress'], ['MOM-148', 'Webhook retries use fixed backoff', 'todo']].map(([id, t, s], i) => (
                <div className={`mc-row ${i === 0 ? 'on' : ''}`} key={id}>
                  <StatusIcon status={s} /><span className="mono">{id}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="zz-row">
          <div className="zz-text">
            <span className="zz-k">03 · ISSUE DETAIL</span>
            <h2>Sub-tasks, comments and an activity log that writes itself.</h2>
            <p>Break work into a checklist, leave a comment, change priority — every move is captured in the timeline. Open an issue in a side drawer without losing your place.</p>
            <ul className="zz-list">
              <li><Icon name="check" size={15} /> Checklist with live progress</li>
              <li><Icon name="check" size={15} /> Status, assignee & labels inline</li>
            </ul>
          </div>
          <div className="zz-media">
            <div className="mini-detail">
              <div className="md-id mono">MOM-154 · Web App</div>
              <div className="md-title">Add inline sub-task checklist</div>
              <div className="md-sub"><span className="md-check done"><Icon name="check" size={11} /></span> Model the data</div>
              <div className="md-sub"><span className="md-check done"><Icon name="check" size={11} /></span> Build the UI</div>
              <div className="md-sub"><span className="md-check" /> Persist to storage</div>
              <div className="md-props">
                <span className="md-prop"><PriorityIcon priority="medium" /> Medium</span>
                <span className="md-prop"><Avatar member={{ name: 'AT', initials: 'AT' }} size={18} /> Ava</span>
                <span className="md-prop md-label"><span className="dot" /> Feature</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="keys" className="mk-keys">
        <div className="mk-keys-head">
          <h2>Built for people who'd rather not touch the mouse.</h2>
          <p>Every core action has a shortcut. Learn three and you're faster than any dashboard.</p>
        </div>
        <div className="mk-keys-grid">
          {shortcuts.map(([k, l]) => (
            <div className="mk-key" key={l}>
              <span className="kbd">{k}</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mk-cta">
        <div className="mk-glow soft" />
        <h2>Give your issues some momentum.</h2>
        <p>Free forever. No backend, no card, no setup — it runs entirely in your browser.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Create your workspace <Icon name="arrowRight" size={16} /></Link>
        <div className="mk-cta-keys"><span className="kbd">C</span> to create · <span className="kbd">⌘K</span> to search · <span className="kbd">/</span> to jump</div>
      </section>

      <footer className="mk-foot">
        <div className="mk-foot-top">
          <div className="mk-foot-brand">
            <Logo />
            <p>The keyboard-first issue tracker.</p>
            <div className="mk-foot-status mono"><span className="live-dot" /> all systems operational</div>
          </div>
          <div className="mk-foot-cols">
            <div><h4>PRODUCT</h4><a href="#how">How it works</a><a href="#keys">Shortcuts</a><Link to="/signup">Pricing</Link></div>
            <div><h4>ACCOUNT</h4><Link to="/login">Log in</Link><Link to="/signup">Sign up</Link><Link to="/login">Demo</Link></div>
          </div>
        </div>
        <div className="mk-foot-bottom mono">
          <span>© {new Date().getFullYear()} MOMENTUM</span>
          <span>BUILT FRONT-END ONLY · REACT + CSS</span>
        </div>
      </footer>
    </div>
  )
}
