import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { StoreProvider } from './context/StoreContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AppLayout from './layouts/AppLayout'
import BoardView from './pages/BoardView'
import ListView from './pages/ListView'
import SettingsView from './pages/SettingsView'

function Protected({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  return <StoreProvider>{children}</StoreProvider>
}

function GuestOnly({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (user) return <Navigate to="/app/board" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route path="/app" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Navigate to="board" replace />} />
        <Route path="board" element={<BoardView />} />
        <Route path="all" element={<ListView scope="all" title="All issues" />} />
        <Route path="my" element={<ListView scope="my" title="My issues" />} />
        <Route path="active" element={<ListView scope="active" title="Active" />} />
        <Route path="backlog" element={<ListView scope="backlog" title="Backlog" />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
