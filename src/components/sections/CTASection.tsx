"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

const MARQUEE_ITEMS = [
  "Write Better",
  "Sound Human",
  "Stay Inclusive",
  "Ship Clarity",
];

export function CTASection() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Marquee banner */}
      <div className="mb-16 select-none overflow-hidden border-y border-black/[0.05] py-5">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {[...loop, ...loop].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-10 text-2xl font-semibold tracking-tight text-soft-white/15 md:text-3xl"
            >
              {item}
              <span className="text-electric/30">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/[0.06]">
            <Logo className="h-10 w-10" />
          </div>

          <h2 className="mb-4 text-4xl font-bold text-soft-white md:text-6xl">
            Ready to write <span className="text-gradient">better</span>?
          </h2>
          <p className="mx-auto mb-9 max-w-xl text-lg text-muted-foreground">
            Start analyzing your writing today. No sign-up, no credit card, no
            data collection. Just better writing — instantly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/analyzer"
              className="press-scale group relative overflow-hidden rounded-xl bg-electric px-8 py-4 text-base font-semibold text-deep-black shadow-[0_8px_30px_rgba(79,70,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-electric-dim hover:shadow-[0_12px_40px_rgba(79,70,229,0.35)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Analyzing — Free Forever
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No sign-up required &middot; Works completely offline &middot;
            Your text stays on your device
          </p>
        </motion.div>
      </div>
    </section>
  );
}
