// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabaseClient";
import { signInWithGoogle, getPasswordStrength } from "@/lib/auth";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Loader2, Shield } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showVerifyNotice, setShowVerifyNotice] = useState(false);

    const passwordStrength = getPasswordStrength(password);

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) addToast(error, "error");
        } catch {
            addToast("Google sign-up failed", "error");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
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

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name, display_name: name.split(" ")[0] },
                    emailRedirectTo: `${window.location.origin}/login?verified=true`,
                },
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // Create profile
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    email: email,
                    username: email.split("@")[0],
                    created_at: new Date().toISOString(),
                });

                // Check if email confirmation is required
                if (data.user.identities?.length === 0) {
                    setError("This email is already registered. Try logging in.");
                    setLoading(false);
                    return;
                }

                if (!data.session) {
                    // Email confirmation required
                    setShowVerifyNotice(true);
                    addToast("Check your email to verify your account!", "info", 8000);
                } else {
                    localStorage.setItem("user", JSON.stringify({
                        id: data.user.id,
                        email: data.user.email,
                        name: name,
                    }));
                    addToast("Account created successfully!", "success");
                    router.push("/dashboard");
                }
            }
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Failed to create account.");
            addToast("Signup failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (showVerifyNotice) {
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>
                <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md"
                    >
                        <div className="glass rounded-2xl p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 shadow-lg shadow-emerald-500/25">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
                            <p className="text-gray-400 mb-6">
                                We&apos;ve sent a verification link to <span className="text-white font-medium">{email}</span>. 
                                Click the link to activate your account.
                            </p>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                                <p className="text-sm text-emerald-400">
                                    Didn&apos;t receive the email? Check your spam folder or try signing up again.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Go to Login
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-8 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="glass rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4 shadow-lg shadow-purple-500/25">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-gray-400 mt-2 text-sm">Start your AI/ML learning journey today</p>
                        </div>

                        {/* Google OAuth */}
                        <button
                            onClick={handleGoogleSignup}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 mb-6"
                        >
                            {googleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Continue with Google
                        </button>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-3 bg-gray-950 text-gray-500">or create with email</span></div>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
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
                                {/* Password Strength Meter */}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
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
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
                            </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/5">
                            <p className="text-xs text-center text-gray-600">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}