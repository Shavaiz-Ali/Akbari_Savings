import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import AppSettings from '@/models/appSettings'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// PATCH /api/admin/settings/loans
export async function PATCH(req: NextRequest) {
  try {
    await connectDB()

    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const body = await req.json()

    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request. "enabled" must be a boolean.' },
        { status: 400 }
      )
    }

    const { enabled } = body as { enabled: boolean }

    await AppSettings.findOneAndUpdate(
      { key: 'loans_enabled' },
      { value: enabled ? 'true' : 'false' },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      message: 'Loans module updated',
      enabled,
    })
  } catch (error) {
    console.error('[PATCH /api/admin/settings/loans]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
