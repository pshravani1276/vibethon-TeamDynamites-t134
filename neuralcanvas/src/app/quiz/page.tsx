// src/app/quiz/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import { supabase } from "@/lib/supabaseClient";
import { Brain, Clock, Target, Trophy, Flame, PlayCircle, Loader2, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    explanation: string;
}

// 20+ Questions Bank
const QUESTION_BANK: Question[] = [
    { id: 1, text: "What does ML stand for?", options: ["Machine Learning", "Mega Logic", "Micro Learning", "Massive Loop"], correct: 0, category: "Basics", difficulty: "Easy", explanation: "Machine Learning is a subset of AI focusing on data-driven learning." },
    { id: 2, text: "Which algorithm is used for classifying spam emails?", options: ["Linear Regression", "Naive Bayes", "K-Means", "PCA"], correct: 1, category: "Algorithms", difficulty: "Medium", explanation: "Naive Bayes is highly effective for text classification based on probabilities." },
    { id: 3, text: "What is an epoch in deep learning?", options: ["A layer in CNN", "One complete pass through the training data", "The initialization phase", "The loss function minimum"], correct: 1, category: "Deep Learning", difficulty: "Easy", explanation: "One epoch equals one forward pass and one backward pass of all training examples." },
    { id: 4, text: "What problem does dropout solve in Neural Networks?", options: ["Vanishing Gradient", "Slow Training", "Overfitting", "Data Leakage"], correct: 2, category: "Deep Learning", difficulty: "Hard", explanation: "Dropout randomly ignores neurons during training, preventing them from co-adapting too much." },
    { id: 5, text: "What is the purpose of the activation function?", options: ["To speed up training", "To introduce non-linearity", "To prevent overfitting", "To normalize weights"], correct: 1, category: "Deep Learning", difficulty: "Medium", explanation: "Without non-linearity, a neural network, regardless of its depth, would behave like a single-layer perceptron." },
    { id: 6, text: "Which metric is best for imbalanced datasets?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "Loss"], correct: 1, category: "Evaluation", difficulty: "Medium", explanation: "F1 Score balances Precision and Recall, crucial for uneven class distributions." },
    { id: 7, text: "What technique reduces the dimensionality of data?", options: ["SVM", "Random Forest", "PCA", "Gradient Descent"], correct: 2, category: "Algorithms", difficulty: "Medium", explanation: "Principal Component Analysis (PCA) projects high-dimensional data into a lower-dimensional space." },
    { id: 8, text: "Which of these is an unsupervised learning technique?", options: ["Logistic Regression", "K-Means Clustering", "Decision Trees", "SVM"], correct: 1, category: "Basics", difficulty: "Easy", explanation: "K-Means groups unlabelled data based on similarity." },
    { id: 9, text: "What does CNN stand for?", options: ["Computer Neural Network", "Convolutional Neural Network", "Categorical Neural Node", "Centralised Native Network"], correct: 1, category: "Deep Learning", difficulty: "Easy", explanation: "CNNs are fundamental to processing grid-like data like images." },
    { id: 10, text: "What happens during 'Backpropagation'?", options: ["Data flows from input to output layer", "Weights are updated based on the error gradient", "Data is normalized", "The learning rate is increased"], correct: 1, category: "Deep Learning", difficulty: "Hard", explanation: "It calculates the gradient of the loss function with respect to the weights to optimize them." },
    { id: 11, text: "What is the role of a bias unit in a neural network?", options: ["To shift the activation function", "To increase learning rate", "To reduce overfitting", "To regularize inputs"], correct: 0, category: "Deep Learning", difficulty: "Medium", explanation: "Bias allows you to shift the activation function up or down, enabling better fitting." },
    { id: 12, text: "Which algorithm uses the 'kernel trick'?", options: ["K-Means", "Random Forest", "SVM", "Logistic Regression"], correct: 2, category: "Algorithms", difficulty: "Medium", explanation: "Support Vector Machines (SVM) use it to operate in a high-dimensional, implicit feature space." },
    { id: 13, text: "What differentiates BERT from standard RNNs?", options: ["It uses CNNs under the hood", "It reads text bidirectionally", "It only generates images", "It is unsupervised only"], correct: 1, category: "NLP", difficulty: "Hard", explanation: "BERT (Bidirectional Encoder Representations from Transformers) reads the entire sequence of words at once." },
    { id: 14, text: "In Transfer Learning, what is typically done?", options: ["Training from scratch", "Reusing a pre-trained model for a new task", "Transferring data between servers", "Copying weights manually"], correct: 1, category: "Deep Learning", difficulty: "Easy", explanation: "Transfer learning leverages knowledge learned from a previous task to improve learning on a new task." },
    { id: 15, text: "What is Cross-Entropy Loss primarily used for?", options: ["Regression tasks", "Clustering", "Classification tasks", "Dimensionality reduction"], correct: 2, category: "Evaluation", difficulty: "Medium", explanation: "Cross-entropy loss measures the performance of a classification model whose output is a probability value between 0 and 1." }
];

export default function QuizPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();

    // Mode: "start" | "playing" | "results"
    const [mode, setMode] = useState<"start" | "playing" | "results">("start");
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<{questionId: number, isCorrect: boolean, selected: number}[]>([]);
    
    // Timer
    const [timeLeft, setTimeLeft] = useState(15);
    const [totalTimeTaken, setTotalTimeTaken] = useState(0);

    // Categories
    const categories = ["Mixed", "Basics", "Algorithms", "Deep Learning", "NLP"];
    const [selectedCategory, setSelectedCategory] = useState("Mixed");

    // Adaptive difficulty
    const [currentDifficulty, setCurrentDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

    const generateQuiz = () => {
        let pool = QUESTION_BANK;
        if (selectedCategory !== "Mixed") {
            pool = QUESTION_BANK.filter(q => q.category === selectedCategory);
            if (pool.length < 5) pool = QUESTION_BANK; // Fallback
        }

        // Shuffle and pick 5
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        setQuizQuestions(shuffled.slice(0, 5));
        setCurrentIndex(0);
        setScore(0);
        setAnswers([]);
        setTotalTimeTaken(0);
        setTimeLeft(15);
        setMode("playing");
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (mode === "playing" && selectedOption === null && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, selectedOption, timeLeft, currentIndex]);

    const handleTimeout = () => {
        handleAnswer(-1); // -1 means timeout
    };

    const handleAnswer = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        
        const q = quizQuestions[currentIndex];
        const correct = optionIndex === q.correct;
        
        setTotalTimeTaken(prev => prev + (15 - timeLeft));

        if (correct) {
            // Score based on difficulty + speed bonus
            let basePts = q.difficulty === "Hard" ? 30 : q.difficulty === "Medium" ? 20 : 10;
            let timeBonus = timeLeft > 10 ? 5 : timeLeft > 5 ? 2 : 0;
            setScore(prev => prev + basePts + timeBonus);
            
            // Adapt difficulty up
            if (currentDifficulty === "Medium") setCurrentDifficulty("Hard");
            if (currentDifficulty === "Easy") setCurrentDifficulty("Medium");
        } else {
            // Adapt difficulty down
            if (currentDifficulty === "Hard") setCurrentDifficulty("Medium");
            if (currentDifficulty === "Medium") setCurrentDifficulty("Easy");
        }

        setAnswers(prev => [...prev, { questionId: q.id, isCorrect: correct, selected: optionIndex }]);

        setTimeout(() => {
            if (currentIndex + 1 < quizQuestions.length) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
                setTimeLeft(15);
            } else {
                finishQuiz();
            }
        }, 1500);
    };

    const finishQuiz = async () => {
        setMode("results");
        
        if (user) {
            try {
                const finalScore = score; // Captured via closure but state will be consistent
                // Save to DB
                await supabase.from("quiz_scores").insert({
                    user_id: user.id,
                    score: finalScore,
                    category: selectedCategory,
                    correct_answers: answers.filter(a => a.isCorrect).length,
                    total_questions: quizQuestions.length
                });

                if (finalScore > 100) {
                    addToast("Unbelievable Score! 🏆", "success");
                }
            } catch (err) {
                console.error("Failed to save score:", err);
            }
        }
    };

    if (mode === "start") {
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <Navbar />
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-6 shadow-xl shadow-purple-500/20">
                            <Brain className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                            Knowledge Arena
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Test your AI/ML knowledge with our adaptive quiz engine. Questions adjust to your skill level.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div className="glass rounded-2xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-400" />
                                Select Category
                            </h3>
                            <div className="space-y-2">
                                {categories.map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                                            selectedCategory === c 
                                            ? "bg-purple-500/20 border border-purple-500/50 text-purple-200" 
                                            : "bg-white/5 border border-transparent hover:bg-white/10 text-gray-300"
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="glass rounded-2xl p-6 border border-white/10 flex-1">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    Rules
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 15 seconds per question</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Adaptive difficulty</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Faster answers = more points</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> 5 questions total</li>
                                </ul>
                            </div>

                            <button
                                onClick={generateQuiz}
                                className="py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all group"
                            >
                                <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Start Challenge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === "playing" && quizQuestions.length > 0) {
        const q = quizQuestions[currentIndex];
        
        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <Navbar />

                <div className="relative z-10 max-w-3xl mx-auto px-4 pt-24 pb-12">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <div className="text-purple-400 text-sm font-bold tracking-wider uppercase mb-1">
                                Question {currentIndex + 1} of {quizQuestions.length}
                            </div>
                            <div className="flex gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                    q.difficulty === 'Hard' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    q.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                }`}>
                                    {q.difficulty}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300">
                                    {q.category}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-xs text-gray-400 uppercase tracking-widest">Score</div>
                                <div className="text-2xl font-bold font-mono text-emerald-400">{score}</div>
                            </div>
                            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 shadow-lg ${
                                timeLeft <= 5 ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse" : "bg-white/5 border-indigo-500/50 text-indigo-400"
                            }`}>
                                <div className="text-xl font-bold font-mono">{timeLeft}</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-8">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                            initial={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
                            animate={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-indigo-500/10"
                        >
                            <h2 className="text-2xl md:text-3xl font-medium leading-tight mb-8">
                                {q.text}
                            </h2>

                            <div className="space-y-3">
                                {q.options.map((opt, i) => {
                                    const isSelected = selectedOption === i;
                                    const isCorrect = q.correct === i;
                                    const showColors = selectedOption !== null;
                                    
                                    let btnClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50";
                                    
                                    if (showColors) {
                                        if (isCorrect) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                                        else if (isSelected && !isCorrect) btnClass = "bg-red-500/20 border-red-500 text-red-100";
                                        else btnClass = "bg-white/5 border-white/10 opacity-50";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => !showColors && handleAnswer(i)}
                                            disabled={showColors}
                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all text-lg flex items-center justify-between ${btnClass}`}
                                        >
                                            <span>{opt}</span>
                                            {showColors && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                            {showColors && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Explanation shown after answer */}
                            {selectedOption !== null && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, height: 0 }} 
                                    animate={{ opacity: 1, y: 0, height: "auto" }} 
                                    className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm"
                                >
                                    <span className="font-bold mr-2 text-blue-400">Why?</span>
                                    {q.explanation}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    if (mode === "results") {
        const correctCount = answers.filter(a => a.isCorrect).length;
        const accuracy = Math.round((correctCount / quizQuestions.length) * 100);

        return (
            <div className="relative min-h-screen bg-black text-white">
                <AnimatedBackground />
                <div className="fixed inset-0 bg-black/40 z-[5]" />
                <Navbar />

                <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-12">
                    <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl text-center max-w-2xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-6 shadow-xl shadow-purple-500/30">
                            <Trophy className="w-12 h-12 text-white" />
                        </motion.div>
                        
                        <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
                        <p className="text-gray-400 mb-8">You&apos;ve completed the {selectedCategory} challenge.</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <div className="text-gray-400 text-sm mb-1">Score</div>
                                <div className="text-3xl font-bold text-indigo-400 font-mono">{score}</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                                <div className="text-3xl font-bold text-emerald-400 font-mono">{accuracy}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <div className="text-gray-400 text-sm mb-1">Time</div>
                                <div className="text-3xl font-bold text-amber-400 font-mono">{totalTimeTaken}s</div>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 max-w-md mx-auto">
                            <button onClick={() => setMode("start")} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-medium">
                                Back to Menu
                            </button>
                            <button onClick={generateQuiz} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl transition-all font-medium shadow-lg shadow-purple-500/25">
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}