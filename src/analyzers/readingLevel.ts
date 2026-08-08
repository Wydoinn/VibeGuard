import { splitSentences, countSyllables, countWords } from "./textProcessing";

export interface ReadingLevelResult {
  gradeLevel: number;
  label: string;
  complexSentences: string[];
}

export function analyzeReadingLevel(text: string): ReadingLevelResult {
  const sentences = splitSentences(text);
  const totalWords = countWords(text);
  const totalSentences = sentences.length || 1;

  const words = text.split(/\s+/).filter(Boolean);
  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }

  // Flesch-Kincaid Grade Level
  const gradeLevel =
    0.39 * (totalWords / totalSentences) +
    11.8 * (totalSyllables / Math.max(totalWords, 1)) -
    15.59;

  const clampedGrade = Math.max(1, Math.min(18, Math.round(gradeLevel * 10) / 10));

  let label: string;
  if (clampedGrade <= 6) label = "Easy";
  else if (clampedGrade <= 9) label = "Moderate";
  else if (clampedGrade <= 12) label = "Difficult";
  else label = "Advanced";

  // Flag sentences that are long or complex
  const complexSentences = sentences.filter((sentence) => {
    const wordCount = countWords(sentence);
    const syllables = sentence
      .split(/\s+/)
      .filter(Boolean)
      .reduce((acc, w) => acc + countSyllables(w), 0);
    const avgSyllables = syllables / Math.max(wordCount, 1);
    return wordCount > 25 || avgSyllables > 2;
  });

  return {
    gradeLevel: clampedGrade,
    label,
    complexSentences,
  };
}
