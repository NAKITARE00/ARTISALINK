import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");
        const files = formData.getAll("images");

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No files uploaded" });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map((result) => result.secure_url);

        await connectDB();
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            date: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Product added successfully",
            newProduct,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Error: ${error.message}`,
        });
    }
}

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);

        const formData = await request.formData();
        const productId = formData.get("productId");
        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");
        const files = formData.getAll("images");

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        await connectDB();
        const product = await Product.findByIdAndUpdate(productId);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        let image = product.image;

        if (files && files.length > 0 && files[0].size > 0) {
            const uploadResults = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: "auto" },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        stream.end(buffer);
                    });
                })
            );
            image = uploadResults.map((r) => r.secure_url);
        }


        product.name = name;
        product.description = description;
        product.category = category;
        product.price = Number(price);
        product.offerPrice = Number(offerPrice);
        product.image = image;

        await product.save()

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: `Error: ${error.message}`,
        });
    }
}