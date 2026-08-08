"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Users,
} from "lucide-react";
import type { AnalysisResult } from "@/ai/modelLoader";

interface ResultsDashboardProps {
  results: AnalysisResult;
}

function ScoreCard({
  icon: Icon,
  title,
  score,
  label,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  score: number;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-soft-white">{title}</h3>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="numeral text-3xl font-bold text-soft-white">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const { tone, jargon, readingLevel, inclusivity } = results;

  // Convert reading grade to a friendliness score (lower grade = better for general audience)
  const readingScore = Math.max(
    0,
    Math.min(100, Math.round((1 - readingLevel.gradeLevel / 18) * 100))
  );

  // Use the jargon score from the analyzer (density-based)
  const jargonScore = jargon.score ?? Math.max(0, 100 - jargon.count * 20);

  // Weighted overall score
  const overallScore = Math.round(
    tone.score * 0.25 +
      readingScore * 0.2 +
      jargonScore * 0.15 +
      inclusivity.score * 0.25 +
      Math.max(0, 100 - tone.aggressionScore) * 0.15
  );

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Overall Score
        </p>
        <div className="relative mx-auto mb-3 flex h-28 w-28 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(24,24,27,0.08)"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={
                overallScore >= 70
                  ? "#34D399"
                  : overallScore >= 40
                    ? "#FBBF24"
                    : "#F87171"
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 34 * (1 - overallScore / 100),
              }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <span className="numeral text-4xl font-bold text-soft-white">
            {overallScore}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {overallScore >= 80
            ? "Excellent — your writing is clear and inclusive!"
            : overallScore >= 60
              ? "Good — minor improvements suggested"
              : overallScore >= 40
                ? "Needs work — review the flagged items"
                : "Significant issues found — consider revising"}
        </p>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-semibold text-soft-white"
      >
        Analysis Results
      </motion.h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreCard
          icon={Shield}
          title="Tone Score"
          score={tone.score}
          label={tone.label.charAt(0).toUpperCase() + tone.label.slice(1)}
          color={tone.score >= 65 ? "#34D399" : tone.score >= 35 ? "#FBBF24" : "#F87171"}
          delay={0}
        />
        <ScoreCard
          icon={Heart}
          title="Empathy Score"
          score={tone.empathyScore}
          label={tone.empathyScore >= 50 ? "Supportive" : "Could improve"}
          color="#A78BFA"
          delay={0.1}
        />
        <ScoreCard
          icon={AlertTriangle}
          title="Aggression Risk"
          score={tone.aggressionScore}
          label={
            tone.aggressionScore <= 20
              ? "Low risk"
              : tone.aggressionScore <= 50
                ? "Moderate"
                : "High risk"
          }
          color={tone.aggressionScore <= 20 ? "#34D399" : tone.aggressionScore <= 50 ? "#FBBF24" : "#F87171"}
          delay={0.2}
        />
        <ScoreCard
          icon={BookOpen}
          title="Reading Level"
          score={readingScore}
          label={`Grade ${readingLevel.gradeLevel} · ${readingLevel.label}`}
          color={readingScore >= 60 ? "#34D399" : readingScore >= 40 ? "#FBBF24" : "#F87171"}
          delay={0.3}
        />
        <ScoreCard
          icon={MessageSquare}
          title="Jargon Count"
          score={jargonScore}
          label={`${jargon.count} term${jargon.count !== 1 ? "s" : ""} detected`}
          color={jargonScore >= 80 ? "#34D399" : jargonScore >= 50 ? "#FBBF24" : "#F87171"}
          delay={0.4}
        />
        <ScoreCard
          icon={Users}
          title="Inclusivity"
          score={inclusivity.score}
          label={
            inclusivity.score >= 70
              ? "Inclusive"
              : inclusivity.score >= 40
                ? "Needs work"
                : "Review needed"
          }
          color={inclusivity.score >= 70 ? "#34D399" : inclusivity.score >= 40 ? "#FBBF24" : "#F87171"}
          delay={0.5}
        />
      </div>

      {/* Flagged terms */}
      {inclusivity.flaggedTerms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="mb-3 text-sm font-medium text-soft-white">
            Suggested Replacements
          </h3>
          <div className="space-y-2">
            {inclusivity.flaggedTerms.map(({ term, suggestion }) => (
              <div
                key={term}
                className="flex items-center gap-2 text-sm"
              >
                <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-600 line-through">
                  {term}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="rounded bg-green-500/10 px-2 py-0.5 text-green-600">
                  {suggestion}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Detected jargon */}
      {jargon.detectedTerms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="mb-3 text-sm font-medium text-soft-white">
            Jargon Detected
          </h3>
          <div className="flex flex-wrap gap-2">
            {jargon.detectedTerms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-700"
              >
                {term}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
