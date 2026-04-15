"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

type Props = {
    scrollY: MotionValue<number>;
    start: number;
    end: number;
    title: string;
    desc: string;
};

export default function Section({
    scrollY,
    start,
    end,
    title,
    desc,
}: Props) {
    const opacity = useTransform(
        scrollY,
        [start, start + 100, end - 100, end],
        [0, 1, 1, 0]
    );

    const y = useTransform(scrollY, [start, end], [100, -100]);

    return (
        <motion.div
            style={{ opacity, y }}
            className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
        >
            <h2 className="text-4xl md:text-5xl font-semibold">
                {title}
            </h2>

            <p className="mt-4 max-w-xl text-lg text-zinc-300">
                {desc}
            </p>
        </motion.div>
    );
}