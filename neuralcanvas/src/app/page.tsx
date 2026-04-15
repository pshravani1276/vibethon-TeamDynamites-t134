"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";

export default function Home() {
  const { scrollY } = useScroll();

  // Blur increases when scrolling
  const blur = useTransform(scrollY, [0, 500], [0, 20]);

  // Fade out hero text on scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative w-full h-[300vh] bg-black text-white">

      {/* Canvas Background with Blur */}
      <motion.div
        style={{ filter: blur }}
        className="fixed top-0 left-0 w-full h-full"
      >
        <HeroCanvas />
      </motion.div>

      {/* Dark Overlay (IMPORTANT for visibility) */}
      <div className="fixed inset-0 bg-black/40 z-[5]" />

      {/* TOP NAV / TITLE */}
      <motion.div
        style={{ opacity }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-10"
      >
        <h1 className="text-2xl font-semibold tracking-wide">
          NeuralCanvas
        </h1>
      </motion.div>

      {/* CENTER CONTENT */}
      <motion.section
        style={{ opacity }}
        className="fixed inset-0 flex flex-col items-center justify-center z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl text-lg text-zinc-300"
        >
          Learn Artificial Intelligence and Machine Learning through
          interactive experiences, games, and real-world simulations.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 rounded-full bg-white text-black font-medium"
        >
          Get Started
        </motion.button>
      </motion.section>

      {/* SECOND SECTION */}
      <section className="absolute top-[120vh] w-full flex justify-center text-center px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl font-semibold">
            What is Machine Learning?
          </h2>

          <p className="mt-4 text-zinc-300 text-lg">
            Machine Learning is a method of teaching computers to learn patterns
            from data and make decisions without being explicitly programmed.
          </p>
        </motion.div>
      </section>

    </div>
  );
}