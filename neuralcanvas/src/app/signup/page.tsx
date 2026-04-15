// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // Sign up with Supabase
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        display_name: name.split(" ")[0],
                    },
                },
            });

            if (signUpError) {
                throw signUpError;
            }

            if (data.user) {
                // Store user info in localStorage for demo purposes
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.user.id,
                        email: data.user.email,
                        name: name,
                    })
                );

                // Redirect to dashboard
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />

            <div className="relative z-20">
                <Navbar />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mx-4"
                >
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-gray-400 mt-2">Start your AI/ML learning journey today</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                                    placeholder="Create a password (min. 6 characters)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <p className="text-xs text-center text-gray-500">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}