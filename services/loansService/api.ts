export interface LoanParams {
  status?: string
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw err
  }
  return res.json()
}

export class LoanService {
  async getLoans(params: LoanParams) {
    const query = new URLSearchParams()
    if (params.status) query.set("status", params.status)
    return apiFetch(`/api/admin/loans?${query.toString()}`)
  }
}

export const loanService = new LoanService()
