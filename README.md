<div align="center">

# VibeGuard

**The Privacy-First AI Writing Auditor** — analyze your writing for tone,
clarity, readability, and inclusivity, entirely in your browser.

[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

[Demo](https://github.com/user-attachments/assets/8132f168-ec15-4f2f-b078-4ed9d9beba9d)

</div>

## What It Does

Paste any text — a job post, an email, documentation, anything — and get
instant, AI-powered feedback on:

- **Tone & Empathy** — real DistilBERT sentiment analysis flags aggressive,
  cold, or unsupportive phrasing
- **Reading Level** — Flesch-Kincaid grade level and difficulty rating
- **Jargon Detection** — flags corporate buzzwords ("synergize," "circle
  back," "leverage") with plain-language alternatives
- **Inclusivity** — highlights exclusionary language and suggests more
  inclusive replacements
- **Highlighted Analysis** — see exactly which sentences triggered which
  flag, rendered in the same line/paragraph structure you pasted it in
- **History** — your last 20 analyses are saved locally so you can revisit
  or compare past audits (stored only in your browser, never synced anywhere)

All analysis — including the AI model — runs **100% locally in a Web
Worker**. No text, ever, is sent to a server.

## Why It's Actually Private

Most "AI writing tools" ship your text to a third-party API. VibeGuard
doesn't have a backend to send it to:

- The sentiment model (`Xenova/distilbert-base-uncased-finetuned-sst-2-english`)
  runs via [Transformers.js](https://huggingface.co/docs/transformers.js)
  + ONNX Runtime Web, downloaded once and cached by your browser
- Jargon, reading level, and inclusivity checks are pure client-side
  heuristics — no network call involved
- Analysis history persists in `localStorage`, not a database
- Open the Network tab while using it — there's nothing to see after the
  initial page/model load

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) / React 19 / TypeScript |
| Styling | Tailwind CSS v4, custom light/indigo design system, Framer Motion |
| AI | `@huggingface/transformers` (Transformers.js), DistilBERT (quantized, q8) |
| UI Kit | shadcn/ui primitives (Button, Card, Badge, Progress) |
| Icons | lucide-react |

## Project Structure

```
src/
├── ai/                     # In-browser AI model + Web Worker
│   ├── bertModel.ts         # DistilBERT sentiment inference
│   ├── modelLoader.ts       # Shared analysis result types
│   └── worker.ts            # Web Worker entry point — orchestrates all analyzers
├── analyzers/               # Pure heuristic analyzers (no ML)
│   ├── inclusivityAnalyzer.ts
│   ├── jargonDetector.ts
│   ├── readingLevel.ts      # Flesch-Kincaid grade level
│   ├── textProcessing.ts    # Sentence splitting, syllable/word counting
│   └── toneAnalyzer.ts      # Blends BERT sentiment with keyword heuristics
├── app/
│   ├── analyzer/page.tsx    # /analyzer — the main tool
│   └── page.tsx             # / — marketing landing page
├── components/
│   ├── AnalyzerPanel.tsx    # Text input, controls, results layout
│   ├── ResultsDashboard.tsx # Score cards + overall score ring
│   ├── HighlightViewer.tsx  # Sentence-level highlight rendering
│   ├── HistoryPanel.tsx     # Past-analyses dropdown (localStorage-backed)
│   ├── Hero.tsx, Navbar.tsx, Footer.tsx, ParticleBackground.tsx
│   └── sections/            # Landing page sections (Features, HowItWorks, etc.)
└── lib/
    └── useAnalysisHistory.ts # localStorage history hook
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The analyzer itself
lives at `/analyzer`.

### Build

```bash
npm run build
npm run start
```

> Note: `next/font` downloads Google Fonts (Plus Jakarta Sans, Cormorant
> Garamond) at build time. This requires normal internet access; if your
> build environment blocks `fonts.googleapis.com`, the app falls back to
> system fonts gracefully in dev, but a production build needs that access
> once to self-host the fonts.

### Lint & Type-check

```bash
npm run lint
npx tsc --noEmit
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter` — run analysis from the text input

## License

See [LICENSE](LICENSE).
