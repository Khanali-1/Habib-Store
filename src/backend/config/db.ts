import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI in .env.local");
}

// global object ko TypeScript ko bata rahe hain ke ispe mongoose property bhi ho sakti hai
let cached = (global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;// actual connection ya null
    promise: Promise<typeof mongoose> | null;// connection banne ka promise ya null
  };
}).mongoose;// end mein us mongoose property ko nikaal rahe hain

if (!cached) {
  cached = (global as typeof globalThis & {
    mongoose?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI);
  }

  cached!.conn = await cached!.promise;

  return cached!.conn;
}

export default connectDB;