"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import HeroCanvas from "@/components/HeroCanvas";
import Navbar from "@/components/Navbar";
import Section from "@/components/ScrollSection";

export default function Home() {
  const { scrollY } = useScroll();

  const blur = useTransform(scrollY, [0, 1000], [0, 25]);

  return (
    <div className="relative w-full h-[400vh] bg-black text-white">

      {/* Navbar */}
      <Navbar />

      {/* Background */}
      <motion.div
        style={{ filter: blur }}
        className="fixed top-0 left-0 w-full h-full"
      >
        <HeroCanvas />
      </motion.div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[5]" />

      {/* Sections */}
      <Section
        scrollY={scrollY}
        start={0}
        end={400}
        title="Learn AI the Modern Way"
        desc="Interactive, visual, and hands-on learning experience."
      />

      <Section
        scrollY={scrollY}
        start={400}
        end={900}
        title="What is Machine Learning?"
        desc="Machines learning patterns from data to make decisions."
      />

      <Section
        scrollY={scrollY}
        start={900}
        end={1400}
        title="Learn by Doing"
        desc="Practice coding, play games, and simulate real-world problems."
      />

      <Section
        scrollY={scrollY}
        start={1400}
        end={2000}
        title="Experience the Future"
        desc="A new way to understand complex concepts with ease."
      />

    </div>
  );
}