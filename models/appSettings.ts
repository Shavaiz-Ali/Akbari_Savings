import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAppSettings extends Document {
    key: string
    value: string
    updatedAt: Date
}

const AppSettingsSchema = new Schema<IAppSettings>(
    {
        key: { type: String, required: true, unique: true },
        value: { type: String, required: true },
    },
    { timestamps: true }
)

const AppSettings: Model<IAppSettings> =
    mongoose.models.AppSettings ||
    mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema)
export default AppSettings