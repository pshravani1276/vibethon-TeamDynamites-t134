// src/app/page.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Section from "@/components/ScrollSection";
import HeroCanvas from "@/components/HeroCanvas";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  const heroBgOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const gradientBgOpacity = useTransform(scrollY, [100, 400], [0, 1]);
  const heroBgScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white overflow-x-hidden">

      {/* 3D Video Background */}
      <motion.div
        style={{
          opacity: heroBgOpacity,
          scale: heroBgScale,
          zIndex: 0
        }}
        className="fixed top-0 left-0 w-full h-full"
      >
        <HeroCanvas />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Gradient Animated Background with Particles */}
      <motion.div
        style={{
          opacity: gradientBgOpacity,
          zIndex: 1
        }}
        className="fixed top-0 left-0 w-full h-full"
      >
        <AnimatedBackground />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        style={{
          backgroundColor: useTransform(scrollY, [0, 500], ["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]),
          zIndex: 5
        }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Section
          scrollY={scrollY}
          start={0}
          end={400}
          title="Learn AI &amp; ML the Modern Way"
          desc="Interactive, visual, and hands-on learning experience. Master complex concepts through practice, games, and real-world simulations."
          cta={{
            primary: { text: "🚀 Start Learning →", href: "/dashboard" },
            secondary: { text: "🎥 Watch Demo", href: "/demo" }
          }}
          isHero={true}
        />

        <Section
          scrollY={scrollY}
          start={400}
          end={900}
          title="📚 Structured Learning Paths"
          desc="From Beginner to Advanced — Master AIML concepts systematically"
          features={[
            "🎯 Beginner → Intermediate → Advanced levels",
            "📖 Concept explanations with real-world examples",
            "📊 Interactive visual aids & diagrams",
            "✅ Module completion tracking"
          ]}
          stats={[
            { label: "Learning Modules", value: "12+" },
            { label: "Interactive Examples", value: "30+" },
            { label: "Hours of Content", value: "40+" }
          ]}
        />

        <Section
          scrollY={scrollY}
          start={900}
          end={1400}
          title="💻 Interactive Coding Playground"
          desc="Write, run, and experiment with Python code — directly in your browser"
          features={[
            "🐍 In-browser Python execution environment",
            "📝 Pre-built sample scripts to modify",
            "⚡ Real-time output & error feedback",
            "🎯 No setup required — start coding instantly"
          ]}
          demoCode={`# Try this simple ML example
from sklearn import tree

features = [[140, 0], [130, 0], [150, 1], [170, 1]]
labels = ["apple", "apple", "orange", "orange"]

clf = tree.DecisionTreeClassifier()
clf.fit(features, labels)
result = clf.predict([[160, 1]])
print(f"Prediction: {result[0]}")`}
        />

        <Section
          scrollY={scrollY}
          start={1400}
          end={1900}
          title="🎮 Learn Through Play"
          desc="Interactive games that make complex concepts fun and memorable"
          features={[
            "🌳 Decision Tree Builder — Build your own classification tree",
            "🧠 Neural Network Visualizer — See how neurons activate",
            "🎯 Classification Challenge — Sort data points in real-time",
            "🔍 Pattern Recognition — Train a simple AI to spot patterns"
          ]}
          badges={["🎮 Decision Trees", "🧠 Neural Networks", "📊 Classification", "🎯 Pattern Recognition"]}
        />

        <Section
          scrollY={scrollY}
          start={1900}
          end={2400}
          title="📝 Test Your Knowledge"
          desc="Module-wise quizzes with instant feedback and scoring"
          features={[
            "❓ MCQs and code-based questions",
            "💬 Instant feedback with explanations",
            "📈 Score tracking & progress indicators",
            "🔓 Unlock next levels by passing assessments"
          ]}
          stats={[
            { label: "Quiz Questions", value: "50+" },
            { label: "Practice Problems", value: "25+" },
            { label: "Topics Covered", value: "15+" }
          ]}
        />

        <Section
          scrollY={scrollY}
          start={2400}
          end={2900}
          title="🌍 Real-World Problem Simulations"
          desc="Apply AIML concepts to solve practical challenges"
          features={[
            "📧 Spam Detection — Build a classifier for emails",
            "🖼️ Image Classification — Train a model to recognize objects",
            "💬 Sentiment Analysis — Analyze movie reviews",
            "🏠 Housing Price Predictor — Use regression to estimate prices"
          ]}
          cta={{
            primary: { text: "🎯 Try a Simulation →", href: "/simulations" }
          }}
        />

        <Section
          scrollY={scrollY}
          start={2900}
          end={3400}
          title="🏆 Track Your Journey"
          desc="Monitor progress, earn badges, and compete on leaderboards"
          features={[
            "📊 Visual progress bars & completion metrics",
            "⭐ Achievement badges for milestones",
            "🔥 Daily streaks & activity tracking",
            "🏅 Global leaderboard — compare with peers"
          ]}
          badges={["🔥 Daily Streaks", "⭐ Achievement Badges", "📊 Progress Tracking", "🏅 Leaderboards"]}
        />

        <Section
          scrollY={scrollY}
          start={3400}
          end={4000}
          title="Ready to Master AIML?"
          desc="Join thousands of learners building practical AI skills through hands-on experience"
          cta={{
            primary: { text: "✨ Get Started Free →", href: "/signup" },
            secondary: { text: "📦 View GitHub Repo", href: "https://github.com" }
          }}
          footer={true}
        />
      </div>
    </div>
  );
}