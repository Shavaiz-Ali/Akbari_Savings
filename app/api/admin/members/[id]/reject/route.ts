import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/user'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// PATCH /api/admin/members/[id]/reject
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const { id } = await params

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Hard delete — they never had access, no financial data attached
    await User.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Account rejected and removed' })
  } catch (error) {
    console.error('[PATCH /api/admin/members/[id]/reject]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
