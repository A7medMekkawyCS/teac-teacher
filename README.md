# Teac Teacher — refined mobile UI

Production-ready polish of the existing Figma Make prototype.
Identity (purple/blue brand `#4558F4` → `#7C3AED`) is unchanged.

## What changed

- Every screen is a **390 × 844** phone frame with iOS safe areas
- Prototype bar **Onboard / Login / Role / Student / Teacher / Profile** removed
- Real bottom nav only on Student Home, Teacher Home
- **Cairo** Arabic type: 28/20/16–18/15–16/12–14, buttons 16 SemiBold
- 8-point spacing, **24px** page padding
- Onboarding: illustration ~32% height, centered copy, **التالي** + **لدي حساب** above the home indicator
- Buttons 54px, full width, shared radius
- Scrollbars hidden

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Push back into Figma Make

Cursor cannot write into a Make file. To update the live Figma prototype:

1. Open the Make file
2. Switch to **Code**
3. Replace `src/App.tsx` with this project’s `src/App.tsx`
4. Replace `src/index.css` with this project’s `src/index.css`
