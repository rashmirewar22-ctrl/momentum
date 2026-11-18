import { useState, useRef, useEffect } from 'react'

export default function Menu({ trigger, children, align = 'left', width = 220 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="menu-wrap" ref={ref}>
      <div onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}>{trigger}</div>
      {open && (
        <div className={`menu-pop ${align}`} style={{ width }}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ active, onClick, children }) {
  return (
    <button className={`menu-item ${active ? 'on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
