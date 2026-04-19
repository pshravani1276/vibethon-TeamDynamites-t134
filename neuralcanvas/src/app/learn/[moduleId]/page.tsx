// src/app/learn/[moduleId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { supabase } from "@/lib/supabaseClient";
import { modules as allModules, Module, QuizQuestion } from "@/lib/data/modules";
import { ChevronLeft, ChevronRight, CheckCircle2, Layout, BookOpen, Clock, Star, Code2, AlertCircle, HelpCircle, X, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function ModuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const moduleId = parseInt(params.moduleId as string);

    const [user, setUser] = useState<any>(null);
    const [module, setModule] = useState<Module | null>(null);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Quiz States
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [quizScores, setQuizScores] = useState<boolean[]>([]);
    const [quizFinished, setQuizFinished] = useState(false);

    useEffect(() => {
        const fetchUserAndModule = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (!currentUser) {
                    router.push("/login");
                    return;
                }
                setUser(currentUser);

                const moduleData = allModules.find(m => m.id === moduleId);
                if (moduleData) {
                    setModule(moduleData);

                    const { data: progress } = await supabase
                        .from("user_progress")
                        .select("completed")
                        .eq("user_id", currentUser.id)
                        .eq("module_id", moduleId)
                        .maybeSingle();

                    if (progress) {
                        setCompleted(progress.completed);
                    }
                } else {
                    router.push("/learn");
                }
            } catch (err) {
                console.error("Initialization error:", err);
                addToast("Error loading module data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndModule();
    }, [moduleId, router, addToast]);

    const handleComplete = async () => {
        if (!user || !module || completed || saving) return;

        // If there's a quiz and it's not finished, start it
        if (module.quiz && module.quiz.length > 0 && !quizFinished) {
            setIsQuizOpen(true);
            return;
        }

        saveProgress();
    };

    const saveProgress = async () => {
        setSaving(true);
        try {
            const { error: progressError } = await supabase
                .from("user_progress")
                .upsert({
                    user_id: user.id,
                    module_id: module!.id,
                    module_name: module!.title,
                    completed: true,
                    points_earned: module!.points,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id,module_id' });

            if (progressError) throw progressError;

            await supabase.from("quiz_scores").insert({
                user_id: user.id,
                quiz_id: `module_${module!.id}`,
                score: module!.points,
                total_questions: module!.quiz?.length || 1,
                percentage: quizFinished ? 100 : 100, // For now simple pass
                completed_at: new Date().toISOString()
            });
            
            setCompleted(true);
            addToast(`Successfully completed: ${module!.title}! +${module!.points} XP`, "success");
            setMessage(`✅ Module completed! You earned ${module!.points} points!`);
        } catch (error: any) {
            console.error("Error saving progress detailed:", error);
            addToast(`Error saving progress: ${error.message || "DB Error"}`, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleQuizOptionSelect = (optionIdx: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(optionIdx);
        
        const isCorrect = optionIdx === module!.quiz![currentQuestionIdx].correctIndex;
        const newScores = [...quizScores];
        newScores[currentQuestionIdx] = isCorrect;
        setQuizScores(newScores);

        if (isCorrect) {
            addToast("Correct answer!", "success");
        } else {
            addToast("Incorrect. Keep going!", "error");
        }

        // Auto move to next after 1.5s
        setTimeout(() => {
            if (currentQuestionIdx < module!.quiz!.length - 1) {
                setCurrentQuestionIdx(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setQuizFinished(true);
                setIsQuizOpen(false);
                saveProgress();
            }
        }, 1500);
    };

    const goToNextModule = () => {
        if (moduleId < allModules.length) {
            router.push(`/learn/${moduleId + 1}`);
        } else {
            router.push("/dashboard");
        }
    };

    const goToPreviousModule = () => {
        if (moduleId > 1) {
            router.push(`/learn/${moduleId - 1}`);
        } else {
            router.push("/learn");
        }
    };

    const getLevelColor = () => {
        if (!module) return "text-gray-400 bg-gray-500/10";
        switch (module.level) {
            case "Beginner": return "text-green-400 bg-green-500/10 border-green-500/20";
            case "Intermediate": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "Advanced": return "text-red-400 bg-red-500/10 border-red-500/20";
            default: return "text-gray-400 bg-gray-500/10 border-white/5";
        }
    };

    if (!module && !loading) {
        return (
            <div className="relative min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
                    <button onClick={() => router.push("/learn")} className="text-purple-400 hover:underline">Return to Learning Paths</button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 pt-24 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 w-20 h-20 border-4 border-white/5 rounded-full" />
                        </div>
                        <p className="mt-8 text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                            Generating your custom learning experience...
                        </p>
                    </div>
                ) : module && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Header Navigation */}
                            <div className="flex items-center justify-between mb-8">
                                <button onClick={goToPreviousModule} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></div>
                                    <span className="text-sm font-medium hidden sm:inline">Previous</span>
                                </button>
                                <button onClick={() => router.push("/learn")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">
                                    <Layout className="w-3.5 h-3.5" /> Curriculum
                                </button>
                                <button onClick={goToNextModule} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                    <span className="text-sm font-medium hidden sm:inline">Next</span>
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></div>
                                </button>
                            </div>

                            {/* Module Header Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 mb-8 shadow-2xl">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getLevelColor()}`}>{module.level}</span>
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400">Module {module.id} of {allModules.length}</span>
                                            </div>
                                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{module.title}</h1>
                                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /><span>{module.duration}</span></div>
                                                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="font-bold text-white">{module.points} XP</span></div>
                                                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-400" /><span>{module.category}</span></div>
                                            </div>
                                        </div>
                                        {completed && (
                                            <div className="bg-green-500/20 px-6 py-4 rounded-2xl flex flex-col items-center border border-green-500/30">
                                                <CheckCircle2 className="w-8 h-8 text-green-400 mb-1" />
                                                <span className="text-xs font-black text-green-400 uppercase tracking-tighter">Completed</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="bg-black/20 rounded-2xl p-6 md:p-8 border border-white/5 shadow-inner mb-8">
                                        <pre className="whitespace-pre-wrap font-sans text-gray-300 text-lg leading-relaxed">{module.content}</pre>
                                    </div>

                                    {/* Code Example */}
                                    {module.codeExample && (
                                        <div className="mt-10">
                                            <div className="flex items-center gap-2 mb-4"><Code2 className="w-5 h-5 text-purple-400" /><h3 className="text-lg font-bold">Interactive Code Preview</h3></div>
                                            <div className="group relative rounded-2xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl">
                                                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] text-gray-500 font-mono">
                                                    <span>main.py</span><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">PYTHON 3.x</span>
                                                </div>
                                                <pre className="p-6 text-sm text-emerald-400 overflow-x-auto font-mono leading-relaxed"><code>{module.codeExample}</code></pre>
                                                <button onClick={() => router.push('/playground')} className="absolute bottom-4 right-4 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg">Run in Playground</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
                                        {message && (
                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mb-6 p-4 rounded-xl w-full text-center font-medium ${message.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {message}
                                            </motion.div>
                                        )}
                                        <button
                                            onClick={handleComplete}
                                            disabled={completed || saving}
                                            className={`group relative overflow-hidden px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-2xl ${completed ? "bg-green-500/20 text-green-500 border border-green-500/30 cursor-default" : "bg-white text-black hover:scale-105 active:scale-95 disabled:opacity-50"}`}
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {saving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : completed ? <><CheckCircle2 className="w-6 h-6" /> MISSION COMPLETE</> : <>{module.quiz ? 'TAKE KNOWLEDGE QUIZ' : 'FINISH MODULE & EARN XP'}</>}
                                            </div>
                                            {!completed && !saving && <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />}
                                        </button>
                                        {!completed && <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Earn {module.points} points for validation</p>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quiz Modal Overlay */}
                        <AnimatePresence>
                            {isQuizOpen && module.quiz && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuizOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-xs">
                                                    <HelpCircle className="w-4 h-4" /> Question {currentQuestionIdx + 1}/{module.quiz.length}
                                                </div>
                                                <button onClick={() => setIsQuizOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                                            </div>

                                            <h2 className="text-xl font-bold mb-8 leading-tight">{module.quiz[currentQuestionIdx].question}</h2>
                                            
                                            <div className="space-y-3">
                                                {module.quiz[currentQuestionIdx].options.map((option, idx) => {
                                                    const isSelected = selectedOption === idx;
                                                    const isCorrect = idx === module.quiz![currentQuestionIdx].correctIndex;
                                                    const showResult = selectedOption !== null;

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleQuizOptionSelect(idx)}
                                                            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                                                                isSelected 
                                                                    ? (isCorrect ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400')
                                                                    : (showResult && isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10')
                                                            }`}
                                                        >
                                                            <span className="font-medium">{option}</span>
                                                            {isSelected && (isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            
                                            <div className="mt-8 flex gap-1">
                                                {module.quiz.map((_, i) => (
                                                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i === currentQuestionIdx ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : i < currentQuestionIdx ? 'bg-green-500' : 'bg-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Auto-Next Suggestion */}
                        {completed && moduleId < allModules.length && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                                <button onClick={goToNextModule} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold transition-all shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 group">
                                    NEXT MODULE: {allModules.find(m => m.id === moduleId + 1)?.title}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}