// src/app/learn/[moduleId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface ModuleContent {
    id: number;
    title: string;
    description: string;
    content: string;
    duration: string;
    level: string;
    points: number;
    codeExample?: string;
    quizQuestions?: {
        question: string;
        options: string[];
        correct: number;
    }[];
}

export default function ModuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = parseInt(params.moduleId as string);

    const [user, setUser] = useState<any>(null);
    const [module, setModule] = useState<ModuleContent | null>(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Module data for all 19 modules
    const modulesData: Record<number, ModuleContent> = {
        // Beginner Modules (1-5)
        1: {
            id: 1,
            title: "What is Artificial Intelligence?",
            description: "Understand the basics of AI and its applications",
            content: `
        Artificial Intelligence (AI) is the simulation of human intelligence in machines.
        
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
            duration: "15 min",
            level: "Beginner",
            points: 50,
            codeExample: `# Simple AI example
import random

responses = {
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm doing great, thanks for asking!",
}

def chatbot(message):
    return responses.get(message.lower(), "I don't understand that yet.")
    
print(chatbot("hello"))`
        },
        2: {
            id: 2,
            title: "Introduction to Machine Learning",
            description: "Learn what Machine Learning is and how it works",
            content: `
        Machine Learning is a subset of AI that enables systems to learn from data.
        
        Traditional Programming vs ML:
        • Traditional: Input + Rules = Output
        • ML: Input + Output = Rules
        
        The ML Process:
        1. Collect data
        2. Prepare data
        3. Choose a model
        4. Train the model
        5. Evaluate
        6. Make predictions
      `,
            duration: "20 min",
            level: "Beginner",
            points: 50,
            codeExample: `# Simple ML example
from sklearn import tree

# Features: [weight, texture]
# 0 = smooth, 1 = bumpy
features = [[140, 0], [130, 0], [150, 1], [170, 1]]
labels = ["apple", "apple", "orange", "orange"]

clf = tree.DecisionTreeClassifier()
clf.fit(features, labels)
print(clf.predict([[160, 1]]))`
        },
        3: {
            id: 3,
            title: "Types of Machine Learning",
            description: "Explore Supervised, Unsupervised, and Reinforcement Learning",
            content: `
        Three Main Types of ML:
        
        1. Supervised Learning - Learns from labeled data
        2. Unsupervised Learning - Finds patterns in unlabeled data
        3. Reinforcement Learning - Learns through trial and error
      `,
            duration: "25 min",
            level: "Beginner",
            points: 75,
        },
        4: {
            id: 4,
            title: "Python Basics for ML",
            description: "Essential Python concepts for Machine Learning",
            content: `
        Essential Python Libraries for ML:
        
        1. NumPy - Numerical computing
        2. Pandas - Data manipulation
        3. Matplotlib - Data visualization
        4. Scikit-learn - Machine Learning algorithms
      `,
            duration: "30 min",
            level: "Beginner",
            points: 100,
        },
        5: {
            id: 5,
            title: "Your First ML Model",
            description: "Build a simple linear regression model",
            content: `
        Building a Linear Regression Model:
        
        Step 1: Import libraries
        Step 2: Create data
        Step 3: Train model
        Step 4: Make predictions
      `,
            duration: "35 min",
            level: "Beginner",
            points: 100,
        },
        // Intermediate Modules (6-11)
        6: {
            id: 6,
            title: "Data Preprocessing & Cleaning",
            description: "Prepare raw data for machine learning",
            content: `
        Data preprocessing steps:
        1. Handle missing values
        2. Remove outliers
        3. Scale features
        4. Encode categorical variables
      `,
            duration: "35 min",
            level: "Intermediate",
            points: 100,
        },
        7: {
            id: 7,
            title: "Feature Engineering",
            description: "Create meaningful features from raw data",
            content: `
        Feature engineering techniques:
        • Create interaction features
        • Add polynomial features
        • Extract date components
        • Bin continuous variables
      `,
            duration: "40 min",
            level: "Intermediate",
            points: 120,
        },
        8: {
            id: 8,
            title: "Linear Regression Deep Dive",
            description: "Master linear regression and its variants",
            content: `
        Linear regression formula: y = β₀ + β₁x₁ + ... + βₙxₙ
        
        Assumptions:
        1. Linearity
        2. Independence
        3. Homoscedasticity
        4. Normality
      `,
            duration: "45 min",
            level: "Intermediate",
            points: 150,
        },
        9: {
            id: 9,
            title: "Logistic Regression & Classification",
            description: "Learn binary and multi-class classification",
            content: `
        Logistic regression uses sigmoid function to output probabilities.
        
        Evaluation metrics:
        • Accuracy
        • Precision
        • Recall
        • F1-Score
      `,
            duration: "45 min",
            level: "Intermediate",
            points: 150,
        },
        10: {
            id: 10,
            title: "Decision Trees & Random Forests",
            description: "Build powerful tree-based models",
            content: `
        Decision trees split data based on feature values.
        
        Random Forest combines multiple trees:
        • Reduces overfitting
        • Provides feature importance
      `,
            duration: "50 min",
            level: "Intermediate",
            points: 150,
        },
        11: {
            id: 11,
            title: "Model Evaluation & Validation",
            description: "Assess model performance and avoid overfitting",
            content: `
        Validation techniques:
        • Train-test split
        • Cross-validation
        • Learning curves
      `,
            duration: "40 min",
            level: "Intermediate",
            points: 120,
        },
        // Advanced Modules (12-19)
        12: {
            id: 12,
            title: "Neural Networks Fundamentals",
            description: "Understand neural network architecture",
            content: `
        Neural network components:
        • Input layer
        • Hidden layers
        • Output layer
        • Activation functions
        • Weights and biases
      `,
            duration: "60 min",
            level: "Advanced",
            points: 200,
        },
        13: {
            id: 13,
            title: "Convolutional Neural Networks (CNN)",
            description: "Master CNNs for image recognition",
            content: `
        CNN layers:
        • Convolutional layers
        • Pooling layers
        • Flatten layer
        • Dense layers
      `,
            duration: "75 min",
            level: "Advanced",
            points: 250,
        },
        14: {
            id: 14,
            title: "Recurrent Neural Networks (RNN) & LSTM",
            description: "Learn sequence models for time series",
            content: `
        RNNs maintain memory through hidden states.
        LSTM solves the vanishing gradient problem with gates.
      `,
            duration: "75 min",
            level: "Advanced",
            points: 250,
        },
        15: {
            id: 15,
            title: "Transformers & Attention Mechanism",
            description: "Explore modern LLM architecture",
            content: `
        Transformers use self-attention instead of recurrence.
        
        Components:
        • Multi-head attention
        • Positional encoding
        • Feed-forward networks
      `,
            duration: "90 min",
            level: "Advanced",
            points: 300,
        },
        16: {
            id: 16,
            title: "Model Optimization & Hyperparameter Tuning",
            description: "Advanced optimization techniques",
            content: `
        Optimization methods:
        • Grid search
        • Random search
        • Bayesian optimization
        • Learning rate scheduling
      `,
            duration: "60 min",
            level: "Advanced",
            points: 200,
        },
        17: {
            id: 17,
            title: "MLOps & Model Deployment",
            description: "Deploy and monitor ML models",
            content: `
        MLOps practices:
        • Model versioning
        • CI/CD for ML
        • Model monitoring
        • Automated retraining
      `,
            duration: "90 min",
            level: "Advanced",
            points: 300,
        },
        18: {
            id: 18,
            title: "Generative AI & GANs",
            description: "Create content with Generative AI",
            content: `
        GANs have two competing networks:
        • Generator (creates fake data)
        • Discriminator (detects fake data)
      `,
            duration: "80 min",
            level: "Advanced",
            points: 280,
        },
        19: {
            id: 19,
            title: "Reinforcement Learning",
            description: "Train agents through trial and error",
            content: `
        RL components:
        • Agent
        • Environment
        • State
        • Action
        • Reward
        • Policy
      `,
            duration: "70 min",
            level: "Advanced",
            points: 250,
        },
    };

    useEffect(() => {
        const fetchUserAndModule = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);

            // Load module data
            const moduleData = modulesData[moduleId];
            if (moduleData) {
                setModule(moduleData);

                // Check if already completed
                const { data: progress } = await supabase
                    .from("user_progress")
                    .select("completed")
                    .eq("user_id", currentUser.id)
                    .eq("module_id", moduleId)
                    .single();

                if (progress) {
                    setCompleted(progress.completed);
                }
            } else {
                router.push("/learn");
            }

            setLoading(false);
        };

        fetchUserAndModule();
    }, [moduleId, router]);

    const handleComplete = async () => {
        if (!user || !module || completed) return;

        const { error } = await supabase
            .from("user_progress")
            .insert({
                user_id: user.id,
                module_id: module.id,
                module_name: module.title,
                completed: true,
                points_earned: module.points,
                completed_at: new Date().toISOString()
            });

        if (!error) {
            // Also add to quiz_scores for points
            await supabase.from("quiz_scores").insert({
                user_id: user.id,
                quiz_id: `module_${module.id}`,
                score: module.points,
                total_questions: 1,
                percentage: 100,
                completed_at: new Date().toISOString()
            });

            setCompleted(true);
            setMessage(`✅ Module completed! You earned ${module.points} points!`);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const goToNextModule = () => {
        if (moduleId < 19) {
            router.push(`/learn/${moduleId + 1}`);
        } else {
            router.push("/dashboard");
        }
    };

    const goToPreviousModule = () => {
        if (moduleId > 1) {
            router.push(`/learn/${moduleId - 1}`);
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading module...</div>
            </div>
        );
    }

    if (!module) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Module not found</div>
            </div>
        );
    }

    const getLevelColor = () => {
        switch (module.level) {
            case "Beginner": return "text-green-400 bg-green-500/20";
            case "Intermediate": return "text-yellow-400 bg-yellow-500/20";
            case "Advanced": return "text-red-400 bg-red-500/20";
            default: return "text-gray-400 bg-gray-500/20";
        }
    };

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
                    {/* Navigation */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={goToPreviousModule}
                            disabled={moduleId === 1}
                            className="text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous Module
                        </button>
                        <button
                            onClick={() => router.push("/learn")}
                            className="text-gray-400 hover:text-white"
                        >
                            All Modules
                        </button>
                        <button
                            onClick={goToNextModule}
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Next Module →
                        </button>
                    </div>

                    {/* Module Content */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                            <div>
                                <div className="flex gap-2 mb-3">
                                    <span className={`text-xs px-2 py-1 rounded ${getLevelColor()}`}>
                                        {module.level}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                                        Module {module.id}/19
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
                                <p className="text-gray-400">{module.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-purple-400">⭐ {module.points} pts</div>
                                <div className="text-sm text-gray-400">⏱️ {module.duration}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert max-w-none mb-6">
                            <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                                {module.content}
                            </pre>
                        </div>

                        {/* Code Example */}
                        {module.codeExample && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">💻 Code Example</h3>
                                <div className="bg-gray-900 rounded-lg overflow-hidden">
                                    <pre className="p-4 text-sm text-green-400 overflow-x-auto font-mono">
                                        <code>{module.codeExample}</code>
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        {message && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                                {message}
                            </div>
                        )}

                        {/* Complete Button */}
                        {!completed ? (
                            <button
                                onClick={handleComplete}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:shadow-lg transition"
                            >
                                ✓ Mark as Complete & Earn {module.points} Points
                            </button>
                        ) : (
                            <div className="text-center p-3 bg-green-500/20 rounded-lg text-green-400">
                                ✓ Module Completed! You earned {module.points} points.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}