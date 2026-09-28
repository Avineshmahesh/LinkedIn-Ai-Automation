// A small generic "in" badge used to represent the LinkedIn connection in
// this demo. Deliberately simple rather than a pixel-accurate reproduction
// of any brand mark.
export function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M7.2 9.6h2.3v7.6H7.2V9.6Zm1.15-3.7a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66Zm3.05 3.7h2.2v1.04h.03c.31-.58 1.05-1.2 2.17-1.2 2.32 0 2.75 1.53 2.75 3.51v4.25h-2.3v-3.77c0-.9-.02-2.06-1.25-2.06-1.26 0-1.45.98-1.45 2v3.83h-2.15V9.6Z"
        fill="currentColor"
      />
    </svg>
  )
}
