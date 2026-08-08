"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, X } from "lucide-react";
import type { HistoryEntry } from "@/lib/useAnalysisHistory";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function scoreColor(score: number): string {
  if (score >= 70) return "#16A34A";
  if (score >= 40) return "#D97706";
  return "#DC2626";
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function HistoryPanel({
  history,
  onSelect,
  onRemove,
  onClear,
  onClose,
}: HistoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card absolute right-0 top-full z-20 mt-2 w-full max-w-sm rounded-2xl p-4 sm:w-96"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-soft-white">
            Recent Analyses
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close history"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-soft-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          Your analyzed texts will appear here — stored only in this browser.
        </p>
      ) : (
        <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="group flex items-start gap-2 rounded-xl border border-black/5 bg-black/[0.02] p-3 transition-colors hover:border-electric/20 hover:bg-electric/[0.03]"
              >
                <button
                  onClick={() => onSelect(entry)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: scoreColor(entry.overallScore) }}
                    >
                      {entry.overallScore}
                    </span>
                    <p className="truncate text-xs font-medium text-soft-white">
                      {entry.excerpt || "(empty)"}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {entry.wordCount} words · {formatTime(entry.timestamp)}
                  </p>
                </button>
                <button
                  onClick={() => onRemove(entry.id)}
                  aria-label="Delete entry"
                  className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
