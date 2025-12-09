import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGO_DB_URI is not defined.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,          // IMPORTANT for serverless
      serverSelectionTimeoutMS: 5000, // fail fast instead of stalling
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
