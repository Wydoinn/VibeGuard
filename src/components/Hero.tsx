"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

const LINE_ONE = "AI That Fixes";
const LINE_TWO = "Your Writing";

function KineticLine({
  text,
  delayOffset,
  gradient = false,
}: {
  text: string;
  delayOffset: number;
  gradient?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em]">
      {words.map((word, i) => (
        <span key={word} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em]">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              delay: delayOffset + i * 0.08,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block ${gradient ? "text-gradient" : ""}`}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pb-20 pt-16">
      {/* Mesh gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="mesh-blob left-[8%] top-[18%] h-72 w-72 bg-electric/[0.10] md:h-96 md:w-96" />
        <div className="mesh-blob right-[10%] top-[8%] h-56 w-56 bg-violet-500/[0.08] md:h-80 md:w-80" />
        <div className="mesh-blob bottom-[10%] left-[38%] h-64 w-64 bg-indigo-300/[0.10]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/5 px-4 py-1.5 text-sm text-electric"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
          </span>
          100% Browser-Based AI &mdash; Zero Data Collection
        </motion.div>

        <h1 className="mb-7 text-balance text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight text-soft-white">
          <KineticLine text={LINE_ONE} delayOffset={0.25} />
          <br />
          <KineticLine text={LINE_TWO} delayOffset={0.45} gradient />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto mb-11 max-w-xl text-balance text-lg text-muted-foreground md:text-xl"
        >
          VibeGuard analyzes tone, clarity, and inclusivity directly in your
          browser. Your text never leaves your device.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/analyzer"
            className="press-scale group relative overflow-hidden rounded-xl bg-electric px-8 py-3.5 text-base font-semibold text-deep-black shadow-[0_8px_30px_rgba(79,70,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-electric-dim hover:shadow-[0_12px_40px_rgba(79,70,229,0.35)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Analyzing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>

          <Link
            href="#how-it-works"
            className="press-scale rounded-xl border border-black/[0.08] bg-black/[0.02] px-8 py-3.5 text-base font-medium text-soft-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-electric/25 hover:bg-electric/[0.04]"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Social proof label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-muted-foreground"
        >
          {["No sign-up", "No data collection", "Works offline"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-electric/60" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest uppercase opacity-50">Scroll</span>
          <ArrowDown className="h-4 w-4 opacity-50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
