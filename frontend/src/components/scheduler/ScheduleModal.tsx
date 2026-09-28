import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { isFutureDateTime } from '@/utils/validators'

const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
]

function defaultDate() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (isoDate: string, timezone: string) => void
  onPublishNow?: () => void
  loading?: boolean
  initialDate?: string
  initialTime?: string
  title?: string
}

export function ScheduleModal({
  open,
  onClose,
  onConfirm,
  onPublishNow,
  loading,
  initialDate,
  initialTime,
  title = 'Schedule post',
}: ScheduleModalProps) {
  const [date, setDate] = useState(initialDate || defaultDate())
  const [time, setTime] = useState(initialTime || '09:00')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [error, setError] = useState('')

  function handleConfirm() {
    if (!isFutureDateTime(date, time)) {
      setError('Please choose a date and time in the future.')
      return
    }
    setError('')
    const iso = new Date(`${date}T${time}`).toISOString()
    onConfirm(iso, timezone)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description="Choose when this post should go live on LinkedIn."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {onPublishNow && (
            <Button variant="secondary" onClick={onPublishNow} disabled={loading}>
              Publish now
            </Button>
          )}
          <Button onClick={handleConfirm} loading={loading}>
            Schedule post
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Date"
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <Select
          className="col-span-2"
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          options={TIMEZONES.map((tz) => ({ label: tz, value: tz }))}
        />
      </div>
      {error && <p className="mt-3 text-sm text-danger-500">{error}</p>}
    </Modal>
  )
}
