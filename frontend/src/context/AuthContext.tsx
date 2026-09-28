import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { readStorage, writeStorage, clearStorage, STORAGE_KEYS } from '@/services/storage'
import { DEFAULT_USER } from '@/data/mockData'
import { simulate } from '@/services/mockCore'

interface AuthState {
  isAuthenticated: boolean
  user: User
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  continueWithGoogle: () => Promise<void>
  logout: () => void
  updateUser: (partial: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEFAULT_STATE: AuthState = { isAuthenticated: false, user: DEFAULT_USER }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => readStorage(STORAGE_KEYS.auth, DEFAULT_STATE))

  function persist(next: AuthState) {
    setState(next)
    writeStorage(STORAGE_KEYS.auth, next)
  }

  async function login(email: string, _password: string) {
    await simulate(() => undefined, { minMs: 700, maxMs: 1300, failRate: 0 })
    persist({ isAuthenticated: true, user: { ...DEFAULT_USER, email: email || DEFAULT_USER.email } })
  }

  async function signup(name: string, email: string, _password: string) {
    await simulate(() => undefined, { minMs: 800, maxMs: 1400, failRate: 0 })
    persist({
      isAuthenticated: true,
      user: { ...DEFAULT_USER, name: name || DEFAULT_USER.name, email: email || DEFAULT_USER.email },
    })
  }

  async function continueWithGoogle() {
    await simulate(() => undefined, { minMs: 900, maxMs: 1500, failRate: 0 })
    persist({ isAuthenticated: true, user: DEFAULT_USER })
  }

  function logout() {
    clearStorage(STORAGE_KEYS.auth)
    setState(DEFAULT_STATE)
  }

  async function updateUser(partial: Partial<User>) {
    await simulate(() => undefined, { minMs: 500, maxMs: 900 })
    persist({ ...state, user: { ...state.user, ...partial } })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, continueWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
