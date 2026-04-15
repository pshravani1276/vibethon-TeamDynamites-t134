"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#030303] overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* Background Neon Glows (Registration Palette: Purple/Indigo/Pink) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[120px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 text-center z-10"
      >
        <Link href="/" className="inline-block group">
          <div className="flex items-center space-x-3 mb-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              Neural<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Canvas</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-[0.2em] uppercase opacity-70">
            Augment Your Intelligence
          </p>
        </Link>
      </motion.div>

      {/* Registration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full max-w-xl px-6"
      >
        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

          <div className="mb-10 text-left">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <ShieldCheck size={20} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Secure Protocol</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Profile</h2>
            <p className="text-gray-400 text-sm font-medium">Register your neural signature to begin learning.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Username */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-purple-400 transition-colors">
                Avatar Alias
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="NeonLearner"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:bg-white/[0.08] focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-pink-400 transition-colors">
                Neural ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-pink-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="neuro@link.com"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:bg-white/[0.08] focus:border-pink-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">
                Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:bg-white/[0.08] focus:border-indigo-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-400 transition-colors">
                Verify Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:bg-white/[0.08] focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-2xl p-[1px] font-bold transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 animate-pulse" />
                <div className="relative bg-[#080808] group-hover:bg-transparent rounded-2xl py-4 flex items-center justify-center space-x-2 transition-all duration-500">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                        <span className="text-white">Synthesizing Profile...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-white uppercase tracking-[0.2em] text-sm">Initiate Onboarding</span>
                        <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>
          </form>

          {/* Social Auth Linkage */}
          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#0c0c0c] px-4 text-gray-500 font-black tracking-[0.3em]">Neural Linkage</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-3 bg-white/5 border border-white/10 rounded-2xl py-3 text-white hover:bg-white/10 transition-all duration-300 group">
                <Github size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold">GitHub</span>
              </button>
              <button className="flex items-center justify-center space-x-3 bg-white/5 border border-white/10 rounded-2xl py-3 text-white hover:bg-white/10 transition-all duration-300 group">
                <Chrome size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Google</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Already have a neural ID?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors underline underline-offset-8 decoration-purple-500/30">
                Synchronize Session
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security Footnote */}
      <div className="mt-10 flex items-center space-x-3 text-gray-700">
        <div className="w-8 h-[1px] bg-gray-800" />
        <span className="text-[10px] uppercase font-bold tracking-[0.4em]">Biometric Encryption Active</span>
        <div className="w-8 h-[1px] bg-gray-800" />
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
