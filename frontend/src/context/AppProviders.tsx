import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeContext'
import { ToastProvider } from './ToastContext'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './NotificationContext'
import { LinkedInProvider } from './LinkedInContext'
import { AISettingsProvider } from './AISettingsContext'
import { PostsProvider } from './PostsContext'
import { TemplatesProvider } from './TemplatesContext'
import { AnalyticsProvider } from './AnalyticsContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <LinkedInProvider>
              <AISettingsProvider>
                <TemplatesProvider>
                  <AnalyticsProvider>
                    <PostsProvider>{children}</PostsProvider>
                  </AnalyticsProvider>
                </TemplatesProvider>
              </AISettingsProvider>
            </LinkedInProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
