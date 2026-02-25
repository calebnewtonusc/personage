# Personage — AI Formula Recommendation Engine

An AI-powered supplement formula recommendation tool built for [Personage](https://personage.com) — a practitioner-focused platform where healthcare providers design fully personalized supplement formulas for their clients.

Practitioners (or consumers) input health goals, symptoms, or clinical context, and the engine returns a structured formula recommendation with:

- **Specific ingredients** (e.g., Magnesium Glycinate, Ashwagandha KSM-66, L-Theanine)
- **Precise dosages** for each ingredient
- **Evidence-based rationale** per ingredient, grounded in mechanism of action and clinical research
- **Clinical notes** including contraindications and drug interaction flags

---

## Demo

> "My patient has chronic fatigue and poor sleep. History of anxiety. No current medications."

**AI Response:**

> ## Recommended Formula: Sleep & Stress Recovery
>
> ### Ashwagandha KSM-66 — 600mg
> **Evidence:** Multiple RCTs demonstrate KSM-66 reduces serum cortisol by ~28% and improves sleep quality scores. Acts as an adaptogen via HPA axis modulation.
>
> ### Magnesium Glycinate — 400mg
> **Evidence:** Glycinate form offers superior bioavailability with minimal GI side effects. Magnesium deficiency is associated with insomnia and heightened stress reactivity.
>
> ### L-Theanine — 200mg
> **Evidence:** Promotes alpha-wave activity and GABA upregulation. Reduces anxiety without sedation; synergistic with magnesium.
>
> ---
> **Estimated cost:** $1.98–$2.20/day | **Suggested format:** Capsules
> **Clinical note:** Well-tolerated profile. Monitor if patient initiates thyroid medication (ashwagandha may affect TSH).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS with Personage brand tokens |
| AI | Ollama (local or cloud) via OpenAI-compatible API |
| Streaming | Server-Sent Events (SSE) for real-time responses |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure your API key
cp .env.local.example .env.local
# Edit .env.local and add your Ollama config

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Configuration

```env
# Ollama cloud
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gemma3:4b
OLLAMA_API_KEY=your_key_here

# Or local Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_API_KEY=
```

---

## Features

- **16 health categories** — Sleep, Energy, Inflammation, Immunity, Gut Health, Brain, Heart, Hormonal Balance, Athletic Performance, and more
- **100+ evidence-backed ingredients** with clinical dosing ranges
- **Structured output** — every recommendation follows a consistent format: ingredient → dosage → evidence → clinical note
- **Real-time streaming** — responses stream token by token via SSE
- **Practitioner + consumer modes** — works for clinical notes or plain-language health goals
- **Responsive UI** — split-panel layout on desktop, single-column on mobile
- **Personage brand design** — teal (#144b50), peach (#ffbb99), Cormorant serif

---

## Project Structure

```
personage/
├── app/
│   ├── page.tsx              # Home: brand panel + chat layout
│   ├── layout.tsx            # Root layout with fonts + metadata
│   ├── globals.css           # Tailwind base imports
│   └── api/chat/route.ts     # Streaming AI endpoint (Ollama)
├── components/
│   ├── ChatInterface.tsx     # Welcome screen + message thread + streaming
│   ├── ChatInput.tsx         # Auto-expanding textarea input
│   └── ChatMessage.tsx       # Message rendering with markdown parsing
├── lib/
│   ├── system-prompt.ts      # Practitioner-grade AI system prompt
│   └── products.ts           # Pre-built supplement formula library
└── types/index.ts            # Message + Supplement TypeScript interfaces
```

---

## About Personage

Personage is a practitioner-focused platform that enables healthcare providers — nutritionists, naturopathic doctors, functional medicine clinicians — to create fully personalized supplement formulas for each of their clients. Practitioners design formulas using their own clinical judgment, and Personage handles compounding, packaging, and direct-to-client shipping under the practitioner's brand.

This project was built as a demonstration of the AI Formula Recommendation Engine concept described in the Personage project brief.
