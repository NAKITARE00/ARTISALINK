import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const orders = await Order.find();

        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}