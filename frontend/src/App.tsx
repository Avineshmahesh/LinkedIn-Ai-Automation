import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/context/AppProviders'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingState } from '@/components/ui/States'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CreatePost = lazy(() => import('@/pages/CreatePost'))
const Drafts = lazy(() => import('@/pages/Drafts'))
const Scheduled = lazy(() => import('@/pages/Scheduled'))
const Published = lazy(() => import('@/pages/Published'))
const Failed = lazy(() => import('@/pages/Failed'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Templates = lazy(() => import('@/pages/Templates'))
const SettingsLayout = lazy(() => import('@/pages/Settings/SettingsLayout'))
const LinkedInSettings = lazy(() => import('@/pages/Settings/LinkedInSettings'))
const AISettingsPage = lazy(() => import('@/pages/Settings/AISettingsPage'))
const AccountSettings = lazy(() => import('@/pages/Settings/AccountSettings'))

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Suspense fallback={<LoadingState className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/drafts" element={<Drafts />} />
            <Route path="/scheduled" element={<Scheduled />} />
            <Route path="/published" element={<Published />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="/settings/account" replace />} />
              <Route path="account" element={<AccountSettings />} />
              <Route path="linkedin" element={<LinkedInSettings />} />
              <Route path="ai" element={<AISettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AppProviders>
    </BrowserRouter>
  )
}
