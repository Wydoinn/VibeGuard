import { splitSentences } from "./textProcessing";

const EXCLUSIONARY_TERMS: Record<string, string> = {
  "crazy": "unexpected",
  "insane": "incredible",
  "lame": "unimpressive",
  "blind spot": "oversight",
  "tone deaf": "insensitive",
  "cripple": "hinder",
  "dumb": "uninformed",
  "sanity check": "confidence check",
  "grandfathered": "legacy",
  "blacklist": "blocklist",
  "whitelist": "allowlist",
  "master": "primary",
  "slave": "replica",
  "manpower": "workforce",
  "man-hours": "work-hours",
  "guys": "team",
  "chairman": "chairperson",
  "mankind": "humanity",
  "freshman": "first-year",
  "policeman": "police officer",
  "fireman": "firefighter",
  "stewardess": "flight attendant",
  "handicapped": "person with a disability",
  "retarded": "delayed",
  "psycho": "unpredictable",
  "OCD": "detail-oriented",
  "spirit animal": "role model",
  "tribe": "community",
  "pow-wow": "meeting",
  "gypped": "cheated",
  "hysteria": "overreaction",
  "man up": "step up",
  "grow a pair": "be courageous",
  "he/him (generic)": "they/them",
  "normal": "typical",
  "elderly": "older adults",
  "suffering from": "living with",
  "confined to wheelchair": "wheelchair user",
};

const INCLUSIVE_WORDS = [
  "accessible",
  "inclusive",
  "equitable",
  "diverse",
  "welcoming",
  "belonging",
  "accommodations",
  "supportive",
  "respectful",
  "collaborative",
];

export interface InclusivityResult {
  score: number; // 0-100
  flaggedTerms: { term: string; suggestion: string }[];
  inclusiveSentences: string[];
  exclusionarySentences: string[];
}

export function analyzeInclusivity(text: string): InclusivityResult {
  const sentences = splitSentences(text);
  const lowerText = text.toLowerCase();

  const flaggedTerms: { term: string; suggestion: string }[] = [];
  const exclusionarySentences: string[] = [];

  for (const [term, suggestion] of Object.entries(EXCLUSIONARY_TERMS)) {
    if (lowerText.includes(term)) {
      flaggedTerms.push({ term, suggestion });
    }
  }

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (
      Object.keys(EXCLUSIONARY_TERMS).some((term) => lower.includes(term))
    ) {
      exclusionarySentences.push(sentence);
    }
  }

  const inclusiveSentences = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return INCLUSIVE_WORDS.some((word) => lower.includes(word));
  });

  // Score: 100 = fully inclusive, penalized proportionally
  const sentenceCount = Math.max(sentences.length, 1);
  const exclusionRatio = exclusionarySentences.length / sentenceCount;
  const inclusiveRatio = inclusiveSentences.length / sentenceCount;
  const termPenalty = Math.min(60, flaggedTerms.length * 10);
  const inclusiveBonus = Math.min(30, Math.round(inclusiveRatio * 100));
  const score = Math.max(0, Math.min(100, 85 - termPenalty - Math.round(exclusionRatio * 20) + inclusiveBonus));

  return {
    score,
    flaggedTerms,
    inclusiveSentences,
    exclusionarySentences,
  };
}
