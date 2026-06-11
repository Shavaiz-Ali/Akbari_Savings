import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId
    fullName: string
    email: string
    passwordHash: string
    role: 'admin' | 'member'
    monthlyTarget: number
    totalBalance: number
    createdBy: mongoose.Types.ObjectId | null      // admin who created directly, null if self-signup
    isActive: boolean                               // false until an admin approves
    approvedBy: mongoose.Types.ObjectId | null      // which admin approved the account
    approvedAt: Date | null                         // when the account was approved
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        monthlyTarget: { type: Number, default: 0, min: 0 },
        totalBalance: { type: Number, default: 0, min: 0 },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        isActive: { type: Boolean, default: false },  // always false until approved
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        approvedAt: { type: Date, default: null },
    },
    { timestamps: true }
)

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })  // for fast pending approvals query

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export default User