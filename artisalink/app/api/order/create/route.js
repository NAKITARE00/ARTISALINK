import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }

        await connectDB();

        // Calculate amount using items
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% for fees/tax
        const totalAmount = amount + Math.floor(amount * 0.02);

        // Create the order directly
        const newOrder = await Order.create({
            userId,
            address,
            items,
            amount: totalAmount,
            date: new Date(),
        });

        // Clear user cart
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = {};
            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Order created successfully",
            order: newOrder,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: `Error: ${error.message}`,
        });
    }
}