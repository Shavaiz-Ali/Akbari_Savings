import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

const SignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const parsed = SignupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    const { fullName, email, password } = parsed.data

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await User.create({ fullName, email, passwordHash, role: 'member', isActive: false })

    return NextResponse.json(
      { message: 'Account created. Awaiting admin approval.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/auth/signup]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
