// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useToast } from "@/components/Toast";
import { resetPassword } from "@/lib/auth";
import { Mail, ArrowLeft, ArrowRight, Loader2, KeyRound, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { success, error: resetError } = await resetPassword(email);

        if (success) {
            setSent(true);
            addToast("Password reset email sent!", "success");
        } else {
            setError(resetError || "Failed to send reset email");
            addToast("Failed to send reset email", "error");
        }

        setLoading(false);
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="glass rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
                        {sent ? (
                            /* Success State */
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 shadow-lg shadow-emerald-500/25">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
                                <p className="text-gray-400 mb-6 text-sm">
                                    We&apos;ve sent a password reset link to{" "}
                                    <span className="text-white font-medium">{email}</span>
                                </p>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-blue-400">
                                        The link will expire in 1 hour. Check your spam folder if you don&apos;t see it.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => { setSent(false); setEmail(""); }}
                                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all"
                                    >
                                        Try a different email
                                    </button>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* Form State */
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg shadow-orange-500/25">
                                        <KeyRound className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold">Forgot Password?</h1>
                                    <p className="text-gray-400 mt-2 text-sm">
                                        Enter your email and we&apos;ll send you a reset link
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                            <p className="text-red-400 text-sm text-center">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>

                                <div className="text-center mt-6">
                                    <Link href="/login" className="text-sm text-gray-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        Back to Login
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
