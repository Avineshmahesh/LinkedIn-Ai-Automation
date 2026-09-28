import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  CalendarClock,
  CheckCircle2,
  XCircle,
  BarChart3,
  LayoutTemplate,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Create Post', to: '/create', icon: PenSquare },
  { label: 'Drafts', to: '/drafts', icon: FileText },
  { label: 'Scheduled', to: '/scheduled', icon: CalendarClock },
  { label: 'Published', to: '/published', icon: CheckCircle2 },
  { label: 'Failed', to: '/failed', icon: XCircle },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Templates', to: '/templates', icon: LayoutTemplate },
]

export const SETTINGS_ITEM: NavItem = { label: 'Settings', to: '/settings', icon: Settings }
