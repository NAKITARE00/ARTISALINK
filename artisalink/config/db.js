import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log("Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Creating new MongoDB connection...");
        const opts = { bufferCommands: false };

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/artisalink`, opts)
            .then((mongoose) => {
                console.log("Connected to MongoDB");
                return mongoose;
            })
            .catch((err) => {
                console.error("MongoDB Connection Error:", err);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
