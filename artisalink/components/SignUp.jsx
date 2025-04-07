import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import { SignIn } from "@clerk/nextjs";
import {
    UserIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline";

export default function SignUp({ onToggleAuth, onSuccess }) {
    const router = useRouter();
    const { signUp } = useSignUp();
    const { signIn } = useSignIn();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) return setError("Passwords don't match");
        if (!userRole) return setError("Please select a role");
        if (password.length < 8) return setError("Password must be at least 8 characters");

        setError('');
        setLoading(true);

        try {
            // 1. Create Clerk account
            await signUp.create({ emailAddress: email, password });

            // 2. Skip verification (only works if disabled in Clerk dashboard)
            await signUp.prepareEmailAddressVerification({ strategy: "none" });
            await signUp.activate();

            // 3. Sign in user
            const signedIn = await signIn.create({ identifier: email, password });

            // 4. Get session token
            const token = await signedIn.getToken();

            // 5. Send user data to your DB
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("role", userRole);

            await axios.post("/api/user/data", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onSuccess?.();
            router.refresh();
        } catch (err) {
            console.error("Signup error:", err);
            setError(err?.response?.data?.message || err.message || "Failed to sign up.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            {/* Role Selection */}
            <div>
                <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
                    I am a
                </label>
                <select
                    id="user-role"
                    required
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                >
                    <option value="" disabled>Select your role</option>
                    <option value="seller">Seller</option>
                    <option value="client">Client</option>
                </select>
            </div>

            {/* Password Fields */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password (min 8 characters)
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="••••••••"
                />
            </div>
            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="••••••••"
                />
            </div>

            {/* Submit */}
            <div id="clerk-captcha" />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm disabled:opacity-50"
            >
                {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Toggle Auth */}
            <p className="text-sm text-center text-gray-500">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onToggleAuth}
                    className="text-blue-600 hover:underline"
                >
                    Sign in
                </button>
            </p>
        </form>
    );
}
