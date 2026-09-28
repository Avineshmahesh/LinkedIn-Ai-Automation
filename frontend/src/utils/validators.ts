export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isFutureDateTime(date: string, time: string): boolean {
  if (!date || !time) return false
  const dt = new Date(`${date}T${time}`)
  return dt.getTime() > Date.now()
}
