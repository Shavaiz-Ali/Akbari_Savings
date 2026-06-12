import { connectDB } from '@/lib/mongodb'
import AppSettings from '@/models/appSettings'

export async function checkLoansEnabled(): Promise<boolean> {
  await connectDB()
  const setting = await AppSettings.findOne({ key: 'loans_enabled' })
  return setting?.value === 'true'
}
