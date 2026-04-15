// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
            setUserName(JSON.parse(user).name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🤖</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AIML Learn
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/learn" className="text-gray-300 hover:text-white transition">
                            Learn
                        </Link>

                        <Link href="/games" className="text-gray-300 hover:text-white transition">
                            Games
                        </Link>
                        <Link href="/quiz" className="text-gray-300 hover:text-white transition">
                            Quiz
                        </Link>

                        {isLoggedIn && (
                            <Link href="/progress" className="text-gray-300 hover:text-white transition">
                                Progress
                            </Link>
                        )}

                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
                                    👤 {userName}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}