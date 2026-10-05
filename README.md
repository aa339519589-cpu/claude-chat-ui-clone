# Claude Chat UI Clone

A high-fidelity, mobile-first recreation of the Claude web chat interface, built with **Next.js 16 + React 19 + Tailwind CSS v4** for front-end learning purposes.

> **Disclaimer:** This is an educational UI exercise only. It is **not affiliated with, endorsed by, or connected to Anthropic** in any way. "Claude" and all related trademarks belong to Anthropic PBC. Do not use this project to impersonate Claude or Anthropic.

## What's inside

- **Pixel-accurate mobile layout (390×844)** — 48px top bar, full-width sidebar drawer, serif greeting, auto-growing composer, disclaimer chin row
- **Decoupled data layer** — all UI renders through a single `ChatProvider` interface (`src/lib/chat/types.ts`); swap `src/lib/chat/mock-provider.ts` for your own backend to wire up:
  - LLM API + streaming responses
  - Conversation history persistence
  - File upload
  - TTS / STT hooks
- **Mock streaming** included so the UI is fully interactive out of the box

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run check    # lint + typecheck + production build
```

## Wiring your own backend

Implement the `ChatProvider` interface in `src/lib/chat/types.ts`:

```ts
export interface ChatProvider {
  getUser(): Promise<User>;
  listModels(): Promise<Model[]>;
  listConversations(): Promise<Conversation[]>;
  createConversation(title?: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  sendMessage(opts: {
    conversationId: string;
    content: string;
    model: Model;
    signal?: AbortSignal;
  }): AsyncIterable<StreamEvent>;
  transcribe?(audio: Blob): Promise<string>;
  speak?(text: string): Promise<Blob>;
}
```

Then pass your provider to `useChat(yourProvider)` in `src/app/page.tsx`. No component changes required.

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict
- Tailwind CSS v4 with extracted design tokens
- Custom variable fonts served locally
