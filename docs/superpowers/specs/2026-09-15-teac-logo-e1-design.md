# Teac Teacher Logo (E1) — Design Spec

**Date:** 2026-09-15  
**Status:** Approved for implementation  
**Scope:** Replace the existing letter-T `LogoMark` with the E1 brand mark and place it on key screens only.

## Goal

Give Teac Teacher a distinctive, App Store–quality logo: a friendly robot rising from an open book with light rays — extracted from the user’s reference concept (AI emerging from knowledge) and adapted to the teal brand.

## Chosen mark

- **Variant:** E1 (robot + open book + light rays on teal rounded square)
- **Source file:** `assets/teac-logo-e1.png` (Cursor workspace assets) → ship as `public/brand/logo.png`
- **Brand colors stay:** `#2F9E8A` → `#0D9488` (existing `T.brand` / `T.ai`)
- **Do not** redesign unrelated UI, change brand palette, or add logo to every screen

## Components

### `LogoMark`

- Render the PNG via `<img src="/brand/logo.png" …>` (or equivalent Vite public path)
- Props unchanged in spirit: `size` (default 48), `light` (optional; on dark/gradient headers use a slight white ring / no extra filter unless needed)
- Remove the old SVG “T + sparkle” artwork
- Keep the component API so call sites stay simple

### `Wordmark`

- `LogoMark` + “TEAC” / “Teacher” text (existing typography: Plus Jakarta Sans)
- Same `size` / `light` props as today

## Placement (in scope)

| Screen | Treatment |
|--------|-----------|
| Splash | Large `LogoMark` (~80px), existing TEAC / TEACHER word stack |
| Onboarding | Small mark (~28px) in the top area (new; currently no logo) |
| Login | Existing `Wordmark` → uses new mark |
| Role select | Existing `Wordmark` → uses new mark |
| Student Home | Add compact light wordmark/mark in the gradient header |
| Teacher Home | Existing `Wordmark` → uses new mark |
| Parent Home | Add compact light wordmark/mark in the gradient header |

## Out of scope

- Favicon / PWA / Apple touch icons for all sizes
- Redesigning splash illustration art beyond swapping the mark
- Putting the logo on chat, profile, subscriptions, or every header
- Changing product name or tagline copy

## Implementation notes

1. Copy E1 PNG to `public/brand/logo.png` (and keep a copy under `public/brand/` if already present as `teac-logo-e1.png`, prefer canonical `logo.png`)
2. Update `LogoMark` / `Wordmark` in `src/App.tsx`
3. Wire Student Home + Parent Home + Onboarding placements
4. Smoke-check at ~28px, ~40px, and ~80px on light and gradient backgrounds

## Success criteria

- E1 is clearly visible on all seven placements above
- Old T-mark is gone from those surfaces
- No layout breakage on the 390×844 phone frame
- Logo remains readable at header size (~28–36px)

## Approval

- Visual direction: E1 (user selected)
- Placement set A: Splash, Onboarding, Login, Role, three Homes (user selected)
- Design lock: user confirmed 2026-09-15
