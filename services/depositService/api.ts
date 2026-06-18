export interface DepositParams {
  status?: string
  month?: string   // ISO date string e.g. "2026-06-01"
  userId?: string
}

export interface IDeposit {
  _id: string
  userId: { _id: string; fullName: string; email: string }
  amount: number
  screenshotUrl: string
  status: "pending" | "approved" | "rejected"
  month: string
  note: string
  createdAt: string
  updatedAt: string
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

export class DepositService {
  async getDeposits(params: DepositParams) {
    const query = new URLSearchParams()
    if (params.status && params.status !== "all") query.set("status", params.status)
    if (params.month) query.set("month", params.month)
    if (params.userId) query.set("userId", params.userId)
    return apiFetch(`/api/admin/deposits?${query.toString()}`)
  }

  async approveDeposit(id: string, note?: string) {
    return apiFetch(`/api/admin/deposits/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ note: note ?? "" }),
    })
  }

  async rejectDeposit(id: string, note?: string) {
    return apiFetch(`/api/admin/deposits/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ note: note ?? "" }),
    })
  }
}

export const depositService = new DepositService()
