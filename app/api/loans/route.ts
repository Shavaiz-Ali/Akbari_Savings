import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import { checkLoansEnabled } from '@/lib/checkLoansEnabled'
import Loan from '@/models/loan'

const ApplyLoanSchema = z.object({
  amount: z.number().min(1000, 'Minimum loan amount is PKR 1,000'),
  reason: z.string().min(10, 'Please provide a reason').max(500),
})

// GET /api/loans — member's own loans
export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await checkLoansEnabled())) {
      return NextResponse.json({ error: 'Loan module is not yet available' }, { status: 403 })
    }

    const loans = await Loan.find({ memberId: session.user.id }).sort({ createdAt: -1 })

    return NextResponse.json({ data: loans })
  } catch (error) {
    console.error('[GET /api/loans]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/loans — apply for a loan
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await checkLoansEnabled())) {
      return NextResponse.json({ error: 'Loan module is not yet available' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = ApplyLoanSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    const { amount, reason } = parsed.data

    const activeLoan = await Loan.findOne({
      memberId: session.user.id,
      status: { $in: ['pending', 'approved'] },
    })
    if (activeLoan) {
      return NextResponse.json(
        { error: 'You already have an active or pending loan' },
        { status: 409 }
      )
    }

    const loan = await Loan.create({ memberId: session.user.id, amount, reason })

    return NextResponse.json({ data: loan }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/loans]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
