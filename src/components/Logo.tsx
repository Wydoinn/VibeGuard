import { useId } from "react";

/**
 * VibeGuard mark: an abstract dual-swoosh "V" with an off-axis spark accent.
 * Deliberately not another shield/lock/bubble icon — reads as motion and
 * signal (checking the "vibe" of your writing) rather than a literal
 * privacy-app cliché.
 */
export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  const uid = useId();
  const strokeA = `vg-a-${uid}`;
  const strokeB = `vg-b-${uid}`;
  const dotFill = `vg-dot-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rear swoosh — softer, offset for depth */}
      <path
        d="M16 19 Q26 13 34 33 Q42 53 58 23"
        stroke={`url(#${strokeB})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />

      {/* Front swoosh — the primary V/check gesture */}
      <path
        d="M10 25 Q22 15 32 39 Q42 63 54 29"
        stroke={`url(#${strokeA})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Spark accent — breaks symmetry, gives it a signature */}
      <circle cx="55" cy="18" r="3.5" fill={`url(#${dotFill})`} />

      <defs>
        <linearGradient id={strokeA} x1="10" y1="25" x2="54" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id={strokeB} x1="16" y1="19" x2="58" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id={dotFill} x1="51.5" y1="14.5" x2="58.5" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
