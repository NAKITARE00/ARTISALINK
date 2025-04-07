'use client'

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

const Account = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

    const openSignIn = () => {
        setAuthMode('signin');
        setShowAuthModal(true);
    };

    const openSignUp = () => {
        setAuthMode('signup');
        setShowAuthModal(true);
    };

    return (
        <div>
            {/* Your page content */}
            <button
                onClick={openSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Sign In
            </button>

            <button
                onClick={openSignUp}
                className="px-4 py-2 bg-green-500 text-white rounded ml-4"
            >
                Sign Up
            </button>

            <AuthModal
                show={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialMode={authMode}
            />
        </div>
    );

}

export default Account;