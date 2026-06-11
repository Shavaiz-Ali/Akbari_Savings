import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILoan extends Document {
    _id: mongoose.Types.ObjectId
    memberId: mongoose.Types.ObjectId
    amount: number
    reason?: string
    status: 'pending' | 'approved' | 'rejected'
    interestRate: number
    approvedBy: mongoose.Types.ObjectId | null
    approvedAt: Date | null
    repaidAt: Date | null
    createdAt: Date
    updatedAt: Date
}

const LoanSchema = new Schema<ILoan>(
    {
        memberId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true, min: 0 },
        reason: { type: String, default: '' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        interestRate: { type: Number, default: 0, min: 0 },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        approvedAt: { type: Date, default: null },
        repaidAt: { type: Date, default: null },
    },
    { timestamps: true }
)

LoanSchema.index({ memberId: 1 })
LoanSchema.index({ status: 1 })

const Loan: Model<ILoan> = mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema)
export default Loan