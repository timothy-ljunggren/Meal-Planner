# Meal Planner – Plan • Cook • Enjoy

A modern, mobile‑first Progressive Web App (PWA) for planning weekly meals, curating a personal recipe collection, and generating an aggregated, category‑aware shopping list – all locally, instantly, and offline‑friendly. Built with React 19, React Router v7, Tailwind CSS, and a lightweight custom data model. No backend required.

---

## 🚀 Executive Snapshot

| Dimension | Highlight |
|-----------|-----------|
| Product Value | Reduces decision fatigue; one‑click weekly meal plan + dynamic shopping list |
| Architecture | Pure client (React + Tailwind) with localStorage persistence & offline SW |
| Data Strategy | Deterministic merging of seed + user + preference layers |
| Algorithms | Weighted favorite-based random planner with uniqueness & variety balance |
| UX Focus | Mobile-first, installable PWA, semantic color system, animated micro‑interactions |
| Extensibility | Clean separation: pages (flows) vs components (UI primitives) vs data (seed) |

---

## ✨ Why Meal Planner?

Busy week? Decision fatigue? Meal Planner turns “What should we cook?” into a 30‑second flow:
1. Add or browse recipes.
2. Auto‑generate a weekly plan (weighted toward what you actually like).
3. Get a consolidated shopping list grouped by ingredient type.
4. Check off items while shopping – progress persists offline.

All data (recipes you add, preferences, weekly plan, checked items) lives in your browser via `localStorage`, so it’s private and instant.

---

## 🚀 Core Features

| Category | Highlights |
|----------|------------|
| Recipes | Curated seed data + user‑created recipes via modal UI |
| Planner | Weighted favorite algorithm (likes vs variety) + uniqueness per week |
| Shopping List | Aggregates & sums ingredients, grouped by category, progress bar |
| Offline / PWA | Installable, responsive, navigation fallback, icon set |
| UI / Styling | Tailwind design tokens, gradients, glass surfaces, subtle motion |
| Persistence | `localStorage` for all user state (no backend) |
| DX | Modular structure, intuitive extension points |

---

## 🧩 Architecture Overview

```
src/
  components/        UI primitives (cards, buttons, layout, nav)
  pages/             Route-level workflows (Recipes, Plan, List)
  modals/            Overlays (AddMealModal)
  data/              Seed dataset (meals.json)
  App.js             Router + layout shell
  index.js           Entry + service worker registration
  tailwind.config.js Design tokens / theme extensions
public/
  manifest.json      PWA metadata
  service-worker.js  Offline caching (scoped)
```

### Key Files & Components
- App Shell: [`App`](src/App.js), [`index`](src/index.js), [`Layout`](src/components/Layout.js), [`Navbar`](src/components/Navbar.js)
- Pages: [`Recipes`](src/pages/Recipes.js), [`Plan`](src/pages/Plan.js), [`List`](src/pages/List.js)
- Core UI: [`MealGrid`](src/components/MealGrid.js), [`MealCard`](src/components/MealCard.js), [`FloatingAddButton`](src/components/FloatingAddButton.js), [`AddMealModal`](src/modals/AddMealModal.js)
- Data: [`meals.json`](src/data/meals.json)
- Styling System: [`tailwind.config.js`](tailwind.config.js), [`index.css`](src/index.css)
- PWA Layer: [`service-worker.js`](public/service-worker.js) + registration in [`index.js`](src/index.js)
- Perf Utility: [`reportWebVitals`](src/reportWebVitals.js)

---

## 🧪 Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | React 19 (`createRoot`) |
| Routing | React Router v7 (`<Router basename="/dev/meal-planner">`) |
| Styling | Tailwind CSS (custom theme tokens + animations) |
| Icons | `lucide-react` |
| Persistence | Browser `localStorage` |
| PWA | Custom Service Worker + Web App Manifest |
| Build Tooling | CRA (react-scripts 5) |
| Animations | Tailwind + custom keyframes (fade, pulse, bounce, scale) |

