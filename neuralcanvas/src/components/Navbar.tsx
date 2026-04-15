// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
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

    const navLinks = [
        { href: "/learn", label: "Learn" },
        { href: "/playground", label: "Playground" },
        { href: "/games", label: "Games" },
        { href: "/quiz", label: "Quiz" },
        { href: "/simulation", label: "Simulation" },
        { href: "/leaderboard", label: "Leaderboard" },
    ];

    return (
        <>
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
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
                                AIML Learn
                            </span>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent sm:hidden">
                                AIML
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition">
                                    {link.label}
                                </Link>
                            ))}
                            {isLoggedIn && (
                                <Link href="/progress" className="text-gray-300 hover:text-white transition">
                                    Progress
                                </Link>
                            )}
                        </div>

                        {/* Auth Buttons - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <div className="flex items-center space-x-4">
                                    <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
                                        👤 {userName.split(" ")[0]}
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
                                    <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed top-16 right-0 bottom-0 w-64 bg-black/95 backdrop-blur-md border-l border-white/10 z-40 md:hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isLoggedIn && (
                                <Link
                                    href="/progress"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                                >
                                    Progress
                                </Link>
                            )}
                            <div className="border-t border-white/10 pt-4 mt-4">
                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-purple-400 hover:bg-white/10 rounded-lg transition"
                                        >
                                            👤 {userName}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center mt-2"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}