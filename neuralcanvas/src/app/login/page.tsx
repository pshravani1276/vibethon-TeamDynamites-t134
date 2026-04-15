// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseReady, setSupabaseReady] = useState(true);

  // Check if Supabase is configured
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey || supabaseUrl === "your_supabase_project_url") {
          console.warn("Supabase not configured, using demo mode");
          setSupabaseReady(false);
        }
      } catch (err) {
        setSupabaseReady(false);
      }
    };
    checkSupabase();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo mode if Supabase is not configured
    if (!supabaseReady) {
      if (email && password) {
        // Demo login - accept any credentials
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "demo-user-123",
            email: email,
            name: email.split("@")[0],
          })
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setError("Please enter email and password");
        setLoading(false);
      }
      return;
    }

    // Real Supabase login
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (loginError) {
        throw loginError;
      }

      if (data.user) {
        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || email.split("@")[0],
          })
        );

        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "demo-user",
        email: "demo@example.com",
        name: "Demo User",
      })
    );
    router.push("/dashboard");
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
                Welcome Back
              </h1>
              <p className="text-gray-400 mt-2">Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="••••••••"
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
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {!supabaseReady && (
              <div className="mt-4">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg font-semibold transition-all duration-300"
                >
                  🎮 Try Demo Mode
                </button>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/50 text-gray-400">Or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300">
                  Sign up
                </Link>
              </p>
            </div>

            {!supabaseReady && (
              <div className="mt-6 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-xs text-center text-yellow-400">
                  ⚠️ Supabase not configured. Using demo mode with local storage.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}