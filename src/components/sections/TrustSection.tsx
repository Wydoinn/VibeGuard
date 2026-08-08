"use client";

import { motion } from "framer-motion";
import { Lock, Zap, Globe, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Lock,
    value: "0 bytes",
    label: "sent to any server",
    color: "#4F46E5",
  },
  {
    icon: Zap,
    value: "< 500ms",
    label: "analysis time",
    color: "#059669",
  },
  {
    icon: Globe,
    value: "100%",
    label: "browser-based AI",
    color: "#0891B2",
  },
  {
    icon: ShieldCheck,
    value: "Zero",
    label: "data collection",
    color: "#D97706",
  },
];

export function TrustSection() {
  return (
    <section className="relative border-y border-black/[0.05] bg-black/[0.015] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/5 px-4 py-1.5 text-sm text-electric">
            <Lock className="h-3.5 w-3.5" />
            Privacy by Design
          </span>
        </motion.div>

        <div className="grid grid-cols-2 divide-y divide-black/[0.05] md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map(({ icon: Icon, value, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group flex flex-col items-center gap-2 px-6 py-6 text-center transition-colors duration-300"
            >
              <Icon
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                style={{ color }}
              />
              <span className="numeral text-3xl font-bold text-soft-white md:text-4xl">
                {value}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
