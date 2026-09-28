import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { readStorage, writeStorage } from '@/services/storage'

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => readStorage('sidebar-collapsed', false))
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleCollapsed() {
    setCollapsed((prev) => {
      writeStorage('sidebar-collapsed', !prev)
      return !prev
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/50"
            style={{ animation: 'fade-in 0.15s ease-out' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative h-full w-64"
            style={{ animation: 'slide-in-right 0.2s ease-out' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute -right-11 top-4 rounded-lg bg-white/10 p-2 text-white"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
