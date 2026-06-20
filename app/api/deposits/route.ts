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

// GET /api/deposits — member's own deposit history
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

// POST /api/deposits — submit a deposit (multipart/form-data)
export async function POST(req: NextRequest) {
  let uploadedPublicId: string | null = null

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

    // 1. Validate scalar fields
    const parsed = CreateDepositSchema.safeParse({ amount, month, note })
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      )
    }

    // 2. Validate screenshot presence + constraints
    if (!file) {
      return NextResponse.json(
        { error: 'Screenshot is required', fields: { screenshot: 'Please attach a screenshot' } },
        { status: 400 }
      )
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          fields: { screenshot: 'Only JPG, PNG, or WebP images are allowed' },
        },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: 'File too large',
          fields: { screenshot: 'File size must not exceed 5 MB' },
        },
        { status: 400 }
      )
    }

    const { amount: parsedAmount, month: parsedMonth, note: parsedNote } = parsed.data

    // 3. Duplicate monthly deposit guard — check BEFORE uploading anything
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

    // 4. Upload to Cloudinary — isolated try/catch so we know exactly where a failure happened
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let uploadResult: { secure_url: string; public_id: string }
    try {
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `akbari-savings/deposits/${session.user.id}`,
              resource_type: 'image',
            },
            (err, result) => {
              if (err || !result) return reject(err ?? new Error('Cloudinary returned no result'))
              resolve(result as { secure_url: string; public_id: string })
            }
          )
          .end(buffer)
      })
    } catch (uploadError: any) {
      // Cloudinary errors carry useful structured info — log it properly, don't swallow it
      console.error('[POST /api/deposits] Cloudinary upload failed:', {
        message: uploadError?.message,
        http_code: uploadError?.http_code,
        name: uploadError?.name,
      })

      // 401/Invalid signature/Invalid API key class of errors from Cloudinary
      if (uploadError?.http_code === 401 || /invalid.*api.*key/i.test(uploadError?.message ?? '')) {
        return NextResponse.json(
          {
            error: 'Image upload service is misconfigured. Please contact an admin.',
          },
          { status: 502 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to upload screenshot. Please try again.' },
        { status: 502 }
      )
    }

    uploadedPublicId = uploadResult.public_id

    // 5. Create the deposit record
    let deposit
    try {
      deposit = await Deposit.create({
        userId: session.user.id,
        amount: parsedAmount,
        screenshotUrl: uploadResult.secure_url,
        month: new Date(parsedMonth),
        note: parsedNote ?? '',
      })
    } catch (dbError) {
      // Rollback: the image uploaded successfully but the DB write failed —
      // delete the orphaned Cloudinary asset so we don't leak storage
      console.error('[POST /api/deposits] DB write failed after successful upload, rolling back image:', dbError)
      if (uploadedPublicId) {
        await cloudinary.uploader.destroy(uploadedPublicId).catch((cleanupErr) => {
          console.error('[POST /api/deposits] Cleanup of orphaned image also failed:', cleanupErr)
        })
      }
      throw dbError // re-throw to hit the outer catch and return a generic 500
    }

    return NextResponse.json({ data: deposit }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/deposits]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}