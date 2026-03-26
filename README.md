# Velozity Project Tracker

A fully functional project management frontend built with React, TypeScript, and Tailwind CSS.

## Live Demo

> Deploy to Vercel: `vercel --prod` (after setup below)

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or pnpm

### Install & Run

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd project-tracker

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

App opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview   # local preview of production build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

---

## State Management Decision: Zustand

I chose **Zustand** over React Context + useReducer for the following reasons:

1. **No provider wrapping**: Zustand stores are module-level singletons. Any component can subscribe to slices of state without the component tree needing a Provider wrapper — this keeps `App.tsx` clean.
2. **Minimal boilerplate**: Context + useReducer requires defining action types, a reducer, and a provider. Zustand lets you define state and actions in one `create()` call.
3. **Selective re-renders**: Components only re-render when the specific slice of state they subscribe to changes. With Context, any change to the context value re-renders all consumers.
4. **DevTools support**: Zustand works with Redux DevTools out of the box via the `devtools` middleware — useful for debugging filter state and task mutations.
5. **Task size**: With 500+ tasks, the filtering logic runs on every keystroke/filter change. Zustand's atomic subscriptions prevent unnecessary re-computation in unrelated components.

---

## Virtual Scrolling Implementation

The list view handles 500+ rows without a library. The approach:

1. **Fixed row height** (52px) — all rows are the same height, which allows O(1) calculation of which rows are visible.
2. **Scroll position tracking** — a `onScroll` handler reads `scrollTop` from the container div on every scroll event, stored in local state.
3. **Window calculation** — given `scrollTop` and `containerHeight`, we calculate `startIndex` and `endIndex` of visible rows, plus a buffer of 5 rows above/below for smooth scrolling.
4. **Total height spacer** — the container div has `height = tasks.length * ROW_HEIGHT`, so the scrollbar reflects the true total. Only the visible slice of rows is in the DOM.
5. **translateY offset** — the rendered rows are shifted down by `startIndex * ROW_HEIGHT` using `transform: translateY(...)`, placing them at the correct visual position without absolute positioning each row.
6. **ResizeObserver** — container height is measured dynamically so the calculation stays correct if the window resizes.

Result: at any scroll position, only ~15–25 DOM nodes are rendered regardless of dataset size.

---

## Drag-and-Drop Implementation

Custom drag-and-drop using native HTML5 Drag Events — no libraries.

1. **`draggable` attribute** — task cards have `draggable={true}` and listen to `onDragStart`.
2. **Ghost element** — on drag start, we clone the card DOM node, position it off-screen (`top: -9999px`), and pass it to `dataTransfer.setDragImage()`. This gives us a styled ghost that follows the cursor with rotation and drop shadow.
3. **Placeholder** — the original card gets `opacity: 0.5`. A separate `div.drag-placeholder` (dashed border, same height) is inserted at the computed drop index inside the target column.
4. **Drop index calculation** — in `onDragOver`, we iterate over the column's card elements and find the first one whose vertical midpoint is below the cursor. This gives us the insertion index for the placeholder.
5. **Column highlighting** — `onDragOver` adds a CSS class that changes the column background to a subtle blue tint. `onDragLeave` removes it.
6. **Snap back** — if `onDragEnd` fires without a successful `onDrop` (e.g., dropped outside any column), we call cleanup() without calling `moveTask`, so the task stays in its original column.
7. **Data transfer** — the task ID is stored in `dataTransfer.setData('text/plain', taskId)` and retrieved on drop.

---

## Lighthouse Score

> Run `npm run build && npm run preview`, then open Chrome DevTools → Lighthouse → Desktop

Target: **85+ performance score**

Optimizations applied:
- Virtual scrolling prevents DOM bloat at 500+ rows
- Tailwind CSS purges unused styles at build time
- No heavy runtime libraries (no DnD lib, no virtual scroll lib, no UI kit)
- React 18 concurrent rendering
- Fonts loaded with `display=swap`

*(Add your Lighthouse screenshot here)*

---

## Explanation (150–250 words)

The hardest UI problem was implementing **drag-and-drop placeholder without layout shift**. When a card is picked up, the column's layout must stay stable — other cards shouldn't collapse into the gap. The solution was to keep the dragging card visible at reduced opacity (acting as a natural spacer) while simultaneously inserting a separate `div.drag-placeholder` with an explicit height equal to the measured card height at the computed drop index. The placeholder uses a dashed border and a transparent background, so it reads visually as a drop target rather than an empty slot. The drop index is recalculated on every `dragover` event by iterating over card bounding rects and finding the first card whose midpoint is below the cursor — this gives fluid reordering without any third-party logic.

If I had more time, I'd refactor the **collaboration simulation** into a proper `useReducer`-based state machine rather than the current `setInterval` approach. The current implementation occasionally produces flickering when multiple users move simultaneously, because React batches the state updates unpredictably. A reducer with explicit `MOVE_USER` actions and an immer-style draft would make the transitions deterministic and easier to animate with a proper spring physics library — without introducing layout jank.
