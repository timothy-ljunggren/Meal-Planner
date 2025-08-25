# Meal Planner – Plan • Cook • Enjoy

A modern, mobile‑first Progressive Web App (PWA) for planning weekly meals, curating a personal recipe collection, and generating an aggregated, category‑aware shopping list – all locally, instantly, and offline‑friendly. Built with React 19, React Router v7, Tailwind CSS, and a lightweight custom data model. No backend required.

---

## ✨ Why Meal Planner?

Busy week? Decision fatigue? Meal Planner turns “What should we cook?” into a 30‑second flow:
1. Add or browse recipes.
2. Auto‑generate a weekly plan prioritizing your liked meals.
3. Get a consolidated shopping list grouped by ingredient type.
4. Check off items while shopping – progress is persisted.

All data (recipes you add, preferences, weekly plan, checked items) lives in your browser via `localStorage`, so it’s private and lightning fast.

---

## 🚀 Core Features

| Category | Highlights |
|----------|------------|
| Recipes | Curated seed data + user‑created recipes via modal UI |
| Planner | Smart weekly generator with uniqueness + liked recipe prioritization |
| Shopping List | Aggregates duplicate ingredients, groups by type, progress bar |
| Offline / PWA | Installable, responsive, offline navigation fallback |
| UI / Styling | Tailwind CSS custom design tokens, soft glass & gradients |
| Persistence | `localStorage` for user recipes, plan, liked meals, list progress |
| DX | Clear modular components, simple extension model |

---

## 🧩 Architecture Overview

```
src/
  components/        Reusable UI building blocks
  pages/             Route-level views (Recipes, Plan, List)
  modals/            Overlay interactions (Add Recipe)
  data/              Static seed data (meals.json)
  index.js           App entry + SW registration
  App.js             Router + layout shell
  styles (Tailwind)  Design system via tailwind.config.js
public/
  manifest.json      PWA metadata (scoped to /dev/meal-planner/)
  service-worker.js  Runtime cache & offline logic (scoped variant)
```

### Key Files & Components
- App Shell: [`App`](src/App.js), [`index`](src/index.js), [`Layout`](src/components/Layout.js), [`Navbar`](src/components/Navbar.js)
- Pages: [`Recipes`](src/pages/Recipes.js), [`Plan`](src/pages/Plan.js), [`List`](src/pages/List.js)
- Core UI: [`MealGrid`](src/components/MealGrid.js), [`MealCard`](src/components/MealCard.js), [`FloatingAddButton`](src/components/FloatingAddButton.js), [`AddMealModal`](src/modals/AddMealModal.js)
- Data: [`meals.json`](src/data/meals.json)
- Styling System: [`tailwind.config.js`](tailwind.config.js), [`index.css`](src/index.css)
- PWA Layer: [`service-worker.js`](public/service-worker.js) + registration in [`index.js`](src/index.js)
- Utility / Perf: [`reportWebVitals`](src/reportWebVitals.js)

---

## 🧪 Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | React 19 (`createRoot` API) |
| Routing | React Router v7 (`<Router basename="/dev/meal-planner">`) |
| Styling | Tailwind CSS with custom tokens (primary, secondary, surface, semantic colors) |
| Icons | `lucide-react` (tree‑shakable icons) |
| Persistence | Browser `localStorage` (recipes, weeklyPlan, checkedItems, likedMeals) |
| PWA | Custom Service Worker + Web App Manifest |
| Build Tooling | CRA (React Scripts 5) |
| Animations | Tailwind keyframes (fade, bounce, pulse, scale) |

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
  cookTime: string          // e.g. "20 min"
  servings: string          // e.g. "2-3"
  difficulty: 1 | 2 | 3
  tags: string[]
  ingredients: Ingredient[]
}
```

User-created meals (from [`AddMealModal`](src/modals/AddMealModal.js)) are appended to the base dataset and stored in `localStorage.userMeals`.

---

## 🧠 Domain Logic Highlights

### Weekly Plan Generation
Defined inside [`Plan`](src/pages/Plan.js):
1. Collect available meals (seed + user).
2. Read liked meals from `localStorage.likedMeals` (if any).
3. For each weekday, attempt to assign an unused liked meal first.
4. Fallback: choose a random unused meal.
5. Persist structure `{ Monday: Meal, Tuesday: Meal, ... }` to `localStorage.weeklyPlan`.

### Shopping List Aggregation
Implemented by `processIngredients` inside [`List`](src/pages/List.js):
1. Flatten all ingredients from the current weekly plan.
2. Merge identical `(name + unit)` pairs by summing `amount`.
3. Group by `type` (ordered by a semantic priority array).
4. Render collapsible sections with persistent checkbox states stored in `localStorage.checkedItems`.

### Form Handling / Validation
[`AddMealModal`](src/modals/AddMealModal.js) ensures:
- At least one ingredient with valid numeric amount.
- Difficulty selection (1–3).
- Controlled inputs; reset on save or cancel.

### UI State & Persistence
| Key | Stored Under | Source |
|-----|--------------|--------|
| User Recipes | `userMeals` | Created via modal |
| Weekly Plan | `weeklyPlan` | Generated or manually adjusted |
| Shopping Progress | `checkedItems` | Toggle states per ingredient |
| Liked Meals (future hook) | `likedMeals` | (Placeholder usage in planner logic) |

---

## 📱 PWA & Offline Capability

- Manifest: [`public/manifest.json`](public/manifest.json) (scoped at `/dev/meal-planner/` for GitHub Pages / subpath deployment).
- Service Worker: [`public/service-worker.js`](public/service-worker.js) caches shell + static assets under `CACHE_NAME = 'meal-planner-v1'`.
- Registration: Performed in [`index.js`](src/index.js) with explicit scope:
  ```js
  navigator.serviceWorker.register('/dev/meal-planner/service-worker.js', { scope: '/dev/meal-planner/' })
  ```
- Offline Strategy:
  - Navigation requests: fallback to cached `index.html`.
  - Cache-first for same-origin, scoped asset requests.
- Install Prompt: `beforeinstallprompt` captured in [`App`](src/App.js) to allow future custom install UI.

---

## 🎨 Design System

Tailwind is extended in [`tailwind.config.js`](tailwind.config.js):
- Semantic palettes: `primary`, `secondary`, `surface`, `text`, `success`, `warning`, `error`.
- Custom animations (`fadeIn`, `bounceGentle`, `pulseSoft`, etc.).
- Utility-driven gradients (`bg-gradient-primary`, `text-gradient-secondary`, etc. in [`index.css`](src/index.css)).

---

## 🧭 Routing

Defined in [`App`](src/App.js) with `<Router basename="/dev/meal-planner">`:
| Path | View |
|------|------|
| `/recipes` | Recipe collection + search ([`Recipes`](src/pages/Recipes.js)) |
| `/plan` | Weekly planner ([`Plan`](src/pages/Plan.js)) |
| `/list` | Aggregated shopping list ([`List`](src/pages/List.js)) |
| `/` | Redirect → `/recipes` |

---

## 🔍 Search

Implemented in [`MealGrid`](src/components/MealGrid.js):
- Case-insensitive search over `meal.name` and `meal.tags`.
- Animated UI with focus states and debounce‑free instant filtering (sufficient for current data scale).

---

## ✅ Accessibility & UX Considerations

- Large tap targets on mobile (floating action button, bottom nav in [`Navbar`](src/components/Navbar.js)).
- High-contrast gradients and semantic coloring.
- Motion kept subtle; prefers short durations (200–800ms).
- Ingredient completion state reflected with crossed text + progress bar.

---

## 🛠️ Getting Started

### Prerequisites
- Node 18+ (recommended)
- npm 9+

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm start
```
Runs at `http://localhost:3000/dev/meal-planner` because of `homepage` + `basename`. If CRA auto-opens root, append `/dev/meal-planner`.

