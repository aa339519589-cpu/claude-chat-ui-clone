# Output Plan — Claude Web Chat UI (Mobile)

## Target
- **URL:** `https://claude.ai/new` (logged-in state)
- **Primary fidelity target:** MOBILE viewport **390×844** (user explicitly requires the mobile version, not desktop)
- Secondary viewports (1440×900 / 1280×800 / 1024×768) are sanity checks only: the layout must not break at wider widths (centered, max-width behavior). Pixel-accuracy bar applies to 390×844.

## Isolation
- **app-root:** `/Users/mima1234/.zcode/workspace/default/claude-chat-clone` (fresh template, untouched scaffold)
- **site-key:** `claude-ai-5502a6be` (sha256 of `https://claude.ai`, first 8 hex)
- **page-key:** `new-c84eba96` (pathname `/new`, sha256 first 8 hex)
- **artifact root:** `docs/research/claude-ai-5502a6be/new-c84eba96/`
- **screenshot root:** `docs/design-references/claude-ai-5502a6be/new-c84eba96/`
- **component root:** `src/components/sites/claude-ai-5502a6be/new-c84eba96/`
- **shared site components:** `src/components/sites/claude-ai-5502a6be/shared/`
- **asset root:** `public/sites/claude-ai-5502a6be/new-c84eba96/`
- **route:** `src/app/page.tsx` (first single-URL clone in an untouched template — scaffold replacement allowed per skill routing defaults)

## Existing routes inventory
- `src/app/page.tsx` — untouched template scaffold (Hello World). Approved for replacement by this clone.

## Shared foundation changes
- `src/app/layout.tsx` — fonts (Claude's real font stack), metadata
- `src/app/globals.css` — Claude design tokens (colors, radii, shadows)
- Both applied once, single-site app.

## Data layer decoupling (user requirement)
UI components must render from a typed data layer with clean interfaces so the user can later plug in:
- LLM API + streaming responses
- Conversation history persistence
- File upload
- TTS / STT

Mock data lives in `src/lib/mock/`, interfaces in `src/types/` and `src/hooks/`. No UI component may import mock data directly — all data flows via props/context from the data layer.

## Build discipline
- `npm run check` (lint + typecheck + build) must pass after foundation, after each merge, and at final assembly.
