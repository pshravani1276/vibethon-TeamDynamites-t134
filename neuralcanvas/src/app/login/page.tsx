// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabaseClient";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { signInWithGoogle, getPasswordStrength } from "@/lib/auth";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Loader2, Gamepad2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [supabaseReady, setSupabaseReady] = useState(true);

    // Check if Supabase is configured
    useEffect(() => {
        if (!isSupabaseConfigured) {
            console.warn("Supabase not configured, using demo mode");
            setSupabaseReady(false);
        }

        // Check for verified=true query param
        const params = new URLSearchParams(window.location.search);
        if (params.get("verified") === "true") {
            addToast("Email verified successfully! You can now sign in.", "success");
        }
    }, [addToast]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Demo mode
        if (!supabaseReady) {
            if (email && password) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: "demo-user-123",
                        email: email,
                        name: email.split("@")[0],
                    })
                );
                addToast("Welcome back! (Demo Mode)", "success");
                setTimeout(() => router.push("/dashboard"), 500);
            } else {
                setError("Please enter email and password");
                setLoading(false);
            }
            return;
        }

        // Real Supabase login
        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.user_metadata?.full_name || email.split("@")[0],
                    })
                );
                addToast("Welcome back!", "success");
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
            addToast("Login failed. Please check your credentials.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                console.error("Google Login Handled Error:", error);
                addToast(error, "error");
                setError(error);
            }
        } catch (err: any) {
            console.error("Google Login Unhandled Exception:", err);
            addToast("Google sign-in failed: " + (err.message || "Unknown error"), "error");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleDemoLogin = () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: "demo-user",
                email: "demo@neuralcanvas.ai",
                name: "Demo User",
            })
        );
        addToast("Welcome to NeuralCanvas! (Demo Mode)", "success");
        router.push("/dashboard");
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
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/25">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 mt-2 text-sm">Sign in to continue your learning journey</p>
                        </div>

                        {/* Google OAuth */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || !supabaseReady}
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

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-gray-950 text-gray-500">or sign in with email</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-white placeholder-gray-600 text-sm transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500 focus:ring-purple-500/30"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-400">
                                    Remember me
                                </label>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"
                                >
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Mode */}
                        {!supabaseReady && (
                            <div className="mt-4">
                                <button
                                    onClick={handleDemoLogin}
                                    className="w-full py-3 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Gamepad2 className="w-4 h-4 text-emerald-400" />
                                    Try Demo Mode
                                </button>
                            </div>
                        )}

                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {!supabaseReady && (
                            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <p className="text-xs text-center text-amber-400/80">
                                    ⚠️ Supabase not configured — using demo mode with local storage.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}