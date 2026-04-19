// src/app/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useToast } from "@/components/Toast";
import { updatePassword, getPasswordStrength } from "@/lib/auth";
import { Eye, EyeOff, Lock, ArrowRight, Loader2, Shield, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const { success: ok, error: resetError } = await updatePassword(password);

        if (ok) {
            setSuccess(true);
            addToast("Password updated successfully!", "success");
            setTimeout(() => router.push("/login"), 3000);
        } else {
            setError(resetError || "Failed to update password");
            addToast("Failed to update password", "error");
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
                        {success ? (
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 shadow-lg shadow-emerald-500/25">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">Password Updated!</h2>
                                <p className="text-gray-400 mb-6 text-sm">
                                    Your password has been updated successfully. Redirecting to login...
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Go to Login
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg shadow-purple-500/25">
                                        <Lock className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold">Set New Password</h1>
                                    <p className="text-gray-400 mt-2 text-sm">
                                        Choose a strong password for your account
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                                placeholder="Min. 6 characters"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {password.length > 0 && (
                                            <div className="mt-2 space-y-1.5">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength.score ? passwordStrength.color : 'bg-gray-700'}`} />
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-400">{passwordStrength.label}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                                placeholder="Confirm password"
                                                required
                                            />
                                        </div>
                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-400 mt-1.5">Passwords don&apos;t match</p>
                                        )}
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                            <p className="text-red-400 text-sm text-center">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Update Password</span><ArrowRight className="w-4 h-4" /></>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
