"use client";

import { motion } from "framer-motion";
import { AnalyzerPanel } from "@/components/AnalyzerPanel";

export function DemoSection() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="eyebrow mb-4 justify-center">Live Demo</span>
          <h2 className="text-4xl font-bold text-soft-white md:text-5xl">
            Try It <span className="text-gradient">Now</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Experience the power of privacy-first AI writing analysis. No
            sign-up needed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <AnalyzerPanel compact />
        </motion.div>
      </div>
    </section>
  );
}
