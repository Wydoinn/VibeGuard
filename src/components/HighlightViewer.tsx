"use client";

import { Fragment, useMemo } from "react";
import { motion } from "framer-motion";
import type { AnalysisResult } from "@/ai/modelLoader";
import { splitSentences } from "@/analyzers/textProcessing";

interface HighlightViewerProps {
  text: string;
  results: AnalysisResult;
}

type HighlightType = "aggressive" | "jargon" | "complex" | "inclusive";

interface HighlightedSentence {
  sentence: string;
  types: HighlightType[];
}

type Line =
  | { blank: true; sentences: never[] }
  | { blank: false; sentences: HighlightedSentence[] };

const COLORS: Record<HighlightType, string> = {
  aggressive: "bg-red-500/15 border-red-500/40 text-red-700",
  jargon: "bg-yellow-500/15 border-yellow-500/40 text-yellow-800",
  complex: "bg-blue-500/15 border-blue-500/40 text-blue-700",
  inclusive: "bg-green-500/15 border-green-500/40 text-green-700",
};

export function HighlightViewer({ text, results }: HighlightViewerProps) {
  // Preserve the exact line/paragraph structure the user pasted — analysis
  // still runs sentence-by-sentence, but we render it back out line-by-line
  // instead of collapsing everything into one flowing block.
  const lines = useMemo((): Line[] => {
    const { tone, jargon, readingLevel, inclusivity } = results;
    const flaggedSet = new Set(tone.flaggedSentences);
    const jargonSet = new Set(jargon.jargonSentences);
    const complexSet = new Set(readingLevel.complexSentences);
    const inclusiveSet = new Set(inclusivity.inclusiveSentences);
    const exclusionarySet = new Set(inclusivity.exclusionarySentences);

    const classify = (sentence: string): HighlightType[] => {
      const types: HighlightType[] = [];
      if (flaggedSet.has(sentence) || exclusionarySet.has(sentence))
        types.push("aggressive");
      if (jargonSet.has(sentence)) types.push("jargon");
      if (complexSet.has(sentence)) types.push("complex");
      if (inclusiveSet.has(sentence)) types.push("inclusive");
      return types;
    };

    return text.split("\n").map((line): Line => {
      if (!line.trim()) return { blank: true, sentences: [] };
      return {
        blank: false,
        sentences: splitSentences(line).map((sentence) => ({
          sentence,
          types: classify(sentence),
        })),
      };
    });
  }, [text, results]);

  let spanIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-sm font-medium text-soft-white">
        Highlighted Analysis
      </h3>

      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Aggressive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          Jargon
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Complex
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Inclusive
        </span>
      </div>

      <div className="glass-surface rounded-xl p-4 leading-relaxed">
        {lines.map((line, lineIdx) => {
          if (line.blank) {
            return <div key={`blank-${lineIdx}`} className="h-4" aria-hidden />;
          }

          return (
            <p key={`line-${lineIdx}`} className="mb-1 last:mb-0">
              {line.sentences.map(({ sentence, types }) => {
                const idx = spanIndex++;
                const primaryType = types[0];

                return (
                  <Fragment key={idx}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.02, 1) }}
                      className={
                        primaryType
                          ? `inline rounded border px-1 ${COLORS[primaryType]}`
                          : "text-soft-white/80"
                      }
                      title={types.length ? types.join(", ") : undefined}
                    >
                      {sentence}
                    </motion.span>{" "}
                  </Fragment>
                );
              })}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
