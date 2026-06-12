import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import Deposit from '@/models/deposit'
import DepositApproval from '@/models/depositApproval'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

const RejectSchema = z.object({
  note: z.string().min(1, 'Rejection reason is required').max(200),
})

// POST /api/admin/deposits/[id]/reject
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const { id } = await params

    const body = await req.json()
    const parsed = RejectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    const deposit = await Deposit.findById(id)
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }
    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit is not pending' }, { status: 400 })
    }

    // Self-rejection guard
    if (deposit.userId.toString() === session.user.id) {
      return NextResponse.json({ error: 'You cannot reject your own deposit' }, { status: 403 })
    }

    await Deposit.findByIdAndUpdate(id, { status: 'rejected' })
    await DepositApproval.create({
      depositId: id,
      adminId: session.user.id,
      action: 'rejected',
      note: parsed.data.note,
    })

    return NextResponse.json({ message: 'Deposit rejected' })
  } catch (error) {
    console.error('[POST /api/admin/deposits/[id]/reject]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
