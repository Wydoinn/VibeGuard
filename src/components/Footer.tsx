"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

const footerLinks = [
  { href: "/analyzer", label: "Analyzer" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-t border-black/[0.05]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="text-2xl font-semibold tracking-tight text-soft-white">
                VibeGuard
              </span>
            </Link>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              Your text never leaves your device.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group relative text-sm text-muted-foreground transition-colors hover:text-soft-white"
              >
                {label}
                <span className="absolute inset-x-0 -bottom-1 h-px scale-x-0 bg-electric transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/[0.05] pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {`\u00A9 ${new Date().getFullYear()} VibeGuard. Free & open source. No data ever collected.`}
          </p>
          <p className="text-xs text-muted-foreground">
            Built with browser-native AI &middot; No servers involved
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
