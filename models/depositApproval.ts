import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDepositApproval extends Document {
    _id: mongoose.Types.ObjectId
    depositId: mongoose.Types.ObjectId
    adminId: mongoose.Types.ObjectId
    action: 'approved' | 'rejected'
    note?: string
    createdAt: Date
}

const DepositApprovalSchema = new Schema<IDepositApproval>(
    {
        depositId: { type: Schema.Types.ObjectId, ref: 'Deposit', required: true },
        adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, enum: ['approved', 'rejected'], required: true },
        note: { type: String, default: '' },
    },
    { timestamps: true }
)

// One action per admin per deposit
DepositApprovalSchema.index({ depositId: 1, adminId: 1 }, { unique: true })
DepositApprovalSchema.index({ depositId: 1 })
DepositApprovalSchema.index({ adminId: 1 })

const DepositApproval: Model<IDepositApproval> =
    mongoose.models.DepositApproval ||
    mongoose.model<IDepositApproval>('DepositApproval', DepositApprovalSchema)
export default DepositApproval