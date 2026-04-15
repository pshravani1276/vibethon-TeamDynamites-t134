// src/app/learn/beginner/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Module {
    id: number;
    title: string;
    description: string;
    duration: string;
    level: string;
    completed: boolean;
    points: number;
}

export default function BeginnerLearningPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [showContent, setShowContent] = useState(false);
    const [modules, setModules] = useState<Module[]>([
        {
            id: 1,
            title: "What is Artificial Intelligence?",
            description: "Understand the basics of AI and its applications in the real world",
            duration: "15 min",
            level: "Beginner",
            completed: false,
            points: 50
        },
        {
            id: 2,
            title: "Introduction to Machine Learning",
            description: "Learn what Machine Learning is and how it differs from traditional programming",
            duration: "20 min",
            level: "Beginner",
            completed: false,
            points: 50
        },
        {
            id: 3,
            title: "Types of Machine Learning",
            description: "Explore Supervised, Unsupervised, and Reinforcement Learning",
            duration: "25 min",
            level: "Beginner",
            completed: false,
            points: 75
        },
        {
            id: 4,
            title: "Python Basics for ML",
            description: "Essential Python concepts needed for Machine Learning",
            duration: "30 min",
            level: "Beginner",
            completed: false,
            points: 100
        },
        {
            id: 5,
            title: "Your First ML Model",
            description: "Build a simple linear regression model from scratch",
            duration: "35 min",
            level: "Beginner",
            completed: false,
            points: 100
        }
    ]);

    const [totalPoints, setTotalPoints] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserAndProgress = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            // Fetch user's completed modules from database
            const { data: completedModules } = await supabase
                .from("user_progress")
                .select("module_id")
                .eq("user_id", currentUser.id)
                .eq("completed", true);

            if (completedModules) {
                const completedIds = new Set(completedModules.map((m: any) => m.module_id));
                setModules(prev => prev.map(module => ({
                    ...module,
                    completed: completedIds.has(module.id)
                })));
            }

            // Fetch total points from quiz_scores
            const { data: quizScores } = await supabase
                .from("quiz_scores")
                .select("score")
                .eq("user_id", currentUser.id);

            if (quizScores) {
                const total = quizScores?.reduce((sum: number, q: any) => sum + (q.score || 0), 0) || 0;
                setTotalPoints(total);
            }
        };

        fetchUserAndProgress();
    }, [router]);

    const moduleContent = {
        1: {
            title: "What is Artificial Intelligence?",
            content: `
        Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans.
        
        Key Concepts:
        • Machine Learning: Systems that learn from data
        • Deep Learning: Neural networks with multiple layers
        • Natural Language Processing: Understanding human language
        • Computer Vision: Interpreting visual information
        
        Real-world applications include:
        • Virtual assistants (Siri, Alexa)
        • Recommendation systems (Netflix, Amazon)
        • Self-driving cars
        • Medical diagnosis
      `,
        },
        2: {
            title: "Introduction to Machine Learning",
            content: `
        Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.
        
        Traditional Programming vs Machine Learning:
        • Traditional: Input Data + Rules = Output
        • ML: Input Data + Output = Rules
        
        The ML Process:
        1. Collect data
        2. Prepare data
        3. Choose a model
        4. Train the model
        5. Evaluate the model
        6. Make predictions
      `,
        },
        3: {
            title: "Types of Machine Learning",
            content: `
        Three Main Types of Machine Learning:
        
        1. Supervised Learning
        • Learns from labeled data
        • Examples: Classification, Regression
        • Use cases: Spam detection, price prediction
        
        2. Unsupervised Learning
        • Finds patterns in unlabeled data
        • Examples: Clustering, Association
        • Use cases: Customer segmentation, recommendation systems
        
        3. Reinforcement Learning
        • Learns through trial and error
        • Agent learns from rewards/punishments
        • Use cases: Game playing, robotics
      `,
        },
        4: {
            title: "Python Basics for ML",
            content: `
        Essential Python Libraries for ML:
        
        1. NumPy: Numerical computing
        • Arrays and matrices
        • Mathematical functions
        
        2. Pandas: Data manipulation
        • DataFrames
        • Data cleaning and analysis
        
        3. Matplotlib: Data visualization
        • Plots and charts
        • Visualizing data patterns
        
        4. Scikit-learn: Machine Learning
        • Pre-built algorithms
        • Model evaluation tools
        
        Example Code:
        \`\`\`python
        import numpy as np
        import pandas as pd
        from sklearn import datasets
        
        # Load a dataset
        iris = datasets.load_iris()
        print(iris.data.shape)
        \`\`\`
      `,
        },
        5: {
            title: "Your First ML Model",
            content: `
        Building a Linear Regression Model:
        
        Step 1: Import libraries
        \`\`\`python
        from sklearn.linear_model import LinearRegression
        import numpy as np
        \`\`\`
        
        Step 2: Create data
        \`\`\`python
        X = np.array([[1], [2], [3], [4]])
        y = np.array([2, 4, 6, 8])
        \`\`\`
        
        Step 3: Train model
        \`\`\`python
        model = LinearRegression()
        model.fit(X, y)
        \`\`\`
        
        Step 4: Make predictions
        \`\`\`python
        prediction = model.predict([[5]])
        print(prediction)  # Output: 10
        \`\`\`
      `,
        },
    };

    const handleModuleClick = (moduleId: number) => {
        setSelectedModule(moduleId);
        setShowContent(true);
    };

    const handleBack = () => {
        setSelectedModule(null);
        setShowContent(false);
        setMessage("");
    };

    const handleComplete = async () => {
        if (!selectedModule || !user) return;

        const module = modules[selectedModule - 1];

        // Check if already completed
        if (module.completed) {
            setMessage("You've already completed this module!");
            setTimeout(() => setMessage(""), 3000);
            return;
        }

        try {
            // Save to user_progress table
            const { error: progressError } = await supabase
                .from("user_progress")
                .insert({
                    user_id: user.id,
                    module_id: selectedModule,
                    module_name: module.title,
                    completed: true,
                    points_earned: module.points,
                    completed_at: new Date().toISOString()
                });

            if (progressError) throw progressError;

            // Also save as quiz score (for points tracking)
            const { error: scoreError } = await supabase
                .from("quiz_scores")
                .insert({
                    user_id: user.id,
                    quiz_id: `module_${selectedModule}`,
                    score: module.points,
                    total_questions: 1,
                    percentage: 100,
                    completed_at: new Date().toISOString()
                });

            if (scoreError) throw scoreError;

            // Update local state
            setModules(prev => prev.map(m =>
                m.id === selectedModule ? { ...m, completed: true } : m
            ));
            setTotalPoints(prev => prev + module.points);
            setMessage(`✅ Module completed! You earned ${module.points} points!`);

            // Show success message and redirect after 2 seconds
            setTimeout(() => {
                setShowContent(false);
                setSelectedModule(null);
                setMessage("");
            }, 2000);

        } catch (error) {
            console.error("Error saving progress:", error);
            setMessage("❌ Error saving progress. Please try again.");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    if (showContent && selectedModule) {
        const content = moduleContent[selectedModule as keyof typeof moduleContent];
        const module = modules[selectedModule - 1];

        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button
                            onClick={handleBack}
                            className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                        >
                            ← Back to Modules
                        </button>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                            <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
                            <div className="flex gap-4 mb-6 text-sm">
                                <span className="text-purple-400">⭐ {module.points} points</span>
                                <span className="text-gray-400">⏱️ {module.duration}</span>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-300">
                                    {content.content}
                                </pre>
                            </div>

                            {message && (
                                <div className={`mt-4 p-3 rounded-lg ${message.includes("✅") ? "bg-green-500/20 text-green-400" :
                                    message.includes("❌") ? "bg-red-500/20 text-red-400" :
                                        "bg-blue-500/20 text-blue-400"
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <button
                                    onClick={handleComplete}
                                    disabled={module.completed}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${module.completed
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                                        }`}
                                >
                                    {module.completed ? "✓ Completed" : "✓ Mark as Complete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const completedCount = modules.filter(m => m.completed).length;
    const totalPointsEarned = modules
        .filter(m => m.completed)
        .reduce((sum, m) => sum + m.points, 0);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Beginner Learning Path
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Start your AI/ML journey with these foundational modules
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">📚</div>
                            <div className="text-2xl font-bold text-purple-400">{completedCount}/{modules.length}</div>
                            <div className="text-gray-400">Modules Completed</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">⭐</div>
                            <div className="text-2xl font-bold text-purple-400">{totalPointsEarned}</div>
                            <div className="text-gray-400">Points Earned</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                            <div className="text-2xl mb-2">🏆</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {Math.round((completedCount / modules.length) * 100)}%
                            </div>
                            <div className="text-gray-400">Overall Progress</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300">Learning Path Progress</span>
                            <span className="text-purple-400">{completedCount}/{modules.length} Modules</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${(completedCount / modules.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
                            {message}
                        </div>
                    )}

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module, idx) => (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-all cursor-pointer ${module.completed
                                    ? "border-green-500/50 hover:border-green-500/70"
                                    : "border-white/10 hover:border-purple-500/30"
                                    }`}
                                onClick={() => !module.completed && handleModuleClick(module.id)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-3xl">
                                        {module.completed ? "✅" : "📚"}
                                    </div>
                                    <span className="text-xs text-purple-400">⭐ {module.points} pts</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">⏱️ {module.duration}</span>
                                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                        {module.level}
                                    </span>
                                </div>
                                {!module.completed && (
                                    <button className="mt-4 w-full py-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-sm transition-all">
                                        Start Learning →
                                    </button>
                                )}
                                {module.completed && (
                                    <div className="mt-4 text-center text-sm text-green-400">
                                        Completed ✓
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Completion Certificate */}
                    {completedCount === modules.length && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/30 text-center"
                        >
                            <div className="text-4xl mb-2">🏆</div>
                            <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                            <p className="text-gray-300 mb-4">You&apos;ve completed all Beginner modules!</p>
                            <p className="text-purple-400 mb-4">Total Points Earned: {totalPointsEarned}</p>
                            <button className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold">
                                Download Certificate
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}