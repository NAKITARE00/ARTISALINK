import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB()
        const products = await Product.find()

        return NextResponse.json({ success: true, products })

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

export async function DELETE(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        const deleted = await Product.findByIdAndDelete(productId);

        if (!deleted) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }

}