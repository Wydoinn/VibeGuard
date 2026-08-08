"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Copy, Check, Download, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { HighlightViewer } from "@/components/HighlightViewer";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useAnalysisHistory, type HistoryEntry } from "@/lib/useAnalysisHistory";
import type { AnalysisResult } from "@/ai/modelLoader";

const MAX_CHARS = 10000;

const SAMPLE_TEXTS = [
  `We are looking for a rock star developer who must have 10+ years of experience. Candidates must immediately demonstrate their bandwidth to leverage synergies across the ecosystem. Failure to comply with our strict requirements will result in immediate termination. This is non-negotiable and mandatory for all applicants. We need someone who can hit the ground running and circle back on deliverables ASAP.`,
  `We'd love to welcome a passionate engineer to our collaborative team! We appreciate diverse perspectives and encourage candidates from all backgrounds to apply. You'll have the opportunity to grow alongside supportive colleagues who value work-life balance. We believe in flexible arrangements and are happy to discuss accommodations. Together, we'll build accessible products that make a real difference.`,
  `The chairman announced that the guys in manpower need to sanity check the new blacklist before the deadline. Anyone who is handicapped by the legacy system should man up and find a workaround. We need to leverage our core competency and circle back on the action items from the pow-wow. Let's not boil the ocean — focus on the low-hanging fruit first.`,
];

interface AnalyzerPanelProps {
  compact?: boolean;
}

