"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    step: "01",
    title: "Paste Text",
    description:
      "Drop in your job description, email, documentation, or any written content.",
    color: "#4F46E5",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Run AI Analysis",
    description:
      "Our browser-based AI analyzes tone, readability, jargon, and inclusivity instantly.",
    color: "#D97706",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Fix & Improve",
    description:
      "Review highlighted issues and suggested improvements. Export your polished text.",
    color: "#059669",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="eyebrow mb-4 justify-center">The Process</span>
          <h2 className="text-4xl font-bold text-soft-white md:text-5xl">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Three simple steps to better writing. No sign-up required.
          </p>
        </motion.div>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Animated connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-[16.5%] right-[16.5%] top-8 hidden h-px bg-gradient-to-r from-electric/40 via-electric/20 to-electric/40 md:block"
          />

          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group relative text-center"
            >
              <div
                className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/5 bg-background shadow-[0_4px_20px_rgba(24,24,27,0.06)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)]"
              >
                <item.icon className="h-7 w-7" style={{ color: item.color }} />
              </div>

              <span
                className="numeral mb-2 block text-5xl font-bold opacity-[0.09] transition-opacity duration-300 group-hover:opacity-[0.18]"
                style={{ color: item.color }}
                aria-hidden
              >
                {item.step}
              </span>
              <h3 className="-mt-9 mb-2 text-xl font-semibold text-soft-white">
                {item.title}
              </h3>
              <p className="mx-auto max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
