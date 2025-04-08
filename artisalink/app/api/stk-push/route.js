import { NextResponse } from 'next/server';
const IntaSend = require('intasend-node');

export async function POST(req) {
    const body = await req.json();

    const intasend = new IntaSend(
        process.env.INTASEND_PUBKEY,
        process.env.INTASEND_SECKEY,
        true // Set to false in production
    );

    const collection = intasend.collection();

    try {
        const result = await collection.mpesaStkPush({
            first_name: body.first_name || 'Joe',
            last_name: body.last_name || 'Doe',
            email: body.email || 'joe@doe.com',
            host: body.host || 'https://yourwebsite.com',
            amount: body.amount || 10,
            phone_number: body.phone_number,
            api_ref: body.api_ref || 'test',
        });

        return NextResponse.json({ success: true, data: result });
    } catch (err) {
        console.error('STK Push error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
