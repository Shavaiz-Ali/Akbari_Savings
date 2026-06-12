import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Deposit from '@/models/deposit'
import DepositApproval from '@/models/depositApproval'
import User from '@/models/user'
import mongoose from 'mongoose'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// POST /api/admin/deposits/[id]/approve
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

    const deposit = await Deposit.findById(id)
    if (!deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ error: 'Deposit is not pending' }, { status: 400 })
    }

    // Self-approval guard
    if (deposit.userId.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot approve your own deposit' },
        { status: 403 }
      )
    }

    // Duplicate action guard
    const alreadyActed = await DepositApproval.findOne({
      depositId: id,
      adminId: session.user.id,
    })
    if (alreadyActed) {
      return NextResponse.json(
        { error: 'You have already acted on this deposit' },
        { status: 409 }
      )
    }

    // Optional note from body
    let note = ''
    try {
      const body = await req.json()
      note = body?.note ?? ''
    } catch {
      // no body is fine
    }

    // Atomic transaction: update deposit + increment balance + create approval
    const dbSession = await mongoose.startSession()
    let updatedDeposit
    try {
      await dbSession.withTransaction(async () => {
        await Deposit.findByIdAndUpdate(id, { status: 'approved' }, { session: dbSession })
        await User.findByIdAndUpdate(
          deposit.userId,
          { $inc: { totalBalance: deposit.amount } },
          { session: dbSession }
        )
        await DepositApproval.create(
          [{ depositId: id, adminId: session.user.id, action: 'approved', note }],
          { session: dbSession }
        )
        updatedDeposit = await Deposit.findById(id).session(dbSession)
      })
    } finally {
      await dbSession.endSession()
    }

    return NextResponse.json({
      message: 'Deposit approved',
      data: updatedDeposit,
    })
  } catch (error) {
    console.error('[POST /api/admin/deposits/[id]/approve]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
