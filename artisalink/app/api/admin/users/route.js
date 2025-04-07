import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const users = await User.find(); // Fetch all users

        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" });
        }

        const deleted = await User.findByIdAndDelete(userId);

        if (!deleted) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
