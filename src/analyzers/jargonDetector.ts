import { splitSentences } from "./textProcessing";

const JARGON_WORDS = [
  "synergy",
  "bandwidth",
  "leverage",
  "paradigm",
  "low-hanging fruit",
  "circle back",
  "deep dive",
  "move the needle",
  "thought leader",
  "disrupt",
  "scalable",
  "best practice",
  "value-add",
  "action items",
  "stakeholder",
  "pivot",
  "ecosystem",
  "optics",
  "alignment",
  "buy-in",
  "deliverable",
  "drill down",
  "game changer",
  "holistic",
  "incentivize",
  "ideation",
  "mission-critical",
  "net-net",
  "north star",
  "pain point",
  "proactive",
  "robust",
  "streamline",
  "synergize",
  "take offline",
  "touch base",
  "value proposition",
  "vertical",
  "wheelhouse",
  "boil the ocean",
  "bleeding edge",
  "core competency",
  "cross-functional",
  "disruptive innovation",
  "double down",
  "fast-track",
  "growth hacking",
  "high-level",
  "impact",
  "iterate",
  "learnings",
  "level set",
  "low-touch",
  "onboard",
  "operationalize",
  "paradigm shift",
  "ping",
  "put a pin",
  "rightsizing",
  "run it up the flagpole",
  "secret sauce",
  "table stakes",
  "unpack",
  "uplevel",
  "win-win",
  "circle the wagons",
  "move the goalposts",
  "thought leadership",
  "at the end of the day",
  "rock star",
  "ninja",
  "guru",
  "synergistic",
];

export interface JargonResult {
  count: number;
  score: number; // 0-100, higher = less jargon (better)
  jargonSentences: string[];
  detectedTerms: string[];
}

export function detectJargon(text: string): JargonResult {
  const sentences = splitSentences(text);
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const detectedTerms: string[] = [];
  const jargonSentences: string[] = [];

  for (const term of JARGON_WORDS) {
    if (lowerText.includes(term) && !detectedTerms.includes(term)) {
      detectedTerms.push(term);
    }
  }

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (JARGON_WORDS.some((term) => lower.includes(term))) {
      jargonSentences.push(sentence);
    }
  }

  // Scoring: scale by density, not raw count. Max 100% penalty at ~10% jargon density
  const jargonDensity = detectedTerms.length / Math.max(wordCount / 10, 1);
  const score = Math.max(0, Math.min(100, Math.round(100 - jargonDensity * 50)));

  return {
    count: detectedTerms.length,
    score,
    jargonSentences,
    detectedTerms,
  };
}
