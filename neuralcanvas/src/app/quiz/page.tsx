// src/app/quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    module: string;
    difficulty: string;
}

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Quiz questions data
    const questions: Question[] = [
        {
            id: 1,
            text: "What is Machine Learning?",
            options: [
                "Programming computers to follow fixed rules",
                "Enabling computers to learn from data without being explicitly programmed",
                "Building hardware for computers",
                "Creating databases for storage"
            ],
            correctAnswer: 1,
            explanation: "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
            module: "Introduction to AI/ML",
            difficulty: "Beginner"
        },
        {
            id: 2,
            text: "Which of the following is a type of Machine Learning?",
            options: [
                "Supervised Learning",
                "Unsupervised Learning",
                "Reinforcement Learning",
                "All of the above"
            ],
            correctAnswer: 3,
            explanation: "The three main types of ML are Supervised, Unsupervised, and Reinforcement Learning.",
            module: "Introduction to AI/ML",
            difficulty: "Beginner"
        },
        {
            id: 3,
            text: "What does a Decision Tree algorithm do?",
            options: [
                "Creates random decisions",
                "Splits data into branches based on features to make predictions",
                "Generates random trees",
                "Only works with numerical data"
            ],
            correctAnswer: 1,
            explanation: "Decision Trees split data recursively based on feature values, creating a tree-like model of decisions.",
            module: "Decision Trees",
            difficulty: "Intermediate"
        },
        {
            id: 4,
            text: "What is the purpose of a confusion matrix?",
            options: [
                "To confuse the model",
                "To visualize model performance and calculate metrics like accuracy",
                "To store training data",
                "To create neural networks"
            ],
            correctAnswer: 1,
            explanation: "A confusion matrix shows true positives, false positives, true negatives, and false negatives to evaluate classification model performance.",
            module: "Model Evaluation",
            difficulty: "Intermediate"
        },
        {
            id: 5,
            text: "What is overfitting in Machine Learning?",
            options: [
                "Model performs well on training data but poorly on new data",
                "Model performs poorly on all data",
                "Model is too simple",
                "Model trains too quickly"
            ],
            correctAnswer: 0,
            explanation: "Overfitting occurs when a model learns training data too well, including noise, but fails to generalize to new unseen data.",
            module: "Model Optimization",
            difficulty: "Advanced"
        },
        {
            id: 6,
            text: "Which algorithm is used for classification?",
            options: [
                "Linear Regression",
                "Logistic Regression",
                "K-Means Clustering",
                "PCA"
            ],
            correctAnswer: 1,
            explanation: "Logistic Regression is used for binary classification problems, while Linear Regression is for continuous values.",
            module: "Classification",
            difficulty: "Intermediate"
        },
        {
            id: 7,
            text: "What is a neural network activation function?",
            options: [
                "A function that activates the network",
                "A mathematical function that determines neuron output",
                "A network activator",
                "A training function"
            ],
            correctAnswer: 1,
            explanation: "Activation functions like ReLU, Sigmoid, and Tanh introduce non-linearity, allowing neural networks to learn complex patterns.",
            module: "Neural Networks",
            difficulty: "Advanced"
        },
        {
            id: 8,
            text: "What does 'training' mean in ML?",
            options: [
                "Teaching the model using labeled data to learn patterns",
                "Running the model in production",
                "Deleting old models",
                "Testing the model"
            ],
            correctAnswer: 0,
            explanation: "Training involves feeding data to a model so it can learn patterns and relationships to make predictions.",
            module: "Introduction to AI/ML",
            difficulty: "Beginner"
        },
        {
            id: 9,
            text: "What is the purpose of a train-test split?",
            options: [
                "To split data randomly",
                "To evaluate model performance on unseen data",
                "To create more data",
                "To confuse the model"
            ],
            correctAnswer: 1,
            explanation: "Train-test split helps evaluate how well a model generalizes to new, unseen data, preventing overfitting.",
            module: "Model Evaluation",
            difficulty: "Intermediate"
        },
        {
            id: 10,
            text: "Which library is commonly used for Machine Learning in Python?",
            options: [
                "React",
                "Scikit-learn",
                "Django",
                "Flask"
            ],
            correctAnswer: 1,
            explanation: "Scikit-learn is a popular Python library for machine learning with tools for classification, regression, clustering, and more.",
            module: "Python for ML",
            difficulty: "Beginner"
        }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
            } else {
                setUser(currentUser);
            }
        };
        fetchUser();
    }, [router]);

    // Timer effect
    useEffect(() => {
        if (quizStarted && !completed && !showExplanation && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showExplanation) {
            handleTimeout();
        }
    }, [timeLeft, quizStarted, completed, showExplanation]);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeLeft(30);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

        if (isCorrect) {
            setScore(score + 10);
        }

        setUserAnswers([...userAnswers, answerIndex]);
        setShowExplanation(true);
    };

    const handleTimeout = () => {
        setShowExplanation(true);
        setUserAnswers([...userAnswers, -1]);
    };

    const handleNextQuestion = () => {
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeLeft(30);
        } else {
            setCompleted(true);
            saveQuizResults();
        }
    };

    const saveQuizResults = async () => {
        if (!user) return;

        const percentage = (score / (questions.length * 10)) * 100;

        try {
            await supabase.from("quiz_results").insert({
                user_id: user.id,
                score: score,
                total_questions: questions.length,
                percentage: percentage,
                answers: userAnswers,
                completed_at: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error saving results:", error);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setCompleted(false);
        setUserAnswers([]);
        setTimeLeft(30);
        setQuizStarted(false);
    };

    if (!quizStarted) {
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>

                <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl mx-4"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                AI/ML Knowledge Quiz
                            </h1>
                            <p className="text-gray-300 mb-6">Test your knowledge of Artificial Intelligence and Machine Learning concepts!</p>

                            <div className="bg-black/30 rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">{questions.length}</div>
                                        <div className="text-sm text-gray-400">Questions</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">30 sec</div>
                                        <div className="text-sm text-gray-400">Per Question</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">10 pts</div>
                                        <div className="text-sm text-gray-400">Per Correct Answer</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">⭐</div>
                                        <div className="text-sm text-gray-400">Earn Badges</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold text-lg transition-all"
                            >
                                Start Quiz 🚀
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (completed) {
        const percentage = (score / (questions.length * 10)) * 100;
        let feedback = "";
        let badgeEarned = "";

        if (percentage >= 80) {
            feedback = "Excellent! You're an AI/ML expert! 🎉";
            badgeEarned = "ML Master Badge";
        } else if (percentage >= 60) {
            feedback = "Good job! Keep learning and you'll master AI/ML! 👍";
            badgeEarned = "ML Enthusiast Badge";
        } else if (percentage >= 40) {
            feedback = "Not bad! Review the concepts and try again! 💪";
        } else {
            feedback = "Keep practicing! Everyone starts somewhere! 🌱";
        }

        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <div className="relative z-20"><Navbar /></div>

                <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl mx-4"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                            <div className="text-6xl mb-4">
                                {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : "💪"}
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                            <p className="text-gray-300 mb-6">{feedback}</p>

                            <div className="bg-black/30 rounded-lg p-6 mb-6">
                                <div className="text-5xl font-bold text-purple-400 mb-2">{score}/{questions.length * 10}</div>
                                <div className="text-gray-400">Total Score</div>
                                <div className="mt-4 h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <div className="mt-2 text-sm text-gray-400">{percentage.toFixed(1)}% Correct</div>
                            </div>

                            {badgeEarned && (
                                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 mb-6 border border-yellow-500/30">
                                    <div className="text-2xl mb-1">🎖️</div>
                                    <div className="font-semibold">New Badge Earned!</div>
                                    <div className="text-sm text-yellow-400">{badgeEarned}</div>
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={restartQuiz}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    Take Again
                                </button>
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="px-6 py-2 border border-gray-600 rounded-lg font-semibold hover:border-purple-400 transition-all"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="space-y-6"
                >
                    {/* Progress Bar */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>Score: {score}</span>
                            <span className={`${timeLeft <= 10 ? "text-red-400" : "text-green-400"}`}>
                                Time: {timeLeft}s
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="mb-6">
                            <div className="flex gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                                    {currentQ.module}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${currentQ.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                                    currentQ.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-red-500/20 text-red-400"
                                    }`}>
                                    {currentQ.difficulty}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold">{currentQ.text}</h2>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {currentQ.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === null
                                        ? "bg-black/30 border-gray-700 hover:border-purple-500 hover:bg-purple-500/10"
                                        : selectedAnswer === idx
                                            ? idx === currentQ.correctAnswer
                                                ? "bg-green-500/20 border-green-500"
                                                : "bg-red-500/20 border-red-500"
                                            : idx === currentQ.correctAnswer && showExplanation
                                                ? "bg-green-500/20 border-green-500"
                                                : "bg-black/30 border-gray-700 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-semibold">{String.fromCharCode(65 + idx)}.</span>
                                        <span>{option}</span>
                                        {selectedAnswer === idx && (
                                            <span className="ml-auto">
                                                {idx === currentQ.correctAnswer ? "✓" : "✗"}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 rounded-lg mb-6 ${selectedAnswer === currentQ.correctAnswer
                                        ? "bg-green-500/10 border border-green-500/30"
                                        : "bg-blue-500/10 border border-blue-500/30"
                                        }`}
                                >
                                    <p className="text-sm">
                                        <strong>Explanation:</strong> {currentQ.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Next Button */}
                        {showExplanation && (
                            <button
                                onClick={handleNextQuestion}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
                            >
                                {currentQuestion + 1 < questions.length ? "Next Question →" : "Finish Quiz"}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}