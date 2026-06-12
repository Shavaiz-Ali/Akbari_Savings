import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { zodFieldErrors } from '@/lib/zodHelpers'
import cloudinary from '@/lib/cloudinary'
import Deposit from '@/models/deposit'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

const CreateDepositSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  note: z.string().max(200).optional(),
})

// GET /api/deposits  — member's own deposit history
export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deposits = await Deposit.find({ userId: session.user.id }).sort({ month: -1 })

    return NextResponse.json({ data: deposits })
  } catch (error) {
    console.error('[GET /api/deposits]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST /api/deposits  — submit a deposit (multipart/form-data)
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const amount = formData.get('amount')
    const month = formData.get('month')
    const note = formData.get('note')
    const file = formData.get('screenshot') as File | null

    // Validate scalar fields with Zod
    const parsed = CreateDepositSchema.safeParse({ amount, month, note })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    // Validate screenshot
    if (!file) {
      return NextResponse.json({ error: 'Screenshot is required' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, or WebP allowed.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size must not exceed 5 MB' }, { status: 400 })
    }

    const { amount: parsedAmount, month: parsedMonth, note: parsedNote } = parsed.data

    // Duplicate monthly deposit guard
    const existing = await Deposit.findOne({
      userId: session.user.id,
      month: new Date(parsedMonth),
    })
    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted a deposit for this month' },
        { status: 409 }
      )
    }

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `akbari-savings/deposits/${session.user.id}`, resource_type: 'image' },
          (err, result) => {
            if (err || !result) return reject(err ?? new Error('Upload failed'))
            resolve(result as { secure_url: string })
          }
        )
        .end(buffer)
    })

    const deposit = await Deposit.create({
      userId: session.user.id,
      amount: parsedAmount,
      screenshotUrl: uploadResult.secure_url,
      month: new Date(parsedMonth),
      note: parsedNote ?? '',
    })

    return NextResponse.json({ data: deposit }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/deposits]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
