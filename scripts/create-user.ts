// Run from project root:
// npx tsx scripts/create-user.ts

// Must be first — before any other imports
import { config } from 'dotenv'
import path from 'path'
config({ path: path.resolve(process.cwd(), '.env.local') })

// Now safe to import modules that read process.env
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { connectDB } from '../lib/mongodb'
import User from '../models/user'
import AppSettings from '../models/appSettings'

async function main() {
    await connectDB()

    const admins = [
        { fullName: 'Admin One', email: 'admin1@akbarisavings.com', password: 'CHANGE_ME_1' },
        { fullName: 'Admin Two', email: 'admin2@akbarisavings.com', password: 'CHANGE_ME_2' },
        { fullName: 'Admin Three', email: 'admin3@akbarisavings.com', password: 'CHANGE_ME_3' },
    ]

    for (const admin of admins) {
        const exists = await User.findOne({ email: admin.email })
        if (!exists) {
            const passwordHash = await bcrypt.hash(admin.password, 12)
            await User.create({
                fullName: admin.fullName,
                email: admin.email,
                passwordHash,
                role: 'admin',
                monthlyTarget: 5000,
                isActive: true,
                approvedAt: new Date(),
            })
            console.log(`✓ Created admin: ${admin.email}`)
        } else {
            console.log(`— Skipped (already exists): ${admin.email}`)
        }
    }

    await AppSettings.bulkWrite([
        { updateOne: { filter: { key: 'loans_enabled' }, update: { $setOnInsert: { key: 'loans_enabled', value: 'false' } }, upsert: true } },
        { updateOne: { filter: { key: 'platform_name' }, update: { $setOnInsert: { key: 'platform_name', value: 'Akbari Savings' } }, upsert: true } },
        { updateOne: { filter: { key: 'currency' }, update: { $setOnInsert: { key: 'currency', value: 'PKR' } }, upsert: true } },
    ])

    console.log('✓ App settings seeded')
    console.log('Done.')
    await mongoose.disconnect()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})