// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import {
    BookOpen,
    Code2,
    Gamepad2,
    Brain,
    Globe,
    Trophy,
    BarChart3,
    User,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    Sparkles,
    Home,
} from "lucide-react";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinks = [
        { href: "/learn", label: "Learn", icon: BookOpen },
        { href: "/playground", label: "Playground", icon: Code2 },
        { href: "/games", label: "Games", icon: Gamepad2 },
        { href: "/quiz", label: "Quiz", icon: Brain },
        { href: "/simulation", label: "Simulation", icon: Globe },
        { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-black/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10"
                        : "bg-black/30 dark:bg-black/30 backdrop-blur-md border-b border-white/5"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2.5 group">
                            <div className="relative">
                                <Sparkles className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                <div className="absolute inset-0 w-7 h-7 text-purple-400 blur-sm opacity-50 group-hover:opacity-75 transition-opacity">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:inline">
                                NeuralCanvas
                            </span>
                            <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent sm:hidden">
                                NC
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            {user && (
                                <Link
                                    href="/progress"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Progress
                                </Link>
                            )}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-amber-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-indigo-400" />
                                )}
                            </button>

                            {/* Auth Buttons - Desktop */}
                            <div className="hidden md:flex items-center space-x-2">
                                {user ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                                {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                                            </div>
                                            <span className="max-w-[100px] truncate">{user.name?.split(" ")[0] || "User"}</span>
                                        </Link>
                                        <button
                                            onClick={signOut}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                                            aria-label="Sign out"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium"
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
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Slide-in panel */}
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-16 right-0 bottom-0 w-72 bg-gray-950/95 backdrop-blur-xl border-l border-white/10 z-50 md:hidden overflow-y-auto"
                        >
                            <div className="flex flex-col p-4 space-y-1">
                                {user && (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                                            {(user.name?.[0] || "U").toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{user.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                        </div>
                                    </Link>
                                )}

                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-gray-500" />
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                {user && (
                                    <Link
                                        href="/progress"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <BarChart3 className="w-5 h-5 text-gray-500" />
                                        Progress
                                    </Link>
                                )}

                                <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                                    {user ? (
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Sign Out
                                        </button>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                            >
                                                <User className="w-5 h-5 text-gray-500" />
                                                Login
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-center font-medium mt-2"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}