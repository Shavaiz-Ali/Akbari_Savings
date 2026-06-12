import mongoose from 'mongoose'

let cached = (global as any).mongoose as {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB(): Promise<typeof mongoose> {
    // Read URI here (lazily) — not at module load time
    // This way dotenv has already run by the time this function is called
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables')
    }

    if (cached.conn) {
        console.log("Database Connected: Cached connection")
        return cached.conn
    }

    if (!cached.promise) {
        console.log("Database Connecting...")
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise
    console.log("Database Connected: new connection")
    return cached.conn
}