### Build Production
```bash
npm run build
```
Outputs to `build/` (ignored by Git). Artifacts reference scoped assets (important for subpath hosting).

### Preview Build Locally
Serve `build/` at a root that preserves the `/dev/meal-planner` path segment (e.g. using `serve`):
```bash
npx serve -s build
```

---

## 🌐 Deployment Notes

Because `package.json.homepage` = `/dev/meal-planner`:
- All asset URLs are generated relative to that subpath.
- If deploying at real root `/`, remove or adjust `homepage` and:
  - Update `<Router basename>` in [`App`](src/App.js).
  - Update SW registration scope & path in [`index.js`](src/index.js).
  - Modify `start_url` / `scope` in [`manifest.json`](public/manifest.json).

---

## 🧪 Testing

Basic CRA test harness:
- Jest + React Testing Library preconfigured.
- Sample test: [`App.test.js`](src/App.test.js).
Run:
```bash
npm test
```

(Enhancement suggestion: Add tests for planner logic & ingredient aggregation.)

---

## 🔧 Extending the App

| Goal | Where to Change |
|------|-----------------|
| Add nutrition fields | Update model in [`AddMealModal`](src/modals/AddMealModal.js) & rendering in [`MealCard`](src/components/MealCard.js) |
| Add liking/favoriting UI | Extend [`MealCard`](src/components/MealCard.js) + persist to `likedMeals` |
| Add export/import | Create utility (new file) to serialize `userMeals` + `weeklyPlan` |
| Multi-meal per day | Adjust `weeklyPlan` structure in [`Plan`](src/pages/Plan.js) and shopping aggregation logic in [`List`](src/pages/List.js) |
| Internationalization | Externalize strings from pages & components into a locale module |

---

## 🧹 Local Data Maintenance

Clear user data from DevTools console if needed:
```js
localStorage.removeItem('userMeals');
localStorage.removeItem('weeklyPlan');
localStorage.removeItem('checkedItems');
localStorage.removeItem('likedMeals');
```

---

## 🔐 Privacy

All data is stored locally (`localStorage`). No network calls (even though `axios` is listed as a dependency, it is currently unused – safe to remove if not needed).

---

## 🗺️ Roadmap Ideas

- Favorites toggle & weighting tuning
- Drag & drop reorder within the weekly plan
- Ingredient detail (notes, optional flags)
- Multi-list support (e.g. Pantry vs Fresh)
- Theme switching (dark mode via Tailwind `dark:` variants)
- Nutrition estimation (optional, client-only)
- Sharing / exporting a static plan snapshot

---

## 🤝 Contributing

1. Fork & clone
2. Create a feature branch
3. Keep components small & cohesive
4. Follow Tailwind utility patterns already established
5. Open a PR with a concise description & screenshots (if UI change)

---

## 📄 License

This project was bootstrapped with Create React App. All recipe data in [`meals.json`](src/data/meals.json) is sample/demo content. Provide attribution or replace with your own as needed.

---

## 🙌 Acknowledgments

- Icons: `lucide-react`
- Framework: React
- Styling Velocity: Tailwind
- Inspiration: Everyday frustration choosing dinner.

---

## 🔁 Quick Reference (Scripts)

| Script | Purpose |
|--------|---------|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Watch mode tests |
| `npm run eject` | (Irreversible) expose config |

---

Made with fresh components, semantic design tokens, and zero backend overhead.  
Plan smarter. Shop faster.