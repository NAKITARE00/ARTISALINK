'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UpdateRoleModal({ isOpen, onClose, user_id }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        _id: user_id,
        name: '',
        role: 'Buyer'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post('/api/user/role', {
                ...formData,
                _id: user_id // Ensure we use the correct user ID
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                toast.success(data.message);
                onClose(true); // Pass true to indicate success
                router.refresh();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to set role');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={() => onClose(false)}
                    aria-hidden="true"
                />

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md">
                    <button
                        onClick={() => onClose(false)}
                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Select Your Role
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Your Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    placeholder="Enter your name"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    I am a *
                                </label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio h-4 w-4 text-blue-600"
                                            name="role"
                                            value="Buyer"
                                            checked={formData.role === 'Buyer'}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span className="ml-2 text-gray-700">Buyer</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio h-4 w-4 text-blue-600"
                                            name="role"
                                            value="Seller"
                                            checked={formData.role === 'Seller'}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span className="ml-2 text-gray-700">Seller</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => onClose(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}