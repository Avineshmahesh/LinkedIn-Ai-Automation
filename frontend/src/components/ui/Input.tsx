import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FieldWrapProps {
  label?: string
  hint?: string
  error?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FieldWrap({ label, hint, error, htmlFor, children, className }: FieldWrapProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-700 dark:text-ink-200">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:opacity-60 disabled:cursor-not-allowed'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldWrap label={label} hint={hint} error={error} htmlFor={inputId}>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(inputBase, leftIcon && 'pl-9', error && 'border-danger-500', className)}
            {...props}
          />
        </div>
      </FieldWrap>
    )
  },
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldWrap label={label} hint={hint} error={error} htmlFor={inputId}>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(inputBase, 'resize-none leading-relaxed', error && 'border-danger-500', className)}
          {...props}
        />
      </FieldWrap>
    )
  },
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  options: Array<{ label: string; value: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, id, options, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldWrap label={label} hint={hint} error={error} htmlFor={inputId}>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(inputBase, 'appearance-none pr-9', error && 'border-danger-500', className)}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
      </FieldWrap>
    )
  },
)
Select.displayName = 'Select'
