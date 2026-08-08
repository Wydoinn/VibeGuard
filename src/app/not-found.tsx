"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-black/[0.04]"
        >
          <Logo className="h-12 w-12" />
        </motion.div>

        <h1 className="mb-3 text-6xl font-bold text-gradient">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-soft-white">
          Page Not Found
        </h2>
        <p className="mb-8 max-w-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. Try heading back
          to the homepage.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-electric px-6 py-3 text-sm font-medium text-deep-black transition-all hover:bg-electric-dim hover:shadow-[0_0_30px_rgba(79,70,229,0.25)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/analyzer"
            className="rounded-xl border border-black/[0.08] bg-black/[0.05] px-6 py-3 text-sm font-medium text-soft-white backdrop-blur-xl transition-all hover:border-black/[0.15] hover:bg-black/[0.08]"
          >
            Open Analyzer
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
