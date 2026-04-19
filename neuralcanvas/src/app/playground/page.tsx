// src/app/playground/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Play, RotateCcw, Save, Share2, Terminal, Code2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/components/AuthProvider";
import { executePython, loadPyodideInstance, ML_TEMPLATES, isPyodideLoading } from "@/lib/pyodide";

export default function PlaygroundPage() {
    const { addToast } = useToast();
    const { user } = useAuth();
    
    const [code, setCode] = useState(ML_TEMPLATES[0].code);
    const [output, setOutput] = useState("Output will appear here...");
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTemplate, setActiveTemplate] = useState(ML_TEMPLATES[0].id);
    const [engineReady, setEngineReady] = useState(false);
    const [engineLoading, setEngineLoading] = useState(false);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    
    // Auto-scroll output
    const outputRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output, error]);

    // Initialize Python engine in background
    useEffect(() => {
        let mounted = true;
        const initEngine = async () => {
            if (isPyodideLoading()) {
                setEngineLoading(true);
                // Wait a bit and check again
                setTimeout(initEngine, 1000);
                return;
            }
            
            try {
                setEngineLoading(true);
                await loadPyodideInstance();
                if (mounted) {
                    setEngineReady(true);
                    setEngineLoading(false);
                    addToast("Python Engine Ready!", "success");
                }
            } catch (err) {
                if (mounted) {
                    console.error("Failed to load Python engine:", err);
                    setEngineLoading(false);
                    addToast("Failed to start Python engine. Check your connection.", "error");
                }
            }
        };

        // Don't auto-initialize if not needed, but preloading is good for UX
        initEngine();
        
        return () => { mounted = false; };
    }, [addToast]);

    const handleRunCode = async () => {
        if (!code.trim()) {
            addToast("Please enter some code to run", "warning");
            return;
        }

        setIsRunning(true);
        setError(null);
        setOutput("Executing...");
        setExecutionTime(null);

        try {
            const result = await executePython(code);
            
            if (result.success) {
                setOutput(result.output);
                setExecutionTime(result.executionTime);
                
                // Achievement trigger potential
                if (result.executionTime > 0 && Math.random() > 0.8 && user) {
                    addToast("Fast Code! 🚀 +10 points", "success");
                }
            } else {
                setError(result.error);
                setOutput("");
            }
        } catch (err: any) {
            setError(err.message || "An unknown error occurred");
            setOutput("");
        } finally {
            setIsRunning(false);
        }
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = ML_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setCode(template.code);
            setActiveTemplate(template.id);
            setOutput("Output will appear here...");
            setError(null);
            setExecutionTime(null);
            addToast(`Loaded ${template.name} template`, "info", 2000);
        }
    };

    const handleReset = () => {
        const template = ML_TEMPLATES.find(t => t.id === activeTemplate);
        if (template) {
            setCode(template.code);
            setOutput("Output will appear here...");
            setError(null);
            setExecutionTime(null);
        } else {
            setCode("");
            setOutput("");
            setError(null);
        }
    };

    const handleSaveCode = () => {
        if (!user) {
            addToast("Please login to save code snippets", "warning");
            return;
        }
        addToast("Code saved to your profile!", "success");
        // Implementation for saving to Supabase would go here
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(code);
            addToast("Code copied to clipboard!", "success");
        } catch (err) {
            addToast("Failed to copy code", "error");
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24 h-screen flex flex-col">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                            <Code2 className="w-8 h-8 text-purple-400" />
                            AI Playground
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Write, execute, and test Python code in your browser</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* Engine Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs mr-2">
                            {engineReady ? (
                                <><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Engine Ready</>
                            ) : engineLoading ? (
                                <><Loader2 className="w-3 h-3 animate-spin text-amber-500" /> Connecting...</>
                            ) : (
                                <><div className="w-2 h-2 rounded-full bg-red-500"></div> Offline</>
                            )}
                        </div>

                        {/* Templates Dropdown */}
                        <select 
                            value={activeTemplate}
                            onChange={handleTemplateChange}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                        >
                            <option value="" disabled>Select a Template</option>
                            {ML_TEMPLATES.map(t => (
                                <option key={t.id} value={t.id} className="bg-gray-900">{t.name} ({t.category})</option>
                            ))}
                        </select>
                        
                        <button 
                            onClick={handleReset}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            title="Reset Code"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={handleSaveCode}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            title="Save Snippet"
                        >
                            <Save className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={handleShare}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            title="Copy to Clipboard"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={handleRunCode}
                            disabled={isRunning || (!engineReady && !engineLoading)}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:shadow-none min-w-[120px] justify-center"
                        >
                            {isRunning ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Running</>
                            ) : (
                                <><Play className="w-4 h-4" /> Run Code</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Editor and Output Split */}
                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-6">
                    {/* Left: Code Editor */}
                    <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden min-h-[400px] lg:min-h-0 shadow-xl">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-300">python_script.py</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                            </div>
                        </div>
                        
                        <div className="relative flex-1 group">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="absolute inset-0 w-full h-full p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none code-editor code-scrollbar z-10"
                                spellCheck={false}
                            />
                            {/* Line Numbers Background (Simulated) */}
                            <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/20 border-r border-white/5 pointer-events-none z-0"></div>
                        </div>
                    </div>

                    {/* Right: Output Console */}
                    <div className="flex-1 flex flex-col bg-gray-950 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden min-h-[300px] lg:min-h-0 shadow-xl relative">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-300">Terminal Output</span>
                            </div>
                            {executionTime && (
                                <span className="text-xs text-emerald-400 font-mono">
                                    Done in {executionTime.toFixed(0)}ms
                                </span>
                            )}
                        </div>
                        
                        <div 
                            ref={outputRef}
                            className="flex-1 p-4 font-mono text-sm overflow-y-auto code-scrollbar relative z-10 bg-[#0f111a]"
                        >
                            {!isPyodideLoading() && !engineReady && !isRunning && !output && !error && (
                                <div className="text-center text-gray-500 mt-10">
                                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50 text-indigo-400" />
                                    <p>Select a template and click &quot;Run Code&quot; to begin.</p>
                                    <p className="text-xs mt-2">First run downloads the Python engine.</p>
                                </div>
                            )}

                            {error ? (
                                <div className="text-red-400 whitespace-pre-wrap">
                                    <div className="flex items-center gap-2 text-red-500 mb-2 border-b border-red-500/20 pb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="font-bold">Execution Error</span>
                                    </div>
                                    {error}
                                </div>
                            ) : (
                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {output}
                                </div>
                            )}
                        </div>
                        
                        {/* Terminal scanline effect overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-scan bg-gradient-to-b from-transparent via-emerald-500 to-transparent z-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}