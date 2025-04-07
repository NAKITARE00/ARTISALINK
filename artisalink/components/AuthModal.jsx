'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthModal({ show, onClose, initialMode = 'signin' }) {
    const [isSignIn, setIsSignIn] = useState(true);

    useEffect(() => {
        setIsSignIn(initialMode === 'signin');
    }, [initialMode, show]);

    const toggleAuthMode = () => setIsSignIn(!isSignIn);

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center p-4 text-center">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal content */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {isSignIn ? 'Sign in to your account' : 'Create a new account'}
                            </h2>

                            {isSignIn ? (
                                <SignIn onToggleAuth={toggleAuthMode} onSuccess={onClose} />
                            ) : (
                                <SignUp onToggleAuth={toggleAuthMode} onSuccess={onClose} />
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}