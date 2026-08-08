"use client";

import { motion } from "framer-motion";
import { Cpu, Lock, Users, Zap, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Local AI",
    description:
      "All analysis runs directly in your browser using a real DistilBERT model. No servers, no latency, no round-trips.",
    color: "#4F46E5",
    span: "md:col-span-3",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Your text never leaves your device. Zero data collection, zero tracking, zero exceptions.",
    color: "#059669",
    span: "md:col-span-2",
  },
  {
    icon: Users,
    title: "Inclusive Writing",
    description:
      "Detect exclusionary language and get actionable, plain-language suggestions for more inclusive phrasing.",
    color: "#D97706",
    span: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get comprehensive tone, readability, and jargon feedback in milliseconds — no waiting on a queue.",
    color: "#DB2777",
    span: "md:col-span-3",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="eyebrow mb-4">Why VibeGuard</span>
          <h2 className="text-4xl font-bold leading-[1.05] text-soft-white md:text-5xl">
            Powerful features,{" "}
            <span className="text-gradient">zero compromise</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Built for recruiters, writers, and teams who care about how their
            words land.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${feature.span}`}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ backgroundColor: `${feature.color}25` }}
              />
              <div className="relative z-10 flex items-start justify-between">
                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ backgroundColor: `${feature.color}14` }}
                >
                  <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground/0 transition-all duration-300 group-hover:text-muted-foreground/60" />
              </div>
              <h3 className="relative z-10 mb-2.5 text-xl font-semibold text-soft-white">
                {feature.title}
              </h3>
              <p className="relative z-10 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
