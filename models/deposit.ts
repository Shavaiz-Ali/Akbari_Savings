import mongoose, { Schema, Document, Model } from 'mongoose'
import { STATUSES, Status } from '@/lib/constants'

export interface IDeposit extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    amount: number
    screenshotUrl: string
    status: Status
    month: Date  // stored as first day of the month e.g. 2024-01-01
    note?: string
    createdAt: Date
    updatedAt: Date
}

const DepositSchema = new Schema<IDeposit>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true, min: 0 },
        screenshotUrl: { type: String, required: true },
        status: { type: String, enum: Object.values(STATUSES), default: STATUSES.PENDING },
        month: { type: Date, required: true }, // first day of month
        note: { type: String, default: '' },
    },
    { timestamps: true }
)

// One deposit per user per month
DepositSchema.index({ userId: 1, month: 1 }, { unique: true })
DepositSchema.index({ status: 1 })
DepositSchema.index({ month: 1 })

const Deposit: Model<IDeposit> = mongoose.models.Deposit || mongoose.model<IDeposit>('Deposit', DepositSchema)
export default Deposit