import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { PostTemplate } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { generateSeedTemplates } from '@/data/mockData'
import { generateId } from '@/utils/id'
import { useToast } from './ToastContext'

interface TemplatesContextValue {
  templates: PostTemplate[]
  createTemplate: (data: Omit<PostTemplate, 'id' | 'isCustom'>) => void
  deleteTemplate: (id: string) => void
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null)

export function TemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PostTemplate[]>(() =>
    readStorage(STORAGE_KEYS.templates, generateSeedTemplates()),
  )
  const { showToast } = useToast()

  useEffect(() => {
    writeStorage(STORAGE_KEYS.templates, templates)
  }, [templates])

  function createTemplate(data: Omit<PostTemplate, 'id' | 'isCustom'>) {
    const template: PostTemplate = { ...data, id: generateId('tmpl'), isCustom: true }
    setTemplates((prev) => [template, ...prev])
    showToast('success', 'Template saved.')
  }

  function deleteTemplate(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    showToast('info', 'Template deleted.')
  }

  return (
    <TemplatesContext.Provider value={{ templates, createTemplate, deleteTemplate }}>
      {children}
    </TemplatesContext.Provider>
  )
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext)
  if (!ctx) throw new Error('useTemplates must be used within TemplatesProvider')
  return ctx
}
