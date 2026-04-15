"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LearnPage() {
    return (
        <div className="min-h-screen bg-[#0A0A1A] text-white flex flex-col items-center justify-center px-6">

            <h1 className="text-5xl font-bold mb-4 text-center">
                NeuralCanvas Learning Hub
            </h1>

            <p className="text-gray-400 text-center mb-12 max-w-xl">
                Explore Artificial Intelligence concepts through interactive lessons,
                visual simulations, quizzes, and hands-on experiments.
            </p>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

                {/* Beginner */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
                >
                    <h2 className="text-2xl font-semibold mb-3">Beginner</h2>

                    <p className="text-gray-400 mb-6">
                        Start your AI journey with fundamental concepts like
                        Machine Learning basics, clustering, and regression.
                    </p>

                    <Link
                        href="/learn/beginner"
                        className="px-6 py-3 bg-blue-500 rounded-lg"
                    >
                        Start Learning
                    </Link>
                </motion.div>

                {/* Intermediate */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
                >
                    <h2 className="text-2xl font-semibold mb-3">Intermediate</h2>

                    <p className="text-gray-400 mb-6">
                        Dive deeper into neural networks, decision trees,
                        and reinforcement learning techniques.
                    </p>

                    <Link
                        href="/learn/intermediate"
                        className="px-6 py-3 bg-purple-500 rounded-lg"
                    >
                        Explore Modules
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}