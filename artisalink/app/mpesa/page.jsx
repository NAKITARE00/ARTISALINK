'use client'
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function TriggerSTKPush() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone');
    const amount = searchParams.get('amount');
    const { router } = useAppContext()

    useEffect(() => {
        const triggerSTK = async () => {
            if (!phone || !amount) {
                console.warn('Missing phone or amount in query params');
                return;
            }

            try {
                const res = await axios.post('/api/stk-push', {
                    phone_number: phone,
                    amount: parseFloat(amount),
                    email: 'joe@doe.com',
                    host: 'https://yourwebsite.com',
                    api_ref: 'test',
                });

                console.log('STK Response:', res.data);
            } catch (err) {
                console.error('STK Error:', err);
            }
        };

        triggerSTK();
        setTimeout(() => {
            router.push('/order-placed')
        }, 5000)
    }, [phone, amount]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Triggering M-Pesa STK Push for {phone}...</p>
        </div>
    );
}



