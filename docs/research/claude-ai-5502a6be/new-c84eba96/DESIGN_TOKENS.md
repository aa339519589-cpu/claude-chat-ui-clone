# Claude.ai Design Tokens — extracted from live site (dark theme)

Source: `getComputedStyle` + stylesheet `--var` scan of https://claude.ai (mobile viewport 390×844, dark color-scheme).
All values are resolved from the site's own CDS (Claude Design System) CSS custom properties. HSL triplets converted to hex.

## Fonts (official files downloaded to `public/sites/claude-ai-5502a6be/shared/fonts/`)

| Family | File | Weight range | Notes |
|---|---|---|---|
| `anthropic-sans` | anthropic-sans-variable.woff2 | 300–800 variable | UI font (`--font-sans`), body 16px |
| `anthropic-serif` | anthropic-serif-variable.woff2 | 300–800 variable | Assistant prose / serif displays |
| `anthropic-mono` | anthropic-mono-variable.woff2 | 300–800 variable | Code blocks |
| `Anthropicons-Variable` | anthropicons-variable.woff2 | 400–700 variable | Icon font used across the UI |

Italic variants also downloaded. Fallback stacks recorded verbatim from `--font-sans` / `--font-serif` / `--font-mono`.

## Semantic tokens (dark theme, resolved)

### Backgrounds
| Token | Value | Usage hint |
|---|---|---|
| `--bg-000` | #20201F (gray-800) | highest-level surface (page bg of login/chat) |
| `--bg-100` | #151515 (gray-850) | surface-1 |
| `--bg-200` | #111111 (gray-870) | surface-2 (inputs, nested panels) |
| `--bg-300` | #0D0D0D (gray-890) | surface-3 |
| `--bg-400`/`--bg-500` | #0B0B0B (gray-900) | deepest |

### Text
| Token | Value |
|---|---|
| `--text-000`/`--text-100` | #F7F8F6 (gray-20) — primary |
| `--text-200`/`--text-300` | #C3C2B7 (gray-200) — secondary |
| `--text-400`/`--text-500` | #97958D (gray-350) — muted |

### Borders
`--border-100..400` = #E1E0D9 (gray-100) — used at low opacity in dark theme (verify per-element alpha).

### Brand
| Token | Value |
|---|---|
| `--brand-000` (clay emphasized) | #C6613F |
| `--brand-100`/`--brand-200` (clay) | **#D97757** |
| `--accent-brand` | #D97757 |

### Accents
| Token | Value |
|---|---|
| `--accent-000` | #9EC5F4 |
| `--accent-100`/`200` | #5598E7 |
| `--accent-900` | #062B57 |
| `--accent-pro-000` | #BFB9F5 |
| `--accent-pro-100` | #9085E9 |
| `--accent-pro-200` | #8173E3 |
| `--accent-pro-900` | #271E60 |

### Status
| Token | 000 | 100/200 | 900 |
|---|---|---|---|
| danger | #F4ABAB | #E66767 / #E34948 | #511212 |
| success | #91D68B | #0CA30C | #0F350D |
| warning | #FAB219 | #C98500 | #412400 |

### Pictograms
`--pictogram-100..400` = #454442 / #383835 / #2C2C2A / #20201F

### Alpha ramp (built from neutral-900 per theme)
`--cds-alpha-0..9` = 0/5/10/20/35/50/60/70/85/95% alpha of the theme text color.

## Radii
- `--radius-sm` .25rem (4px), `--radius-md` .375rem (6px), `--radius-lg` .5rem (8px)
- Larger radii (composer, modals) to be measured per-element.

## Easing
- `--df-ease-out-cubic`: cubic-bezier(.215, .61, .355, 1)

## Observed page-level values
- body: 16px `anthropic-sans`, bg #20201F, text #F0EFEC (gray-50) on login page
- `html.cds-root.h-screen.antialiased.scroll-smooth`

> Per-element computed styles (sidebar, composer, messages, buttons, popovers) live in the component spec files under `components/`. Values there override this global reference.
