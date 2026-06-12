import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import { checkLoansEnabled } from '@/lib/checkLoansEnabled'
import Loan from '@/models/loan'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

const RejectLoanSchema = z.object({
  note: z.string().min(1, 'Rejection reason is required').max(200),
})

// PATCH /api/admin/loans/[id]/reject
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    if (!(await checkLoansEnabled())) {
      return NextResponse.json({ error: 'Loan module is not yet available' }, { status: 403 })
    }

    const { id } = await params

    const body = await req.json()
    const parsed = RejectLoanSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    const loan = await Loan.findById(id)
    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 })
    }
    if (loan.status !== 'pending') {
      return NextResponse.json({ error: 'Loan is not pending' }, { status: 400 })
    }

    await Loan.findByIdAndUpdate(id, { $set: { status: 'rejected' } })

    return NextResponse.json({ message: 'Loan rejected' })
  } catch (error) {
    console.error('[PATCH /api/admin/loans/[id]/reject]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
