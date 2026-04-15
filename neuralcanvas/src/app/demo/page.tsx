"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

const DemoHub = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [router]);

    const demos = [
        {
            id: 1,
            name: "Linear Regression Visualizer",
            description: "Interactive visualization of linear regression with real-time parameter adjustment. See how changing slope and intercept affects the line of best fit.",
            icon: "📈",
            color: "from-blue-500 to-cyan-500",
            category: "regression",
            difficulty: "Beginner",
            duration: "10 min",
            features: ["Real-time updates", "Interactive controls", "Data point manipulation"],
            path: "/demo/linear-regression"
        },
        {
            id: 2,
            name: "Decision Tree Explorer",
            description: "Build and visualize decision trees interactively. Understand how splitting works with different datasets.",
            icon: "🌳",
            color: "from-green-500 to-emerald-500",
            category: "classification",
            difficulty: "Intermediate",
            duration: "15 min",
            features: ["Tree visualization", "Split animation", "Dataset options"],
            path: "/demo/decision-tree"
        },
        {
            id: 3,
            name: "Neural Network Playground",
            description: "Build and train neural networks in your browser. Experiment with layers, neurons, and activation functions.",
            icon: "🧠",
            color: "from-purple-500 to-pink-500",
            category: "deep-learning",
            difficulty: "Advanced",
            duration: "20 min",
            features: ["Custom architecture", "Training visualization", "Loss curves"],
            path: "/demo/neural-network"
        },
        {
            id: 4,
            name: "K-Nearest Neighbors",
            description: "Visualize how KNN classifies points based on nearest neighbors. Adjust K value and see decision boundaries change.",
            icon: "🔍",
            color: "from-orange-500 to-red-500",
            category: "classification",
            difficulty: "Beginner",
            duration: "12 min",
            features: ["K-value slider", "Decision boundary", "Interactive points"],
            path: "/demo/knn"
        },
        {
            id: 5,
            name: "PCA Visualization",
            description: "See how Principal Component Analysis reduces dimensionality while preserving variance in your data.",
            icon: "📊",
            color: "from-indigo-500 to-purple-500",
            category: "dimensionality",
            difficulty: "Advanced",
            duration: "15 min",
            features: ["2D/3D projection", "Variance explained", "Custom data"],
            path: "/demo/pca"
        },
        {
            id: 6,
            name: "Clustering Algorithms",
            description: "Compare K-Means, DBSCAN, and Hierarchical clustering on different datasets.",
            icon: "🎯",
            color: "from-pink-500 to-rose-500",
            category: "clustering",
            difficulty: "Intermediate",
            duration: "18 min",
            features: ["Multiple algorithms", "Parameter tuning", "Visual feedback"],
            path: "/demo/clustering"
        }
    ];

    const categories = ["all", "regression", "classification", "clustering", "deep-learning", "dimensionality"];

    const filteredDemos = demos.filter(demo => {
        const matchesCategory = selectedCategory === "all" || demo.category === selectedCategory;
        const matchesSearch = demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demo.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading demos...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />

            <div className="relative z-20">
                <Navbar />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Interactive Demos
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Learn AI/ML concepts through hands-on interactive visualizations.
                        Experiment, play, and understand how algorithms work in real-time.
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search demos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
                            />
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Category Filters */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${selectedCategory === category
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                        <div className="text-3xl mb-2">🎮</div>
                        <div className="text-2xl font-bold text-purple-400">{demos.length}</div>
                        <div className="text-sm text-gray-400">Interactive Demos</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="text-2xl font-bold text-purple-400">Real-time</div>
                        <div className="text-sm text-gray-400">Visual Feedback</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-2xl font-bold text-purple-400">Hands-on</div>
                        <div className="text-sm text-gray-400">Learning Experience</div>
                    </div>
                </motion.div>

                {/* Demos Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {filteredDemos.map((demo, idx) => (
                        <motion.div
                            key={demo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group"
                        >
                            <Link href={demo.path}>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden h-full">
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-5xl w-16 h-16 rounded-2xl bg-gradient-to-br ${demo.color} flex items-center justify-center shadow-lg`}>
                                                    {demo.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold">{demo.name}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded ${demo.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                                                            demo.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                                                                "bg-red-500/20 text-red-400"
                                                            }`}>
                                                            {demo.difficulty}
                                                        </span>
                                                        <span className="text-xs text-gray-400">⏱️ {demo.duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                →
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-300 mb-4">
                                            {demo.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {demo.features.map((feature, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-400 capitalize">
                                            {demo.category}
                                        </div>
                                    </div>

                                    {/* Progress indicator */}
                                    <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredDemos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No demos found</h3>
                        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
                        <h3 className="text-2xl font-bold mb-2">Want to learn more?</h3>
                        <p className="text-gray-300 mb-4">
                            After exploring the demos, head to our learning path to master these concepts in depth!
                        </p>
                        <Link
                            href="/learn"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Start Learning Path →
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DemoHub;