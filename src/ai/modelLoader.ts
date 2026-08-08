import type { ToneResult } from "@/analyzers/toneAnalyzer";
import type { JargonResult } from "@/analyzers/jargonDetector";
import type { ReadingLevelResult } from "@/analyzers/readingLevel";
import type { InclusivityResult } from "@/analyzers/inclusivityAnalyzer";

export interface AnalysisResult {
  tone: ToneResult;
  jargon: JargonResult;
  readingLevel: ReadingLevelResult;
  inclusivity: InclusivityResult;
}
