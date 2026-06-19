export function fmtPKR(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function fmtMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    year: "numeric",
  })
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
