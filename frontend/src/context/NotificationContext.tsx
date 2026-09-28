import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppNotification, NotificationType } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { generateSeedNotifications } from '@/data/mockData'
import { generateId } from '@/utils/id'

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (type: NotificationType, title: string, message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readStorage(STORAGE_KEYS.notifications, generateSeedNotifications()),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.notifications, notifications)
  }, [notifications])

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function addNotification(type: NotificationType, title: string, message: string) {
    const notification: AppNotification = {
      id: generateId('notif'),
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [notification, ...prev])
  }

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
