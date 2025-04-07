import { NextResponse } from 'next/server';
const IntaSend = require('intasend-node');

export async function POST(request) {
    try {
        const { amount, phone_number } = await request.json();

        if (!amount || !phone_number) {
            return NextResponse.json(
                { success: false, message: 'Amount and phone number are required' },
                { status: 400 }
            );
        }

        const intasend = new IntaSend(
            `${process.env.INTASEND_PUBKEY}`,
            `${process.env.INTASEND_SECKEY}`,
            true,
        );

        const collection = intasend.collection();
        const response = await collection.mpesaStkPush({
            first_name: 'Customer', // You might want to get this from user data
            last_name: 'User',      // You might want to get this from user data
            email: 'customer@example.com', // You might want to get this from user data
            host: 'https://08aa-102-68-77-133.ngrok-free.app', // Your callback URL
            amount: Number(amount),
            phone_number: phone_number,
            api_ref: 'ecommerce-payment', // More descriptive reference
        });

        console.log(`STK Push Resp:`, response);
        return NextResponse.json({ success: true, data: response });
    } catch (error) {
        console.error(`STK Push Resp error:`, error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}