import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        await connectDB()

        const products = await Product.find({})
        return NextResponse.json({ success: true, products })

    }
    catch (error) {
        return NextResponse.json({ sucess: false }, error.message)
    }
}