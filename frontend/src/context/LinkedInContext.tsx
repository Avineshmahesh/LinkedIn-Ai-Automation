import { createContext, useContext, useState, type ReactNode } from 'react'
import type { LinkedInAccount } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { DEFAULT_LINKEDIN_ACCOUNT } from '@/data/mockData'
import * as mockLinkedIn from '@/services/mockLinkedIn'
import { useToast } from './ToastContext'
import { useAuth } from './AuthContext'

interface LinkedInContextValue {
  account: LinkedInAccount
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const LinkedInContext = createContext<LinkedInContextValue | null>(null)

export function LinkedInProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<LinkedInAccount>(() =>
    readStorage(STORAGE_KEYS.linkedin, DEFAULT_LINKEDIN_ACCOUNT),
  )
  const [connecting, setConnecting] = useState(false)
  const { showToast } = useToast()
  const { user } = useAuth()

  function persist(next: LinkedInAccount) {
    setAccount(next)
    writeStorage(STORAGE_KEYS.linkedin, next)
  }

  async function connect() {
    setConnecting(true)
    try {
      const result = await mockLinkedIn.connectLinkedIn(user.name, user.title)
      persist(result)
      showToast('success', 'LinkedIn connected.')
    } catch {
      showToast('error', 'Could not connect to LinkedIn. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  async function disconnect() {
    setConnecting(true)
    try {
      await mockLinkedIn.disconnectLinkedIn()
      persist({ connected: false })
      showToast('info', 'LinkedIn account disconnected.')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <LinkedInContext.Provider value={{ account, connecting, connect, disconnect }}>
      {children}
    </LinkedInContext.Provider>
  )
}

export function useLinkedIn() {
  const ctx = useContext(LinkedInContext)
  if (!ctx) throw new Error('useLinkedIn must be used within LinkedInProvider')
  return ctx
}
