# Momentum

A keyboard-first issue tracker (Linear-style), built front-end only with React.
Landing page, authentication, a drag-and-drop board, a grouped list view, an
issue detail drawer, and a command palette — all running in the browser with
data in `localStorage`. Light and dark themes throughout.

## Stack

- React 18 + Vite
- React Router 6
- `useReducer` + Context for issue state, hand-written CSS (no UI kit)
- `localStorage` for auth and issues (no backend)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5174.

## Demo login

```
email:    demo@momentum.dev
password: momentum
```

Or create an account on the Sign up page — accounts are stored locally.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `C` | Create a new issue |
| `⌘/Ctrl + K` | Open the command palette |
| `/` | Focus search |
| `↑` `↓` | Navigate the palette |
| `↵` | Open / run selection |
| `Esc` | Close dialogs |

## What's inside

- **Landing** — hero with a live board preview, keyboard section, features
- **Auth** — sign up / log in with validation, password strength, protected routes
- **Board** — drag issues across Backlog → Todo → In Progress → Done → Canceled
- **List** — grouped, collapsible, with inline status & priority pickers
- **Views** — My issues, Active, All, Backlog
- **Command palette** — fuzzy search over issues + quick actions, keyboard nav
- **Issue drawer** — editable title/description, sub-task checklist, comments, activity log, status/priority/assignee/label pickers
- **Filters** — by priority, assignee, label across every view
- **Settings** — theme, shortcut reference, reset demo data
- Toasts, Esc-dismiss dialogs, responsive to mobile

## Structure

```
src/
  context/     theme, toast, auth, and the useReducer issue store
  hooks/       useLocalStorage, useHotkeys, useInView
  components/  Icon, Glyphs (status/priority), Menu, Pickers, FilterBar,
               CommandPalette, CreateIssue, IssueDrawer, Modal, ...
  layouts/     AppLayout (sidebar + topbar + orchestration)
  pages/       Landing, Login, Signup, BoardView, ListView, SettingsView
  utils/       format.js (lookups, fuzzy search, time)
  data/        seed.js
```
