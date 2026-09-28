import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AnalyticsPoint } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { generateAnalyticsSeries } from '@/data/mockData'

interface AnalyticsContextValue {
  series: AnalyticsPoint[]
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [series] = useState<AnalyticsPoint[]>(() =>
    readStorage<AnalyticsPoint[] | null>(STORAGE_KEYS.analytics, null) ?? (() => {
      const generated = generateAnalyticsSeries(30)
      writeStorage(STORAGE_KEYS.analytics, generated)
      return generated
    })(),
  )

  return <AnalyticsContext.Provider value={{ series }}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsData() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalyticsData must be used within AnalyticsProvider')
  return ctx
}
