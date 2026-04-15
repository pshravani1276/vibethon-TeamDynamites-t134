// src/app/quiz/[moduleId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
}

export default function ModuleQuizPage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = parseInt(params.moduleId as string);

    const [user, setUser] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);
    const [moduleTitle, setModuleTitle] = useState("");

    // Module-specific quiz questions
    const quizzesData: Record<number, { title: string; questions: Question[] }> = {
        1: {
            title: "Introduction to AI Quiz",
            questions: [
                {
                    id: 1,
                    text: "What is Artificial Intelligence?",
                    options: [
                        "Programming computers to follow fixed rules",
                        "Simulation of human intelligence in machines",
                        "Building faster computers",
                        "Creating databases"
                    ],
                    correctAnswer: 1,
                    explanation: "AI is the simulation of human intelligence in machines programmed to think and learn."
                },
                {
                    id: 2,
                    text: "Which of the following is an AI application?",
                    options: [
                        "Spreadsheets",
                        "Word processors",
                        "Virtual assistants like Siri",
                        "Email clients"
                    ],
                    correctAnswer: 2,
                    explanation: "Virtual assistants use NLP and ML to understand and respond to user queries."
                },
                {
                    id: 3,
                    text: "What does NLP stand for?",
                    options: [
                        "Natural Language Processing",
                        "Neural Language Programming",
                        "Network Learning Protocol",
                        "Non-linear Programming"
                    ],
                    correctAnswer: 0,
                    explanation: "NLP enables computers to understand, interpret, and manipulate human language."
                }
            ]
        },
        2: {
            title: "Machine Learning Basics Quiz",
            questions: [
                {
                    id: 1,
                    text: "What is Machine Learning?",
                    options: [
                        "Enabling computers to learn from data",
                        "Programming fixed rules",
                        "Building hardware",
                        "Creating databases"
                    ],
                    correctAnswer: 0,
                    explanation: "ML enables systems to learn and improve from experience without explicit programming."
                },
                {
                    id: 2,
                    text: "Which is NOT a type of Machine Learning?",
                    options: [
                        "Supervised Learning",
                        "Unsupervised Learning",
                        "Reinforcement Learning",
                        "Database Learning"
                    ],
                    correctAnswer: 3,
                    explanation: "The three main types are Supervised, Unsupervised, and Reinforcement Learning."
                }
            ]
        },
        8: {
            title: "Linear Regression Quiz",
            questions: [
                {
                    id: 1,
                    text: "What does Linear Regression predict?",
                    options: [
                        "Categories",
                        "Continuous values",
                        "Text",
                        "Images"
                    ],
                    correctAnswer: 1,
                    explanation: "Linear regression predicts continuous numerical values like prices or temperatures."
                },
                {
                    id: 2,
                    text: "What is R² score?",
                    options: [
                        "A measure of model accuracy",
                        "The number of features",
                        "The dataset size",
                        "The learning rate"
                    ],
                    correctAnswer: 0,
                    explanation: "R² measures how well the model explains the variance in the target variable."
                }
            ]
        },
        10: {
            title: "Decision Trees Quiz",
            questions: [
                {
                    id: 1,
                    text: "What does a Decision Tree use to split data?",
                    options: [
                        "Random selection",
                        "Feature values",
                        "User input",
                        "Predefined rules"
                    ],
                    correctAnswer: 1,
                    explanation: "Decision trees split data based on feature values to create branches."
                },
                {
                    id: 2,
                    text: "What is Gini Impurity?",
                    options: [
                        "A measure of node purity",
                        "A tree depth limit",
                        "The number of leaves",
                        "The dataset size"
                    ],
                    correctAnswer: 0,
                    explanation: "Gini impurity measures how often a randomly chosen element would be misclassified."
                }
            ]
        },
        12: {
            title: "Neural Networks Quiz",
            questions: [
                {
                    id: 1,
                    text: "What is a neuron in a neural network?",
                    options: [
                        "A mathematical function",
                        "A database entry",
                        "A file storage unit",
                        "A memory cell"
                    ],
                    correctAnswer: 0,
                    explanation: "A neuron computes a weighted sum of inputs and applies an activation function."
                },
                {
                    id: 2,
                    text: "What does backpropagation do?",
                    options: [
                        "Updates weights based on error",
                        "Loads data",
                        "Saves the model",
                        "Visualizes the network"
                    ],
                    correctAnswer: 0,
                    explanation: "Backpropagation calculates gradients and updates weights to minimize the loss."
                }
            ]
        },
    };

    // General quiz for modules without specific quizzes
    const generalQuestions: Question[] = [
        {
            id: 1,
            text: "What is the difference between AI and ML?",
            options: [
                "They are the same thing",
                "AI is broader, ML is a subset",
                "ML is broader, AI is a subset",
                "They are completely different"
            ],
            correctAnswer: 1,
            explanation: "AI is the broader concept of machines simulating human intelligence, while ML is a subset that learns from data."
        },
        {
            id: 2,
            text: "What is overfitting?",
            options: [
                "Model performs well on training data but poorly on new data",
                "Model performs poorly on all data",
                "Model trains too quickly",
                "Model is too simple"
            ],
            correctAnswer: 0,
            explanation: "Overfitting occurs when a model learns training data too well but fails to generalize."
        },
        {
            id: 3,
            text: "What is cross-validation used for?",
            options: [
                "Training the model",
                "Evaluating model performance",
                "Loading data",
                "Saving the model"
            ],
            correctAnswer: 1,
            explanation: "Cross-validation helps assess how well a model generalizes to unseen data."
        },
        {
            id: 4,
            text: "What is a confusion matrix?",
            options: [
                "A visualization of model performance",
                "A type of neural network",
                "A data preprocessing technique",
                "A loss function"
            ],
            correctAnswer: 0,
            explanation: "A confusion matrix shows true positives, false positives, true negatives, and false negatives."
        }
    ];

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
        };
        fetchUser();

        // Set module title
        const moduleNames: Record<number, string> = {
            1: "Introduction to AI",
            2: "Machine Learning Basics",
            8: "Linear Regression",
            10: "Decision Trees",
            12: "Neural Networks",
        };
        setModuleTitle(moduleNames[moduleId] || `Module ${moduleId} Quiz`);
    }, [moduleId, router]);

    // Timer effect
    useEffect(() => {
        if (quizStarted && !completed && !showExplanation && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showExplanation) {
            handleTimeout();
        }
    }, [timeLeft, quizStarted, completed, showExplanation]);

    const currentQuestions = quizzesData[moduleId]?.questions || generalQuestions;
    const currentQ = currentQuestions[currentQuestion];

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeLeft(30);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answerIndex);
        const isCorrect = answerIndex === currentQ.correctAnswer;

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
        if (currentQuestion + 1 < currentQuestions.length) {
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

        const percentage = (score / (currentQuestions.length * 10)) * 100;

        await supabase.from("quiz_scores").insert({
            user_id: user.id,
            quiz_id: `module_${moduleId}`,
            score: score,
            total_questions: currentQuestions.length,
            percentage: percentage,
            answers: userAnswers,
            completed_at: new Date().toISOString()
        });
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
                            <h1 className="text-3xl font-bold mb-4">{moduleTitle}</h1>
                            <p className="text-gray-300 mb-6">Test your knowledge of this module!</p>

                            <div className="bg-black/30 rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">{currentQuestions.length}</div>
                                        <div className="text-sm text-gray-400">Questions</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-400">30 sec</div>
                                        <div className="text-sm text-gray-400">Per Question</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
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
        const percentage = (score / (currentQuestions.length * 10)) * 100;

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
                            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>

                            <div className="bg-black/30 rounded-lg p-6 mb-6">
                                <div className="text-4xl font-bold text-purple-400 mb-2">{score}/{currentQuestions.length * 10}</div>
                                <div className="text-gray-400">Total Score</div>
                                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={restartQuiz}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                                >
                                    Take Again
                                </button>
                                <button
                                    onClick={() => router.push(`/learn/${moduleId}`)}
                                    className="px-6 py-2 border border-gray-600 rounded-lg font-semibold hover:border-purple-400"
                                >
                                    Review Module
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

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
                >
                    {/* Progress */}
                    <div className="bg-white/5 rounded-lg p-4 mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Question {currentQuestion + 1} of {currentQuestions.length}</span>
                            <span>Score: {score}</span>
                            <span className={timeLeft <= 10 ? "text-red-400" : "text-green-400"}>
                                Time: {timeLeft}s
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }} />
                        </div>
                    </div>

                    {/* Question */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">{currentQ.text}</h2>

                        <div className="space-y-3 mb-6">
                            {currentQ.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === null
                                        ? "bg-black/30 border-gray-700 hover:border-purple-500"
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
                                        <span className="font-semibold">{String.fromCharCode(65 + idx)}.</span>
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

                        {showExplanation && (
                            <div className={`p-4 rounded-lg mb-6 ${selectedAnswer === currentQ.correctAnswer
                                ? "bg-green-500/10 border border-green-500/30"
                                : "bg-blue-500/10 border border-blue-500/30"
                                }`}>
                                <p className="text-sm"><strong>Explanation:</strong> {currentQ.explanation}</p>
                            </div>
                        )}

                        {showExplanation && (
                            <button
                                onClick={handleNextQuestion}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                            >
                                {currentQuestion + 1 < currentQuestions.length ? "Next Question →" : "Finish Quiz"}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}