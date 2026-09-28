import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, signup, continueWithGoogle } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/dashboard'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signin') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      showToast('success', mode === 'signin' ? 'Welcome back.' : 'Account created.')
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await continueWithGoogle()
      showToast('success', 'Welcome back.')
      navigate(from, { replace: true })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
            Postform
          </span>
        </Link>

        <div className="rounded-2xl border border-ink-200 bg-white p-7 shadow-card dark:border-ink-800 dark:bg-ink-900">
          <h1 className="text-xl font-semibold text-ink-900 dark:text-white">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {mode === 'signin'
              ? 'Sign in to keep your LinkedIn content on autopilot.'
              : 'Start generating LinkedIn content with AI in minutes.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <Input
                label="Name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon className="h-4 w-4" />}
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
              error={error || undefined}
            />

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('info', 'Password reset isn\u2019t wired up in this demo.')}
                  className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {mode === 'signin' ? 'Sign In' : 'Create account'}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
            <span className="text-xs text-ink-400">or</span>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>

          <Button variant="outline" className="w-full" size="lg" onClick={handleGoogle} loading={googleLoading}>
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.9 10.9 0 0 0 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-medium text-accent-600 hover:underline dark:text-accent-400"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
