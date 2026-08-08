"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-deep-black/70 shadow-[0_1px_0_rgba(24,24,27,0.06)] backdrop-blur-2xl"
          : "bg-deep-black/0 backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-lg font-semibold tracking-tight text-soft-white">
            VibeGuard
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-soft-white"
            >
              {label}
              <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-electric transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/analyzer"
            className={`press-scale ml-3 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              pathname === "/analyzer"
                ? "bg-electric-dim text-white"
                : "bg-electric text-deep-black hover:bg-electric-dim hover:shadow-[0_0_20px_rgba(79,70,229,0.25)]"
            }`}
          >
            Start Analyzing
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.03] p-2 text-muted-foreground transition-colors hover:text-soft-white md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-black/[0.06] bg-deep-black/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-4 pt-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-soft-white"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/analyzer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-electric px-3 py-2.5 text-center text-sm font-medium text-deep-black transition-all hover:bg-electric-dim"
              >
                Start Analyzing
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
