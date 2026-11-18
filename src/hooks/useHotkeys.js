import { useEffect } from 'react'

function isTyping(el) {
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export function useHotkeys(map, deps = []) {
  useEffect(() => {
    function onKey(e) {
      const typing = isTyping(document.activeElement)
      const mod = e.metaKey || e.ctrlKey
      const combo = (mod ? 'mod+' : '') + e.key.toLowerCase()

      for (const key of Object.keys(map)) {
        const wantsMod = key.startsWith('mod+')
        if (combo === key) {
          if (!wantsMod && typing) continue
          e.preventDefault()
          map[key](e)
          return
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
