export interface MemberParams {
  status?: "active" | "pending" | "all"
}

export interface CreateMemberData {
  fullName: string
  email: string
  password: string
  monthlyTarget: number
}

export interface UpdateMemberData {
  fullName?: string
  monthlyTarget?: number
  isActive?: boolean
}

export interface IMemberUser {
  _id: string
  fullName: string
  email: string
  role: string
  monthlyTarget: number
  totalBalance: number
  isActive: boolean
  approvedAt: string | null
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

export class MemberService {
  async getMembers(params: MemberParams) {
    const query = new URLSearchParams()
    if (params.status) query.set("status", params.status)
    return apiFetch(`/api/admin/members?${query.toString()}`)
  }

  async createMember(data: CreateMemberData) {
    return apiFetch("/api/admin/members", { method: "POST", body: JSON.stringify(data) })
  }

  async updateMember(id: string, data: UpdateMemberData) {
    return apiFetch(`/api/admin/members/${id}`, { method: "PATCH", body: JSON.stringify(data) })
  }

  async deleteMember(id: string) {
    return apiFetch(`/api/admin/members/${id}`, { method: "DELETE" })
  }

  async approveMember(id: string) {
    return apiFetch(`/api/admin/members/${id}/approve`, { method: "PATCH" })
  }

  async rejectMember(id: string) {
    return apiFetch(`/api/admin/members/${id}/reject`, { method: "PATCH" })
  }
}

export const memberService = new MemberService()