---

## 🥘 Data Model

### Meal Object (see seed data in [`meals.json`](src/data/meals.json))
```ts
interface Ingredient {
  name: string
  amount: number
  unit: 'g' | 'ml' | 'Stück' | 'Scheiben' | 'Blätter'
  type: 'Obst & Gemüse' | 'Kühlung' | 'Trocken' | 'Tiefkühl' | 'Brot' | string
}

interface Meal {
  name: string
  emoji: string
  cookTime: string
  servings: string
  difficulty: 1 | 2 | 3
  tags: string[]
  ingredients: Ingredient[]
}
```

User-created meals (from [`AddMealModal`](src/modals/AddMealModal.js)) extend the base dataset and persist in `localStorage.userMeals`.

---

## 🧠 Domain Logic Highlights

### Weighted Weekly Plan Generation
Implemented in [`Plan`](src/pages/Plan.js):
- Data Sources: Seed meals + user meals (`userMeals`) merged into an available pool.
- Preferences Layer: Liked meals (`likedMeals`) influence selection.
- Algorithm (weekly batch):
  - For each day: 75% probability to pick from unused liked meals (if any), else from remaining pool for variety.
  - Guarantees no duplicate meal name in the same generated week (greedy uniqueness).
  - Fallback gracefully reuses liked meals if pool exhausted.
- Single-Day Change:
  - `getRandomUnusedMeal` uses a 70% probability weighting toward liked & unused meals.
- Persistence: Structure `{ Monday: Meal, ... }` saved to `localStorage.weeklyPlan`.

### Shopping List Aggregation
In [`List`](src/pages/List.js):
1. Flatten all meal ingredients from current plan.
2. Merge identical `(name + unit)` pairs by summing `amount`.
3. Group by `type` (ordered priority: produce → bread → chilled → dry → frozen → other).
4. Persist checkbox state in `localStorage.checkedItems`.
5. Progress bar reflects completion ratio.

### Like / Preference System
In [`MealCard`](src/components/MealCard.js):
- Toggles membership in `localStorage.likedMeals`.
- Plan logic weights selection using this evolving preference signal.

### Form Validation
[`AddMealModal`](src/modals/AddMealModal.js):
- Requires name + ≥1 ingredient with numeric amount.
- Controlled form resets after save/cancel.
- Preview panel summarizes recipe before commit.

### UI State & Persistence Map
| Key | Storage Key | Source |
|-----|-------------|--------|
| User Recipes | `userMeals` | Modal submissions |
| Weekly Plan | `weeklyPlan` | Weighted generator or manual edits |
| Liked Meals | `likedMeals` | Meal card heart toggle |
| Shopping Progress | `checkedItems` | List check toggles |

---

## 📱 PWA & Offline Capability

- Manifest: [`public/manifest.json`](public/manifest.json) scoped to `/dev/meal-planner/`.
- Service Worker: [`public/service-worker.js`](public/service-worker.js) caches shell + static assets (`CACHE_NAME = 'meal-planner-v1'`).
- Registration: In [`index.js`](src/index.js) with explicit `scope`.
- Strategy:
  - Navigation fallback → cached `index.html`.
  - Cache-first for same-origin, scoped assets.
  - Seamless offline browsing of previously loaded UI.

---

## 🎨 Design System

Tailwind extension in [`tailwind.config.js`](tailwind.config.js):
- Semantic color families: `primary`, `secondary`, `surface`, `text`, status palettes.
- Custom shadows (soft, glow), spacing, radii, animation keyframes.
- Utility “tokens” consumed via semantic classnames in components.
Additional utilities & gradients in [`index.css`](src/index.css).

---

## 🧭 Routing

