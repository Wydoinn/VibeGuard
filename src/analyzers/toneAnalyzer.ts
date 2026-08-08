import { splitSentences } from "./textProcessing";
import type { SentimentResult } from "@/ai/bertModel";

const AGGRESSIVE_WORDS = [
  "must",
  "immediately",
  "required",
  "mandatory",
  "failure",
  "unacceptable",
  "demand",
  "urgent",
  "critical",
  "asap",
  "non-negotiable",
  "absolutely",
  "strictly",
  "warning",
  "consequences",
  "terminate",
  "enforce",
  "comply",
  "violation",
  "penalty",
  "forbidden",
  "prohibit",
  "refuse",
  "reject",
  "deny",
  "never",
  "impossible",
  "blame",
  "fault",
  "incompetent",
  "unqualified",
  "inadequate",
  "insufficient",
  "deadline",
  "overdue",
  "inexcusable",
];

const FRIENDLY_WORDS = [
  "please",
  "thank",
  "appreciate",
  "welcome",
  "glad",
  "happy",
  "great",
  "wonderful",
  "excellent",
  "kindly",
  "support",
  "help",
  "encourage",
  "opportunity",
  "collaborate",
  "together",
  "consider",
  "suggest",
  "recommend",
  "flexible",
  "enjoy",
  "excited",
  "thrilled",
  "delighted",
  "grateful",
  "fantastic",
  "amazing",
  "valuable",
  "inspire",
  "growth",
  "empower",
  "trust",
  "respect",
  "care",
  "benefit",
];

export interface ToneResult {
  score: number; // 0-100, higher = friendlier
  label: "aggressive" | "neutral" | "friendly";
  aggressionScore: number; // 0-100
  empathyScore: number; // 0-100
  flaggedSentences: string[];
}

export function analyzeTone(text: string): ToneResult {
  const sentences = splitSentences(text);
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/).filter(Boolean);
  const wordCount = Math.max(words.length, 1);

  let aggressiveCount = 0;
  let friendlyCount = 0;

  for (const word of words) {
    const cleaned = word.replace(/[^a-z-]/g, "");
    if (AGGRESSIVE_WORDS.includes(cleaned)) aggressiveCount++;
    if (FRIENDLY_WORDS.includes(cleaned)) friendlyCount++;
  }

  const totalSignals = aggressiveCount + friendlyCount || 1;
  const friendlyRatio = friendlyCount / totalSignals;

  // Tone score: 0 = very aggressive, 100 = very friendly
  let score = Math.round(friendlyRatio * 100);
  if (aggressiveCount === 0 && friendlyCount === 0) score = 60; // neutral default

  // Use logarithmic scaling for aggression to avoid spikes on short text
  const aggressionDensity = aggressiveCount / wordCount;
  const aggressionScore = Math.min(
    100,
    Math.round(Math.min(aggressionDensity * 15, 1) * 100)
  );

  // Empathy: scaled by word density, capped smoothly
  const empathyDensity = friendlyCount / wordCount;
  const empathyScore = Math.min(
    100,
    Math.round(Math.min(empathyDensity * 12, 1) * 100)
  );

  const flaggedSentences = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return AGGRESSIVE_WORDS.some((w) => lower.includes(w));
  });

  let label: ToneResult["label"] = "neutral";
  if (score >= 65) label = "friendly";
  else if (score <= 35) label = "aggressive";

  return {
    score,
    label,
    aggressionScore,
    empathyScore,
    flaggedSentences,
  };
}

/**
 * Hybrid tone analysis: 70% BERT sentiment + 30% keyword heuristics.
 * Called from the Web Worker after BERT classifies every sentence.
 */
export function analyzeToneWithBERT(
  text: string,
  sentences: string[],
  sentiments: SentimentResult[]
): ToneResult {
  // --- BERT aggregate scores ---
  let bertPositive = 0;
  let bertNegative = 0;
  const flaggedByBert: string[] = [];

  for (let i = 0; i < sentences.length; i++) {
    const s = sentiments[i];
    if (s.label === "NEGATIVE") {
      bertNegative += s.score;
      if (s.score > 0.75) flaggedByBert.push(sentences[i]);
    } else {
      bertPositive += s.score;
    }
  }

  const n = Math.max(sentences.length, 1);
  const avgPos = bertPositive / n;
  const avgNeg = bertNegative / n;

  // BERT tone score: 0 = very aggressive, 100 = very friendly
  const bertTone = Math.round((avgPos / (avgPos + avgNeg + 1e-6)) * 100);
  const bertAggression = Math.min(100, Math.round(avgNeg * 100));
  const bertEmpathy = Math.min(100, Math.round(avgPos * 100));

  // --- Keyword heuristic (unchanged existing logic) ---
  const heuristic = analyzeTone(text);

  // --- Blend: 70 % BERT + 30 % heuristic ---
  const score = Math.round(bertTone * 0.7 + heuristic.score * 0.3);
  const aggressionScore = Math.round(
    bertAggression * 0.7 + heuristic.aggressionScore * 0.3
  );
  const empathyScore = Math.round(
    bertEmpathy * 0.7 + heuristic.empathyScore * 0.3
  );

  // De-duplicate flagged sentences from both sources
  const allFlagged = new Set([...flaggedByBert, ...heuristic.flaggedSentences]);

  let label: ToneResult["label"] = "neutral";
  if (score >= 65) label = "friendly";
  else if (score <= 35) label = "aggressive";

  return {
    score,
    label,
    aggressionScore,
    empathyScore,
    flaggedSentences: Array.from(allFlagged),
  };
}
