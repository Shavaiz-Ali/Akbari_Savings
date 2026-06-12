import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { checkLoansEnabled } from '@/lib/checkLoansEnabled'
import Loan from '@/models/loan'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// GET /api/admin/loans?status=pending|approved|rejected
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    if (!(await checkLoansEnabled())) {
      return NextResponse.json(
        { error: 'Loan module is not yet available' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const filter: Record<string, unknown> = {}
    if (status) filter.status = status

    const loans = await Loan.find(filter)
      .populate('memberId', 'fullName email')
      .sort({ createdAt: -1 })

    return NextResponse.json({ data: loans })
  } catch (error) {
    console.error('[GET /api/admin/loans]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
