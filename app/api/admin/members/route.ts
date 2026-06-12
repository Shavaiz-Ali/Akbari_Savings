import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import User from '@/models/user'
import bcrypt from 'bcryptjs'
import type { Session } from 'next-auth'

async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') return null
  return session
}

// GET /api/admin/members?status=active|pending|all
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'all'

    const filter: Record<string, unknown> = { role: 'member' }
    if (status === 'active') filter.isActive = true
    else if (status === 'pending') filter.isActive = false

    const members = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 })

    return NextResponse.json({ data: members })
  } catch (error) {
    console.error('[GET /api/admin/members]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

const CreateMemberSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50).trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  monthlyTarget: z.number().min(0).default(0),
})

// POST /api/admin/members
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Access denied. Admins only.' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = CreateMemberSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    const { fullName, email, password, monthlyTarget } = parsed.data

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      role: 'member',
      monthlyTarget,
      isActive: true,
      approvedBy: session.user.id,
      approvedAt: new Date(),
      createdBy: session.user.id,
    })

    const userObj = newUser.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...safeUser } = userObj

    return NextResponse.json({ data: safeUser }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/members]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
