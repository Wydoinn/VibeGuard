export interface SentimentResult {
  label: "POSITIVE" | "NEGATIVE";
  score: number;
}

type ProgressCallback = (progress: number, stage: string) => void;

// Singleton pipeline instance — persists across analyze calls in the worker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let classifier: any = null;
let loadPromise: Promise<void> | null = null;

export async function loadModel(onProgress?: ProgressCallback): Promise<void> {
  if (classifier) return;
  if (loadPromise) {
    await loadPromise;
    return;
  }

  loadPromise = (async () => {
    try {
      // Dynamic import — required for Web Worker compatibility with Turbopack
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;

      classifier = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        {
          dtype: "q8",
          progress_callback: (data: {
            status: string;
            progress?: number;
            file?: string;
          }) => {
            if (data.status === "progress" && data.progress != null) {
              onProgress?.(
                Math.round(data.progress),
                `Downloading AI model… ${Math.round(data.progress)}%`
              );
            } else if (data.status === "ready") {
              onProgress?.(100, "AI model ready");
            }
          },
        }
      );
    } catch (err) {
      loadPromise = null;
      throw err;
    }
  })();

  await loadPromise;
}

export async function classifySentiments(
  sentences: string[]
): Promise<SentimentResult[]> {
  if (!classifier) throw new Error("Model not loaded. Call loadModel() first.");

  // Filter to non-empty sentences for batch inference
  const validIndices: number[] = [];
  const validSentences: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    const trimmed = sentences[i].trim();
    if (trimmed) {
      validIndices.push(i);
      validSentences.push(trimmed);
    }
  }

  // Default all to neutral
  const results: SentimentResult[] = sentences.map(() => ({
    label: "POSITIVE" as const,
    score: 0.5,
  }));

  if (validSentences.length > 0) {
    const outputs = (await classifier(validSentences)) as Array<{
      label: string;
      score: number;
    }>;
    for (let i = 0; i < validIndices.length; i++) {
      results[validIndices[i]] = {
        label: outputs[i].label as "POSITIVE" | "NEGATIVE",
        score: outputs[i].score,
      };
    }
  }

  return results;
}
