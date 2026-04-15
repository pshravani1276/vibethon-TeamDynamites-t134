"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Top Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 z-10"
      >
        <Link href="/">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            NeuralCanvas
          </h1>
        </Link>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Subtle light effect on card top */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 font-medium"
            >
              Continue your AI learning journey
            </motion.p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center space-x-2 text-gray-400 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-black/40 accent-purple-500" />
                <span className="group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="relative w-full group overflow-hidden rounded-2xl p-[1px] font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x" />
              <div className="relative bg-[#050505] rounded-2xl py-4 flex items-center justify-center space-x-2 group-hover:bg-transparent transition-colors duration-300">
                <span className="text-white group-hover:text-white transition-colors">Sign In</span>
                <ArrowRight size={18} className="text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121212]/50 backdrop-blur-xl px-4 text-gray-500 font-semibold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex items-center justify-center space-x-3 text-white hover:bg-white/10 transition-all duration-300 group">
              <Github size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">GitHub</span>
            </button>
          </div>

          <p className="mt-10 text-center text-gray-400 font-medium">
            Don't have an account?{" "}
            <Link href="#" className="text-white hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-blue-400">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="mt-12 text-gray-600 text-sm font-medium tracking-widest uppercase z-10">
        &copy; 2024 NeuralCanvas AI
      </div>
    </div>
  );
}
