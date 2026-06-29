# Interactive Textbook Implementation Plan

**Status:** Planned (vertical slice in progress)
**Created:** 2026-06-29

## TL;DR
Replace the essay-based `/learn` page with a linear, action-driven "interactive textbook": short prose chapters interleaved with embedded sandboxes that mount the *real* visualizer, each with a one-click handoff into the open explorer. This plan covers the first vertical slice — the `<Sandbox>` atom + Chapter 1 ("Words become points") live at `/learn` — so the format can be judged before the remaining chapters are written.

## Critical Decisions
- **Sandbox mounts the real `VectorGraph`, not a mock** — `MiniVisualizer` is a canvas mock with hardcoded fake coords; throwaway. `VectorGraph` renders standalone from just `words` (it fetches its own PCA coords from `/api/getVectorCoordinates`), so the sandbox shows the authentic engine.
- **Fresh single-column renderer, not the essay scroll/diagram system** — `ScrollContext`/`ParagraphObserver`/`DiagramComponent` drive a sticky-sidebar diagram model. An action-driven textbook wants prose and sandboxes inline in one reading flow, which is simpler and a better fit. The essay system is left untouched (and unrouted).
- **Chapters are data, not JSX** — a chapter is an ordered list of typed blocks (`prose` | `sandbox`). Prose renders via the existing `react-markdown` + `remark-math` + `rehype-katex` stack. New chapters = new data + presets, no component changes.
- **`/learn` becomes the textbook** — repoint the route. Old `LearnPage` + `essayContent1/2/3.js` stay on disk as raw material to mine for later chapters; deleted in a later pass once chapters 2–7 exist.
- **Handoff via router state** — `navigate('/app', { state: { words } })`; `HomePage` seeds its `words` from `location.state` on mount.
- **Linear** — chapter registry is an ordered array; prev/next nav. Audience tracks/branching deferred.

## Tasks

**Overall Progress:** 0%

- [ ] **Step 1: Chapter content model + Chapter 1**
  - [ ] `src/data/textbook/chapters.js` — ordered registry + `getChapter(slug)`
  - [ ] Chapter 1 "Words become points" blocks (prose + 1 sandbox), short and action-driven
- [ ] **Step 2: `<Sandbox>` component**
  - [ ] Mount real `VectorGraph` scoped to a fixed-height container, preset `words`
  - [ ] "+ word" buttons (from chapter `addable`) and "Open in explorer →" handoff
- [ ] **Step 3: `<Textbook>` page + block renderer**
  - [ ] Route param `:chapter` (default first), render title + blocks, prev/next + back-to-explorer
  - [ ] Prose block → ReactMarkdown (math support)
- [ ] **Step 4: Wiring**
  - [ ] `App.jsx` — `/learn` and `/learn/:chapter` → `<Textbook>`; drop `LearnPage` route
  - [ ] `HomePage.jsx` — seed `words` from `location.state.words` on mount
- [ ] **Step 5: Verify** — lint, build, manual smoke (load `/learn`, add word, handoff)

## Relevant Files
- `src/App.jsx` - repoint `/learn` to `<Textbook>`, add `/learn/:chapter`
- `src/components/HomePage.jsx` - seed `words` from router state (handoff target)
- `src/data/textbook/chapters.js` - NEW: chapter registry + Chapter 1 content
- `src/components/textbook/Sandbox.jsx` - NEW: scoped real `VectorGraph` + controls + handoff
- `src/components/textbook/Textbook.jsx` - NEW: page shell + block renderer
- `src/components/VectorGraph.jsx` - reused as-is (no change)

## Testing Plan
- [ ] `/learn` renders Chapter 1; prose + sandbox visible
- [ ] Sandbox plots preset words via the real API; "+ truck" adds and re-plots
- [ ] "Open in explorer →" lands on `/app` with the same words loaded
- [ ] `npm run lint` (0 errors) and `npm run build` pass

## Rollback Plan
New files are additive. The only edits are `App.jsx` (route swap) and `HomePage.jsx` (additive mount effect). Reverting the route back to `<LearnPage />` and removing the `HomePage` effect restores the prior essay experience; the essay files were never deleted.