export function AnalyzerPanel({ compact = false }: AnalyzerPanelProps) {
  const [text, setText] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const { history, addEntry, removeEntry, clearHistory } = useAnalysisHistory();

  // Lazily create the worker on first use
  const getWorker = useCallback((): Worker => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../ai/worker.ts", import.meta.url),
        { type: "module" }
      );
    }
    return workerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResults(null);
    setProgress(0);
    setError(null);
    setStage("Initializing analyzers...");

    const worker = getWorker();

    const onMessage = (e: MessageEvent) => {
      const { type, progress: p, stage: s, result, error } = e.data;
      if (type === "progress") {
        setProgress(p as number);
        setStage(s as string);
      } else if (type === "result") {
        setProgress(100);
        setStage("Complete!");
        setTimeout(() => {
          setResults(result as AnalysisResult);
          setIsAnalyzing(false);
          addEntry(text, result as AnalysisResult);
        }, 300);
        worker.removeEventListener("message", onMessage);
      } else if (type === "error") {
        console.error("Worker error:", error);
        setError("Analysis failed. Please try again.");
        setIsAnalyzing(false);
        worker.removeEventListener("message", onMessage);
      }
    };

    worker.addEventListener("message", onMessage);
    worker.postMessage({ type: "analyze", text });
  }, [text, getWorker, addEntry]);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setText(entry.text);
    setResults(entry.results);
    setError(null);
    setShowHistory(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [text]);

  const handleExport = useCallback(() => {
    if (!text.trim() || !results) return;
    const { tone, jargon, readingLevel, inclusivity } = results;
    const report = [
      "VibeGuard Analysis Report",
      "=".repeat(40),
      "",
      "ORIGINAL TEXT:",
      text,
      "",
      "ANALYSIS RESULTS:",
      `Tone Score: ${tone.score}/100 (${tone.label})`,
      `Empathy Score: ${tone.empathyScore}/100`,
      `Aggression Risk: ${tone.aggressionScore}/100`,
      `Reading Level: Grade ${readingLevel.gradeLevel} — ${readingLevel.label}`,
      `Jargon Count: ${jargon.count} terms detected`,
      `Inclusivity Score: ${inclusivity.score}/100`,
      "",
      jargon.detectedTerms.length > 0
        ? `JARGON DETECTED:\n${jargon.detectedTerms.map((t) => `  • ${t}`).join("\n")}`
        : "",
      inclusivity.flaggedTerms.length > 0
        ? `INCLUSIVITY SUGGESTIONS:\n${inclusivity.flaggedTerms.map(({ term, suggestion }) => `  • "${term}" → "${suggestion}"`).join("\n")}`
        : "",
      "",
      "Generated by VibeGuard — https://vibeguard.app",
      "All analysis ran locally in your browser. Your text was never sent anywhere.",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vibeguard-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [text, results]);

  const loadSampleText = useCallback(() => {
    const sample = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(sample);
    setResults(null);
    setError(null);
  }, []);

  // Ctrl/Cmd + Enter to analyze
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && text.trim() && !isAnalyzing) {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [text, isAnalyzing, handleAnalyze]);

  if (compact) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <textarea
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
          }}
          placeholder="Paste your text here to see VibeGuard in action..."
          className="mb-4 h-32 w-full resize-none rounded-xl glass-input p-4 text-sm text-soft-white placeholder:text-muted-foreground focus:border-electric/30 focus:outline-none focus:ring-1 focus:ring-electric/20"
          aria-label="Text input for analysis"
          maxLength={MAX_CHARS}
        />
        {!text.trim() && (
          <button
            onClick={loadSampleText}
            className="mb-3 flex items-center gap-1.5 text-xs text-electric/70 transition-colors hover:text-electric"
          >
            <FileText className="h-3.5 w-3.5" />
            Try a sample text
          </button>
        )}
        <Button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-electric text-deep-black hover:bg-electric-dim"
        >
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isAnalyzing ? stage : "Analyze Text"}
        </Button>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <ResultsDashboard results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      {/* Left: Text Input */}
      <div className="flex flex-col lg:sticky lg:top-24">
        <div className="glass-card flex flex-col rounded-2xl p-6">
          <label
            htmlFor="analyzer-input"
            className="mb-3 block text-sm font-medium text-soft-white"
          >
            Your Text
          </label>
          <textarea
            id="analyzer-input"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
            }}
            placeholder="Paste your job description, email, documentation, or any text you'd like to audit..."
            className="h-72 max-h-[32rem] min-h-[12rem] w-full resize-y rounded-xl glass-input p-4 text-sm leading-relaxed text-soft-white placeholder:text-muted-foreground focus:border-electric/30 focus:outline-none focus:ring-1 focus:ring-electric/20"
            aria-label="Text input for analysis"
            maxLength={MAX_CHARS}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {text.split(/\s+/).filter(Boolean).length} words
              </span>
              <span className="text-xs text-muted-foreground">
                {text.length}/{MAX_CHARS}
              </span>
              {!text.trim() && (
                <button
                  onClick={loadSampleText}
                  className="flex items-center gap-1.5 text-xs text-electric/70 transition-colors hover:text-electric"
                  aria-label="Load sample text"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Try a sample
                </button>
              )}
              {text.trim() && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-soft-white"
                  aria-label="Copy text to clipboard"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div className="relative flex items-center gap-3">
              <Button
                onClick={() => setShowHistory((v) => !v)}
                variant="outline"
                size="lg"
                className="border-black/10 bg-black/[0.03] text-muted-foreground hover:border-electric/30 hover:text-soft-white px-4"
                aria-label="View analysis history"
                aria-expanded={showHistory}
              >
                <History className="h-4 w-4" />
                {history.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-electric/10 px-1.5 text-xs font-medium text-electric">
                    {history.length}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {showHistory && (
                  <HistoryPanel
                    history={history}
                    onSelect={handleSelectHistory}
                    onRemove={removeEntry}
                    onClear={clearHistory}
                    onClose={() => setShowHistory(false)}
                  />
                )}
              </AnimatePresence>
              {results && (
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="lg"
                  className="border-black/10 bg-black/[0.03] text-muted-foreground hover:border-electric/30 hover:text-soft-white px-6"
                  aria-label="Download analysis report"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="bg-electric px-6 text-deep-black transition-all hover:bg-electric-dim hover:shadow-[0_0_30px_rgba(79,70,229,0.25)]"
                size="lg"
              >
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isAnalyzing ? stage : "Analyze Text"}
              </Button>
              <span className="hidden text-xs text-muted-foreground/50 lg:inline">
                Ctrl + Enter
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                  <motion.div
                    className="h-full rounded-full bg-electric"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{stage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3"
                role="alert"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Right: Results */}
      <div aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ResultsDashboard results={results} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card flex h-full min-h-[400px] items-center justify-center rounded-2xl p-6"
            >
              <div className="text-center">
                <Sparkles className="mx-auto mb-4 h-12 w-12 text-electric/25" />
                <p className="text-sm text-muted-foreground">
                  Paste your text and click{" "}
                  <span className="font-medium text-soft-white">
                    Analyze Text
                  </span>{" "}
                  to see results
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

      {/* Highlight viewer - full width */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-6"
          >
            <HighlightViewer text={text} results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
