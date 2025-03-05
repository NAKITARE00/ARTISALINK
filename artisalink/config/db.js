import mongoose from "mongoose";
import { NEXT_CACHE_TAGS_HEADER } from "next/dist/lib/constants";

let cached =  global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/artisalink`, opts).then((mongoose) => {
            console.log("Connected to MongoDB");
            return mongoose;
        })

        cached.conn = await cached.promise;
        return cached.conn;
    }

}

export default connectDB;