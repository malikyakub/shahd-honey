import { useState } from 'react'
import { ADMIN_SESSION_KEY } from '../../data/admin'
import { AdminLogin } from './AdminLogin'
import { AdminLayout } from './AdminLayout'

export function AdminGuard() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
    } catch {
      return false
    }
  })

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
    } catch {
      /* ignore */
    }
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminLayout onLogout={handleLogout} />
}