Declared in [`App`](src/App.js):
| Path | View |
|------|------|
| `/recipes` | Recipe collection + search ([`Recipes`](src/pages/Recipes.js)) |
| `/plan` | Weekly planner ([`Plan`](src/pages/Plan.js)) |
| `/list` | Aggregated shopping list ([`List`](src/pages/List.js)) |
| `/` | Redirect → `/recipes` |

---

## 🔍 Search

[`MealGrid`](src/components/MealGrid.js):
- Instant (no debounce needed at current scale).
- Matches `name` or any tag (case-insensitive).
- Animated empty & result states.

---

## ✅ Accessibility & UX

- Large mobile targets (floating action button, bottom nav).
- High contrast semantic colors.
- Motion subtle; durations ≤ 800ms.
- Progress & state feedback (planning overlay, list completion).

---

## 🛠️ Getting Started

Prerequisites:
```
Node 18+
npm 9+
```

Install:
```bash
npm install
```

Dev:
```bash
npm start
```
Open: `http://localhost:3000/dev/meal-planner`

Build:
```bash
npm run build
```

Preview:
```bash
npx serve -s build
```

---

## 🌐 Deployment Notes

If deploying at root `/` instead of `/dev/meal-planner`:
1. Remove/adjust `"homepage"` in [`package.json`](package.json).
2. Change `<Router basename>` in [`App`](src/App.js).
3. Update SW registration path in [`index.js`](src/index.js).
4. Adjust `start_url`, `scope` in [`public/manifest.json`](public/manifest.json).
5. (Optional) Simplify service worker `BASE_PATH`.

---

## 🧪 Testing

CRA default harness (Jest + RTL):
```bash
npm test
```
Example: [`App.test.js`](src/App.test.js).

Suggested future tests:
- Weighted selection distribution (stochastic properties).
- Ingredient aggregation merging logic.
- Persistence round‑trip (plan → list → reload).

---

## 🔧 Extending the App

| Goal | Change Points |
|------|---------------|
| Nutrition data | Extend model in [`AddMealModal`](src/modals/AddMealModal.js) + render in [`MealCard`](src/components/MealCard.js) |
| Adaptive weighting | Adjust probabilities in [`Plan`](src/pages/Plan.js) (e.g. dynamic based on recency) |
| Export / import | New utility to serialize all `localStorage` keys |
| Multi meals/day | Change `weeklyPlan` value → array; update planner + list aggregation |
| i18n | Externalize literals into a locale map |
| Dark mode | Add `dark:` theme tokens + toggle persisted in storage |

---

## 🧹 Local Data Maintenance

```js
localStorage.removeItem('userMeals');
localStorage.removeItem('weeklyPlan');
localStorage.removeItem('checkedItems');
localStorage.removeItem('likedMeals');
```

---

## 🔐 Privacy

All data stays local (`localStorage`). No network requests. `axios` dependency currently unused (removable optimization).

---

## 🗺️ Roadmap Ideas

- Fine-tune adaptive favorite weighting (decay or frequency-based)
- Drag & drop day reordering
- Ingredient metadata (notes / optional flag)
- Pantry tracking & stock subtraction
- Dark mode theme
- Nutrition estimation (client-only)
- Share/export static plan snapshot
- Install prompt UI enhancement (custom CTA using stored `beforeinstallprompt` event)

---

## 🤝 Contributing

1. Fork & clone
2. Feature branch
3. Keep components cohesive & focused
4. Follow existing Tailwind utility style
5. PR with concise description + screenshots for UI changes

---

## 📄 License

Bootstrapped with Create React App. Seed recipe data is demo content; replace or adapt freely.

---

## 🙌 Acknowledgments

- Icons: `lucide-react`
- Framework: React
- Styling: Tailwind
- Inspiration: Everyday friction choosing dinner.

---

## 🔁 Quick Reference

| Script | Purpose |
|--------|---------|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Watch tests |
| `npm run eject` | Expose config |

---

Made with semantic design tokens, probabilistic planning logic, and zero backend overhead.  
Plan smarter.