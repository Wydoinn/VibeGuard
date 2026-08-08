import type { AnalysisResult } from "./modelLoader";

const ctx = self as unknown as Worker;

let modelReady = false;

ctx.addEventListener("message", async (e: MessageEvent) => {
  const { type, text } = e.data;

  if (type === "analyze") {
    try {
      // Phase 1: Load BERT model (cached after first download)
      if (!modelReady) {
        ctx.postMessage({ type: "progress", progress: 5, stage: "Loading AI model…" });
        const { loadModel } = await import("./bertModel");
        await loadModel((progress, stage) => {
          const mapped = 5 + Math.round(progress * 0.3);
          ctx.postMessage({ type: "progress", progress: mapped, stage });
        });
        modelReady = true;
      }

      // Phase 2: BERT sentiment classification on every sentence
      ctx.postMessage({ type: "progress", progress: 40, stage: "Running AI tone analysis…" });
      const { classifySentiments } = await import("./bertModel");
      const { splitSentences } = await import("../analyzers/textProcessing");
      const sentences = splitSentences(text);
      const sentiments = await classifySentiments(sentences);

      // Phase 3: Hybrid tone scoring (BERT + heuristic keywords)
      ctx.postMessage({ type: "progress", progress: 60, stage: "Analyzing tone patterns…" });
      const { analyzeToneWithBERT } = await import("../analyzers/toneAnalyzer");
      const tone = analyzeToneWithBERT(text, sentences, sentiments);

      // Phase 4: Rule-based analyzers
      ctx.postMessage({ type: "progress", progress: 70, stage: "Detecting jargon…" });
      const { detectJargon } = await import("../analyzers/jargonDetector");
      const jargon = detectJargon(text);

      ctx.postMessage({ type: "progress", progress: 80, stage: "Calculating reading level…" });
      const { analyzeReadingLevel } = await import("../analyzers/readingLevel");
      const readingLevel = analyzeReadingLevel(text);

      ctx.postMessage({ type: "progress", progress: 90, stage: "Checking inclusivity…" });
      const { analyzeInclusivity } = await import("../analyzers/inclusivityAnalyzer");
      const inclusivity = analyzeInclusivity(text);

      const result: AnalysisResult = { tone, jargon, readingLevel, inclusivity };

      ctx.postMessage({ type: "progress", progress: 100, stage: "Complete!" });
      ctx.postMessage({ type: "result", result });
    } catch (error) {
      ctx.postMessage({ type: "error", error: String(error) });
    }
  }
});
