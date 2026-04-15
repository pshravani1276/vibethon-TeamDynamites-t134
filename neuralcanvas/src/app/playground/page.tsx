// src/app/playground/page.tsx (Quick implementation)
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function PlaygroundPage() {
    const [code, setCode] = useState(`# Try this ML example
from sklearn import tree

# Features: [weight, texture]
# 0 = smooth, 1 = bumpy
features = [[140, 0], [130, 0], [150, 1], [170, 1]]
labels = ["apple", "apple", "orange", "orange"]

clf = tree.DecisionTreeClassifier()
clf.fit(features, labels)

# Predict
result = clf.predict([[160, 1]])
print(f"Prediction: {result[0]}")
`);
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        setLoading(true);
        setOutput("Running...");

        // Simulate code execution (for demo)
        setTimeout(() => {
            setOutput(`Prediction: orange
  
✅ Code executed successfully!
Note: This is a simulation. Full Python execution would require a backend API.`);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <AnimatedBackground />
            <div className="fixed inset-0 bg-black/40 z-[5]" />
            <div className="relative z-20"><Navbar /></div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-6">💻 Interactive Coding Playground</h1>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Code Editor */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                        <div className="bg-gray-800 px-4 py-2 text-sm">Python Editor</div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-96 p-4 bg-gray-900 text-green-400 font-mono text-sm focus:outline-none"
                        />
                    </div>

                    {/* Output */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                        <div className="bg-gray-800 px-4 py-2 text-sm">Output</div>
                        <pre className="h-96 p-4 text-gray-300 font-mono text-sm overflow-auto">
                            {output || "Click 'Run Code' to see output"}
                        </pre>
                    </div>
                </div>

                <button
                    onClick={runCode}
                    disabled={loading}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold"
                >
                    {loading ? "Running..." : "▶ Run Code"}
                </button>
            </div>
        </div>
    );
}