import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const role = formData.get("role");

        await connectDB();

        const newUser = await User.create({
            _id: userId,
            name,
            email,
            password,
            role,
            cartItems: {},
            imageUrl: "https://via.placeholder.com/150",
        });

        return NextResponse.json({
            success: true,
            message: "Sign up successful",
            newUser,
        });
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to create user" },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        await connectDB()
        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" })
        }

        return NextResponse.json({ success: true, user })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}

export async function PUT(request) {
    try {
        await connectDB()
        const body = await request.json()
        const { productId } = body

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" })
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, body.product)

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" })
        }
    } catch {

        return NextResponse.json({ success: false, message: "Product not found" })
    }
}