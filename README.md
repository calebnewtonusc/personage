![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-black?style=flat-square&logo=ollama&logoColor=white)
![SSE](https://img.shields.io/badge/Streaming_SSE-6366F1?style=flat-square&logo=lightning&logoColor=white)

# Personage: AI Formula Recommendation Engine

An AI-powered supplement formula recommendation tool built for [Personage](https://personage.com), a practitioner-focused platform where healthcare providers design fully personalized supplement formulas for their clients. Practitioners or consumers describe health goals or clinical context, and the engine returns structured, evidence-based formula recommendations with precise dosages and contraindication flags, streamed in real time.

> Screenshot

## Features

- **16 health categories** (Sleep, Energy, Inflammation, Immunity, Gut Health, Brain, Heart, Hormonal Balance, Athletic Performance, and more)
- **100+ evidence-backed ingredients:** every recommendation includes ingredient, dosage, mechanism of action, and clinical research rationale
- **Real-time streaming:** responses stream token by token via Server-Sent Events (SSE), with a live typing indicator
- **Practitioner and consumer modes:** works equally well for clinical notes ("patient has chronic fatigue, history of anxiety") or plain-language health goals
- **Clinical safety notes:** each formula includes contraindications, drug interaction flags, estimated daily cost, and suggested delivery format
- **Split-panel UI:** brand panel on desktop with feature summary; responsive single-column layout on mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS with Personage brand tokens (teal `#144b50`, peach `#ffbb99`) |
| Typography | Cormorant Garamond serif |
| AI | Ollama (local or cloud) via OpenAI-compatible API |
| Streaming | Server-Sent Events (SSE) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Ollama settings

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

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

> For educational purposes only, not a substitute for clinical judgment.

## About Personage

Personage enables healthcare providers (nutritionists, naturopathic doctors, functional medicine clinicians) to create fully personalized supplement formulas for each of their clients. Personage handles compounding, packaging, and direct-to-client shipping under the practitioner's brand.

## Author

**Caleb Newton** at [calebnewton.me](https://calebnewton.me)
