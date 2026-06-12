import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Deposit from '@/models/deposit'
import DepositApproval from '@/models/depositApproval'

// GET /api/deposits/[id]  — owner or admin
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const deposit = await Deposit.findById(id)
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    // Only owner or admin may view
    const isOwner = deposit.userId.toString() === session.user.id
    const isAdmin = session.user.role === 'admin'
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const approvals = await DepositApproval.find({ depositId: id }).populate(
      'adminId',
      'fullName email'
    )

    return NextResponse.json({ data: { deposit, approvals } })
  } catch (error) {
    console.error('[GET /api/deposits/[id]]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
