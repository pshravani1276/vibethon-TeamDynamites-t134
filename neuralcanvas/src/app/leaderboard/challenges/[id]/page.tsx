// src/app/leaderboard/challenges/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import { executePython, loadPyodideInstance, isPyodideLoading } from "@/lib/pyodide";
import { 
    Play, ShieldCheck, ArrowLeft, Terminal, LayoutPanelLeft, 
    LightbulbIcon, Loader2, CheckCircle2, XCircle
} from "lucide-react";

// Mock Challenge Data mapped to IDs
const CHALLENGE_DATA: Record<string, any> = {
    "linear-regression": {
        title: "Implementing Linear Regression from Scratch",
        difficulty: "Medium",
        category: "Machine Learning",
        description: `
Implement a simple linear regression model that predicts \`y\` given \`x\`.

You are required to implement the \`fit\` method to calculate the \`slope\` (weight) and \`intercept\` (bias) using the least squares method.

The formulas are:
- \`slope = sum((x - mean(x)) * (y - mean(y))) / sum((x - mean(x))^2)\`
- \`intercept = mean(y) - slope * mean(x)\`

Return a tuple \`(slope, intercept)\`.
        `.trim(),
        initialCode: `import numpy as np

def fit_linear_regression(X, y):
    # X is a numpy array of shape (n,)
    # y is a numpy array of shape (n,)
    
    # Calculate slope and intercept
    # YOUR CODE HERE
    
    slope = 0.0
    intercept = 0.0
    
    return float(slope), float(intercept)
`.trim(),
        testCode: `
import numpy as np
X = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 5, 4, 5])
slope, intc = fit_linear_regression(X, y)
print(f"{slope:.4f},{intc:.4f}")
`.trim(),
        expectedOutput: "0.6000,2.2000"
    },
    // Default fallback
    "default": {
        title: "Example Challenge",
        difficulty: "Easy",
        category: "Basics",
        description: "Write a function `add(a, b)` that returns the sum of two numbers.",
        initialCode: "def add(a, b):\n    # YOUR CODE HERE\n    pass",
        testCode: "print(add(5, 7))",
        expectedOutput: "12"
    }
};

export default function ChallengeEditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const challenge = CHALLENGE_DATA[id] || CHALLENGE_DATA["default"];
    
    const { addToast } = useToast();
    const [code, setCode] = useState(challenge.initialCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<"pass" | "fail" | null>(null);
    const [engineReady, setEngineReady] = useState(false);
    
    useEffect(() => {
        const initEngine = async () => {
            if (!isPyodideLoading()) {
                await loadPyodideInstance();
                setEngineReady(true);
            } else {
                setTimeout(initEngine, 1000);
            }
        };
        initEngine();
    }, []);

    const handleRun = async () => {
        if (!code) return;
        setIsRunning(true);
        setResult(null);
        setOutput("Executing...");
        
        try {
            // Include user code and call it immediately with a test case to display output
            const runCode = `${code}\n${challenge.testCode.replace('print(', 'res = ').replace(')', '')}\nprint("Test Output:", res)`;
            const pyodideRes = await executePython(runCode);
            setOutput(pyodideRes.error || pyodideRes.output);
        } catch (err: any) {
            setOutput(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!code) return;
        setIsSubmitting(true);
        setResult(null);
        setOutput("Running test cases...");
        
        try {
            const evaluationCode = `${code}\n${challenge.testCode}`;
            const pyodideRes = await executePython(evaluationCode);
            
            if (pyodideRes.error) {
                setOutput(`Error:\n${pyodideRes.error}`);
                setResult("fail");
            } else {
                const out = pyodideRes.output.trim();
                const expected = challenge.expectedOutput.trim();
                
                if (out === expected) {
                    setOutput(`Passed!\n\nExpected: ${expected}\nGot: ${out}\n\nExecution Time: ${pyodideRes.executionTime.toFixed(2)}ms`);
                    setResult("pass");
                    addToast("Challenge Solved! +50 points", "success");
                } else {
                    setOutput(`Failed.\n\nExpected: ${expected}\nGot: ${out}`);
                    setResult("fail");
                }
            }
        } catch (err: any) {
            setOutput(err.message);
            setResult("fail");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#050507] text-white overflow-hidden">
            <Navbar />
            
            {/* Top Toolbar */}
            <div className="flex-none h-14 border-b border-white/10 mt-16 flex items-center justify-between px-4 bg-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/leaderboard/challenges" className="text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="font-medium text-sm flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            challenge.difficulty === 'Easy' ? 'bg-emerald-500' : 
                            challenge.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        {challenge.title}
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRun}
                        disabled={!engineReady || isRunning || isSubmitting}
                        className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm font-medium transition flex items-center gap-2"
                    >
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Run
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!engineReady || isRunning || isSubmitting}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-md text-sm font-bold transition flex items-center gap-2 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Submit
                    </button>
                    {!engineReady && <div className="text-xs text-amber-500 animate-pulse ml-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading Engine</div>}
                </div>
            </div>

            {/* Main Split Interface */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Left Panel: Description */}
                <div className="w-full md:w-[40%] flex flex-col border-r border-white/10 bg-[#0a0a0f]">
                    <div className="flex-none p-3 border-b border-white/10 bg-white/5 font-semibold text-sm flex items-center gap-2">
                        <LayoutPanelLeft className="w-4 h-4 text-gray-400" /> Description
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 code-scrollbar">
                        <div className="prose prose-invert prose-p:text-gray-300 prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                            <h2 className="text-xl mb-4 text-white font-bold">{challenge.title}</h2>
                            <div className="whitespace-pre-wrap">{challenge.description}</div>
                            
                            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <h4 className="text-blue-400 flex items-center gap-2 font-bold mb-2">
                                    <LightbulbIcon className="w-4 h-4" /> Hint
                                </h4>
                                <p className="text-sm text-blue-200">Use `np.mean()` for calculating averages and `np.sum()` for summation.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code & Terminal */}
                <div className="w-full md:w-[60%] flex flex-col">
                    {/* Code Editor */}
                    <div className="flex-[2] flex flex-col border-b border-white/10 relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="absolute inset-0 w-full h-full p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none code-editor code-scrollbar bg-[#1e1e24]"
                            spellCheck={false}
                        />
                    </div>

                    {/* Console / Terminal */}
                    <div className="flex-1 flex flex-col bg-[#050507]">
                        <div className="flex-none p-2 border-b border-white/10 bg-white/5 font-semibold text-xs flex items-center gap-2 tracking-widest uppercase">
                            <Terminal className="w-4 h-4 text-gray-400" /> Console
                            
                            {result === "pass" && <span className="ml-auto flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Accepted</span>}
                            {result === "fail" && <span className="ml-auto flex items-center gap-1 text-red-400"><XCircle className="w-4 h-4" /> Rejected</span>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 code-scrollbar font-mono text-sm">
                            {output ? (
                                <pre className={`whitespace-pre-wrap ${result === "fail" ? "text-red-400" : result === "pass" ? "text-emerald-400" : "text-gray-300"}`}>
                                    {output}
                                </pre>
                            ) : (
                                <div className="text-gray-600 italic">Run your code to see output here.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
