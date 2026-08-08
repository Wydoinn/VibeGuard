"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalysisResult } from "@/ai/modelLoader";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  excerpt: string;
  wordCount: number;
  overallScore: number;
  text: string;
  results: AnalysisResult;
}

const STORAGE_KEY = "vibeguard:history";
const MAX_ENTRIES = 20;

function computeOverallScore(results: AnalysisResult): number {
  const { tone, jargon, readingLevel, inclusivity } = results;
  const readingScore = Math.max(
    0,
    Math.min(100, Math.round((1 - readingLevel.gradeLevel / 18) * 100))
  );
  const jargonScore = jargon.score ?? Math.max(0, 100 - jargon.count * 20);
  return Math.round(
    tone.score * 0.25 +
      readingScore * 0.2 +
      jargonScore * 0.15 +
      inclusivity.score * 0.25 +
      Math.max(0, 100 - tone.aggressionScore) * 0.15
  );
}

function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable — fail silently, history is a convenience feature.
  }
}

/**
 * Persists past analyses to the browser's localStorage so a returning user
 * can revisit or compare previous audits. Nothing is ever sent to a server —
 * this is purely client-side, matching VibeGuard's privacy-first design.
 */
export function useAnalysisHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load from localStorage after mount only — this component may be
  // server-rendered, and localStorage is unavailable there. Reading it
  // synchronously during render would also cause a hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external, browser-only store on mount; unavoidable given SSR
    setHistory(readHistory());
  }, []);

  const addEntry = useCallback((text: string, results: AnalysisResult) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      excerpt: text.trim().slice(0, 80),
      wordCount: text.split(/\s+/).filter(Boolean).length,
      overallScore: computeOverallScore(results),
      text,
      results,
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      writeHistory(next);
      return next;
    });
    return entry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    writeHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
