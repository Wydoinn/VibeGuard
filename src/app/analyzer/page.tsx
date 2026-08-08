import type { Metadata } from "next";
import { AnalyzerPanel } from "@/components/AnalyzerPanel";

export const metadata: Metadata = {
  title: "Writing Analyzer",
  description:
    "Paste your text and get instant AI-powered feedback on tone, readability, inclusivity, and jargon — 100% in your browser.",
};

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <span className="eyebrow mb-3">Live Analysis</span>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-soft-white">
            Writing <span className="text-gradient">Analyzer</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Paste your text below and get instant AI-powered feedback on tone,
            readability, and inclusivity.
          </p>
        </div>

        <AnalyzerPanel />
      </div>
    </div>
  );
}
