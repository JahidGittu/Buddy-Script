import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const connectionString = MONGODB_URI as string;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => {
      // Use mongooseInstance instead of mongoose to avoid confusion
      const db = mongooseInstance.connection.db;
      if (db) {
        console.log('✅ Connected to database:', db.databaseName);
        console.log('✅ Database host:', mongooseInstance.connection.host);
      }
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Helper function to safely get database instance
export async function getDatabase() {
  const mongooseInstance = await connectToDatabase();
  const db = mongooseInstance.connection.db;
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export { connectToDatabase };