import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Deposit from '@/models/deposit'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// GET /api/admin/deposits?status=pending|approved|rejected&month=2024-01-01&userId=
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const month = searchParams.get('month')
    const userId = searchParams.get('userId')

    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (month) filter.month = new Date(month)
    if (userId) filter.userId = userId

    const deposits = await Deposit.find(filter)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })

    return NextResponse.json({ data: deposits })
  } catch (error) {
    console.error('[GET /api/admin/deposits]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
