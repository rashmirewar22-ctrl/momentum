import { useTheme } from '../context/ThemeContext'
import Icon from './Icon'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button className="icon-btn" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
    </button>
  )
}
