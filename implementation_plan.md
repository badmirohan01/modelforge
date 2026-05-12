# ModelForge Frontend — Implementation Plan

> [!IMPORTANT]
> This plan follows the handoff document **exactly**. Every file, every interface, every query key is specified. We proceed **phase by phase** — nothing gets skipped.

---

## Codebase Audit Summary

| File | Current State | Action |
|---|---|---|
| `types/index.ts` | ❌ Empty | **Create** — all 5 interfaces |
| `store/authStore.ts` | ⚠️ Exists but wrong shape | **Rewrite** — flat token/email fields, add js-cookie, remove zustand persist (use manual localStorage) |
| `services/api.ts` | ⚠️ In `lib/api.ts` | **Move** to `services/api.ts`, update token read to match new store shape |
| `services/auth.service.ts` | ❌ Missing (`lib/auth.ts` is empty) | **Create** |
| `services/model.service.ts` | ❌ Missing | **Create** |
| `services/inference.service.ts` | ❌ Missing | **Create** |
| `services/apikey.service.ts` | ❌ Missing | **Create** |
| `hooks/useAuth.ts` | ❌ Empty | **Create** — useLogin, useRegister |
| `hooks/useModels.ts` | ❌ Empty | **Create** — useModels, useUploadModel |
| `hooks/useModelDetail.ts` | ❌ Missing | **Create** |
| `hooks/useInference.ts` | ❌ Empty (wrong name) | **Delete**, logic goes into useModelDetail |
| `hooks/useLogs.ts` | ❌ Missing | **Create** (or merge into useModelDetail) |
| `app/layout.tsx` | ⚠️ Exists, missing QueryClientProvider | **Modify** — add Providers.tsx wrapper |
| `middleware.ts` | ⚠️ Exists, cookie logic commented out | **Rewrite** — activate cookie-based protection |
| `app/(auth)/layout.tsx` | ❌ Missing | **Create** — centered layout, no sidebar |
| `app/(auth)/login/page.tsx` | ❓ Exists (unverified) | **Rewrite** to spec |
| `app/(auth)/register/page.tsx` | ❓ Exists (unverified) | **Rewrite** to spec |
| `app/(dashboard)/layout.tsx` | ✅ Exists, working | **Minor tweaks** — nav hrefs, mobile hamburger |
| `app/(dashboard)/dashboard/page.tsx` | ⚠️ Exists, hardcoded data | **Rewrite** — use hooks, extract StatsCards |
| `components/dashboard/StatsCards.tsx` | ❌ Missing | **Create** |
| `components/dashboard/UploadModal.tsx` | ❌ Empty (`upload-model.tsx`) | **Create** at correct filename |
| `app/(dashboard)/models/page.tsx` | ❌ Empty | **Create** — model list + ModelCard |
| `components/dashboard/ModelCard.tsx` | ❌ Empty (`model-card.tsx`) | **Create** at correct filename |
| `app/(dashboard)/models/[modelId]/page.tsx` | ❌ Empty | **Create** |
| `components/dashboard/InferenceConsole.tsx` | ❌ Empty | **Create** |
| `components/dashboard/ApiKeyCard.tsx` | ❌ Missing (`api-key-card.tsx` empty) | **Create** at correct filename |
| `components/dashboard/LogsTable.tsx` | ❌ Missing (`logs-table.tsx` empty) | **Create** at correct filename |
| `components/dashboard/Sidebar.tsx` | ❌ Empty | **Create** (or keep inline in dashboard layout) |
| `app/(marketing)/layout.tsx` | ❌ Missing | **Create** |
| `components/marketing/*` | ❌ Missing | **Create** — Navbar, Hero, HowItWorks, Features, Footer |

### Dependencies to Install
```
npm install js-cookie @types/js-cookie date-fns
```
Already present: `@tanstack/react-query`, `axios`, `zustand`, `sonner`, `lucide-react`, `framer-motion`, shadcn

---

## Phase 1 — Foundation

> [!NOTE]
> Zero UI work. This phase builds every type, service, hook, provider, and middleware so that all subsequent phases can just import and use.

### Step 1.1 — `src/types/index.ts`
**Action:** Write all 5 interfaces

```typescript
export interface AuthResponse {
  token: string;
  email: string;
  message: string;
}

export interface ModelResponse {
  id: string;
  name: string;
  description: string;
  inputSchema: string;
  isPublic: boolean;
  createdAt: string;
  latestVersion: number;
  latestVersionId: string;
  inferEndpoint: string;
  totalCalls: number;
  avgLatencyMs: number;
}

export interface ModelUploadResponse {
  id: string;
  name: string;
  message: string;
}

export interface InferResponse {
  prediction: number | string;
  probabilities: number[] | null;
  latencyMs: number;
  modelId: string;
}

export interface InferenceLogResponse {
  id: number;
  modelId: string;
  versionId: string;
  versionNumber: number;
  status: 'SUCCESS' | 'FAILED';
  latencyMs: number;
  errorMessage: string | null;
  calledAt: string;
}

export interface ApiKeyResponse {
  id: string;
  modelId: string;
  label: string;
  rawKey: string | null;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}
```

**Rule enforced:** No inline types anywhere else in the app.

---

### Step 1.2 — `src/store/authStore.ts`
**Action:** Rewrite to flat shape with js-cookie

```typescript
interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}
```

Implementation details:
- `login()` → set state + `localStorage.setItem('token', token)` + `Cookies.set('token', token)`
- `logout()` → clear state + `localStorage.removeItem('token')` + `Cookies.remove('token')`
- On store creation → hydrate `token` and `email` from `localStorage` so state persists across refreshes
- **No zustand/persist middleware** — manual localStorage for full control over cookie sync

---

### Step 1.3 — `src/services/api.ts`
**Action:** Move from `lib/api.ts` → `services/api.ts`, update import path

- `baseURL` from `process.env.NEXT_PUBLIC_API_URL`
- Default header `Content-Type: application/json`
- **Request interceptor:** read `useAuthStore.getState().token` (new flat shape, not `.user?.token`)
- **Response interceptor:** on 401 → `useAuthStore.getState().logout()` then `window.location.href = '/login'`
- Delete old `lib/api.ts` and `lib/auth.ts`

---

### Step 1.4 — Service Files (4 files)

#### `src/services/auth.service.ts`
| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `register(email, password)` | POST | `/api/auth/register` | `AuthResponse` |
| `login(email, password)` | POST | `/api/auth/login` | `AuthResponse` |

#### `src/services/model.service.ts`
| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `getModels()` | GET | `/api/models` | `ModelResponse[]` |
| `getModel(modelId)` | GET | `/api/models/{id}` | `ModelResponse` |
| `uploadModel(formData)` | POST | `/api/models/upload` | `ModelUploadResponse` |

> [!WARNING]
> `uploadModel` sends `FormData` — do NOT set `Content-Type` header (let browser set multipart boundary).

#### `src/services/inference.service.ts`
| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `infer(modelId, inputs, proba)` | POST | `/api/models/{id}/infer` | `InferResponse` |
| `getLogs(modelId, page, size)` | GET | `/api/models/{id}/logs?page={page}&size={size}` | `InferenceLogResponse[]` |

#### `src/services/apikey.service.ts`
| Function | Method | Endpoint | Returns |
|---|---|---|---|
| `generateKey(modelId, label)` | POST | `/api/models/{id}/keys?label={label}` | `ApiKeyResponse` (with rawKey) |
| `getKeys(modelId)` | GET | `/api/models/{id}/keys` | `ApiKeyResponse[]` (rawKey null) |
| `revokeKey(modelId, keyId)` | DELETE | `/api/models/{id}/keys/{keyId}` | `void` (204) |

---

### Step 1.5 — Hook Files (4 files)

All hooks use **React Query**. Import from services only, never `api.ts`.

#### `src/hooks/useAuth.ts`
- `useLogin()` → `useMutation` calling `authService.login`
  - onSuccess: `authStore.login(token, email)` → `router.push('/dashboard')`
  - onError: return `error.response.data.message`
  - Returns: `{ mutate, isPending, error }`
- `useRegister()` → `useMutation` calling `authService.register`
  - Same success/error pattern
  - Returns: `{ mutate, isPending, error }`

#### `src/hooks/useModels.ts`
- `useModels()` → `useQuery` with key `['models']`
  - queryFn: `modelService.getModels`
  - Returns: `{ data: ModelResponse[], isLoading, error }`
- `useUploadModel()` → `useMutation` calling `modelService.uploadModel`
  - onSuccess: `queryClient.invalidateQueries({ queryKey: ['models'] })` + toast
  - Returns: `{ mutate, isPending, error }`

#### `src/hooks/useModelDetail.ts`
- `useModelDetail(modelId)` → combines:
  - `useQuery(['model', modelId])` → `modelService.getModel(modelId)`
  - `useQuery(['keys', modelId])` → `apikeyService.getKeys(modelId)`
  - `useQuery(['logs', modelId, page])` → `inferenceService.getLogs(modelId, page, 20)`
  - `useMutation` for `infer` → onSuccess invalidate `['logs', modelId, 0]`
  - `useMutation` for `generateKey` → onSuccess invalidate `['keys', modelId]`
  - `useMutation` for `revokeKey` → onSuccess invalidate `['keys', modelId]`
- Returns: `{ model, keys, logs, infer, generateKey, revokeKey, isLoading }`
- Page state for logs pagination lives inside this hook

#### `src/hooks/useLogs.ts`
- If needed separately for the `/logs` page, otherwise merged into `useModelDetail`
- Uses key `['logs', modelId, page]`

---

### Step 1.6 — `src/app/layout.tsx` + `src/components/Providers.tsx`
**Action:** Create a `Providers.tsx` ("use client") that wraps children in `QueryClientProvider`. Root layout imports and wraps.

```
Providers.tsx:
- "use client"
- Create QueryClient ONCE (outside component or via useState)
- Wrap children in <QueryClientProvider>
```

Root layout:
- Keep existing fonts (Inter, JetBrains Mono, Plus Jakarta Sans)
- Keep Toaster from sonner
- Wrap `{children}` in `<Providers>`

> [!CAUTION]
> Never instantiate QueryClient inside a component. Only in Providers.tsx.

---

### Step 1.7 — `src/middleware.ts`
**Action:** Rewrite — uncomment and activate cookie logic

- Read cookie named `"token"` via `request.cookies.get('token')`
- If path starts with `/dashboard` or `/models` and no token cookie → redirect to `/login`
- If path is `/login` or `/register` and token cookie exists → redirect to `/dashboard`
- Add `/login` and `/register` to matcher config

---

### Phase 1 Checklist
- [ ] Install `js-cookie`, `@types/js-cookie`, `date-fns`
- [ ] `types/index.ts` — 6 interfaces
- [ ] `store/authStore.ts` — rewrite with js-cookie
- [ ] `services/api.ts` — move from lib, update store import
- [ ] `services/auth.service.ts`
- [ ] `services/model.service.ts`
- [ ] `services/inference.service.ts`
- [ ] `services/apikey.service.ts`
- [ ] `hooks/useAuth.ts` — useLogin, useRegister
- [ ] `hooks/useModels.ts` — useModels, useUploadModel
- [ ] `hooks/useModelDetail.ts` — composite hook
- [ ] `components/Providers.tsx` — QueryClientProvider
- [ ] `app/layout.tsx` — wrap in Providers
- [ ] `middleware.ts` — activate cookie protection
- [ ] Delete `lib/api.ts`, `lib/auth.ts`
- [ ] Delete `hooks/useInference.ts` (logic merged into useModelDetail)
- [ ] Update all existing imports from `@/lib/api` → `@/services/api`

---

## Phase 2 — Auth + Dashboard

### Step 2.1 — `src/app/(auth)/layout.tsx`
- Centered layout, no sidebar
- Full-height flex container, vertically + horizontally centered
- Dark background matching app theme
- No navbar, no footer — clean auth experience

### Step 2.2 — `src/app/(auth)/login/page.tsx`
- "use client"
- Email + password fields
- Call `useLogin().mutate({ email, password })` on submit
- Disable button + show spinner while `isPending`
- Show `error.message` below submit on failure ("Invalid email or password")
- Link to `/register`

### Step 2.3 — `src/app/(auth)/register/page.tsx`
- Same pattern as login, uses `useRegister()`
- Fields: email, password (optionally confirm password)
- Link to `/login`

### Step 2.4 — `src/app/(dashboard)/layout.tsx` + Sidebar
**Current state:** Layout exists with inline sidebar + topbar. Mostly good.

Modifications needed:
- Update nav hrefs: `"/dashboard/models"` → `"/models"` and `"/dashboard/settings"` → `"/api-keys"`, `"/dashboard/logs"` → `"/logs"` (match handoff routes)
- Verify mobile hamburger toggle works
- Ensure `authStore.logout()` clears cookie
- Optionally extract Sidebar to `components/dashboard/Sidebar.tsx`

### Step 2.5 — `src/components/dashboard/StatsCards.tsx`
- Receives `models: ModelResponse[]` and `isLoading: boolean` as props
- Computes:
  - Total Models = `models.length`
  - Total Inferences = `models.reduce((sum, m) => sum + m.totalCalls, 0)`
  - Avg Latency = `(models.reduce((sum, m) => sum + m.avgLatencyMs, 0) / models.length).toFixed(0)` + "ms"
  - Active API Keys = separate count (placeholder or separate fetch)
- Skeleton cards while `isLoading`
- Each card: icon + label + value

### Step 2.6 — `src/app/(dashboard)/dashboard/page.tsx`
**Action:** Rewrite — remove all hardcoded data

- Call `useModels()` to get real data
- Handle 3 states: loading → skeleton, error → message + retry, data → render
- Render `<StatsCards models={data} isLoading={isLoading} />`
- Recent models table: `data.slice(0, 4)` — columns: name, version, status badge, infer endpoint link
- "Deploy New Model" button → opens `<UploadModal />`

### Step 2.7 — `src/components/dashboard/UploadModal.tsx`
- shadcn `Dialog` wrapping a form
- Fields: name (text input), description (textarea), file (input `accept=".pkl"`)
- On submit: build `FormData` with exact keys `"file"`, `"name"`, `"description"` — **no JSON.stringify**
- Call `useUploadModel().mutate(formData)`
- Loading state on submit button
- On success: close dialog + toast success
- On error: show error message inside dialog

### Step 2.8 — `src/app/(dashboard)/models/page.tsx` + ModelCard
- Call `useModels()` for full list
- 3-state rendering (loading/error/data)
- Grid of `<ModelCard />` components
- "Deploy New Model" button → `<UploadModal />`

### Step 2.9 — `src/components/dashboard/ModelCard.tsx`
- Receives single `ModelResponse` as prop
- Shows: name, description, version badge, status, totalCalls, inferEndpoint
- Click → navigate to `/models/{id}`

### Phase 2 Checklist
- [ ] `(auth)/layout.tsx` — centered, no sidebar
- [ ] `login/page.tsx` — useLogin, error display, spinner
- [ ] `register/page.tsx` — useRegister, same pattern
- [ ] `(dashboard)/layout.tsx` — fix nav hrefs, verify mobile
- [ ] `StatsCards.tsx` — computed stats, skeletons
- [ ] `dashboard/page.tsx` — rewrite with hooks, 3-state
- [ ] `UploadModal.tsx` — FormData, no JSON.stringify
- [ ] `models/page.tsx` — model list grid
- [ ] `ModelCard.tsx` — single model display + navigation

---

## Phase 3 — Model Detail

### Step 3.1 — `src/app/(dashboard)/models/[modelId]/page.tsx`
- "use client", get `modelId` from `useParams()`
- Call `useModelDetail(modelId)`
- 3-state rendering
- Sections:
  1. **Endpoint section** — full infer URL in monospace box + copy button, model name, version, created date
  2. **API Keys section** — list of `<ApiKeyCard />`, "Generate Key" button + label input dialog
  3. **Inference Console** — `<InferenceConsole />` component
  4. **Logs Table** — `<LogsTable />` component with pagination

### Step 3.2 — `src/components/dashboard/InferenceConsole.tsx`
- Two-panel layout: Left = textarea + Run button, Right = result display
- Textarea placeholder: `[5.1, 3.5, 1.4, 0.2]`
- On Run:
  1. `JSON.parse(input)` — if fails, show "Invalid JSON" inline error, **do not call API**
  2. If valid, call `infer` mutation from `useModelDetail`
- Result display:
  - Prediction value
  - Probability bars (if available) — rendered as percentage bars
  - Latency in ms
- All values in **monospace font**

### Step 3.3 — `src/components/dashboard/ApiKeyCard.tsx`
- Receives single `ApiKeyResponse` + `onRevoke` callback as props
- Displays: label, masked key (last 4 chars, rest as `••••`), last used date, active/revoked badge
- Revoke button → shadcn confirmation `AlertDialog` → calls `onRevoke(keyId)`
- After revoke: show "Revoked" badge, disable all buttons
- **CRITICAL:** `rawKey` is `null` on existing keys — **never** show "copy key" button on them. Only show rawKey once in the post-generation modal.

### Step 3.4 — Generate Key Modal
- Triggered from "Generate Key" button on model detail page
- Input: label for the key
- Calls `generateKey` mutation from `useModelDetail`
- On success: show rawKey in modal with **"Copy and close"** button
- Make clear: "This key will only be shown once. Copy it now."
- On close: rawKey is gone forever

### Step 3.5 — `src/components/dashboard/LogsTable.tsx`
- shadcn `Table`
- Columns:
  - Time — `date-fns formatDistanceToNow(new Date(log.calledAt), { addSuffix: true })`
  - Version — `v${log.versionNumber}`
  - Status — green badge for `SUCCESS`, red badge for `FAILED`
  - Latency — `${log.latencyMs}ms`
- Skeleton rows while `isLoading`
- On FAILED row click → expand to show `errorMessage`
- Pagination: Previous/Next buttons
  - Update `page` state → triggers new React Query fetch via `['logs', modelId, page]` key

### Phase 3 Checklist
- [ ] `models/[modelId]/page.tsx` — 4 sections, useModelDetail
- [ ] `InferenceConsole.tsx` — JSON validation, two-panel, monospace
- [ ] `ApiKeyCard.tsx` — masked key, revoke confirmation, no copy on existing
- [ ] Generate Key modal — rawKey shown once, copy + close
- [ ] `LogsTable.tsx` — relative time, status badges, expandable errors, pagination

---

## Phase 4 — Landing Page

### Step 4.1 — `src/app/(marketing)/layout.tsx`
- Includes `<Navbar />` and `<Footer />`
- No sidebar
- Clean marketing layout

### Step 4.2 — `src/components/marketing/Navbar.tsx`
- Logo + nav links
- **Auth-aware:** if token exists → show "Dashboard" link, else → "Login" / "Sign Up" buttons
- Read auth state from `useAuthStore`
- Mobile responsive with hamburger menu

### Step 4.3 — `src/components/marketing/Hero.tsx`
- Bold headline for ModelForge value proposition
- CTA buttons: "Get Started" → `/register`, "View Docs" → external or anchor
- Premium dark theme styling with animations

### Step 4.4 — `src/components/marketing/HowItWorks.tsx`
- Step-by-step visual: Upload → Deploy → Infer
- Icons + descriptions
- Animations on scroll (framer-motion)

### Step 4.5 — `src/components/marketing/Features.tsx`
- Feature grid/cards
- Key features: Model hosting, API keys, inference logs, versioning, etc.

### Step 4.6 — `src/components/marketing/Footer.tsx`
- Links, copyright, social icons
- Minimal dark footer

### Step 4.7 — `src/app/(marketing)/page.tsx`
- Update existing landing page to use the new marketing components
- Remove inline hero section, use `<Hero />`, `<HowItWorks />`, `<Features />`

### Phase 4 Checklist
- [ ] `(marketing)/layout.tsx` — navbar + footer wrapper
- [ ] `Navbar.tsx` — auth-aware, responsive
- [ ] `Hero.tsx` — premium CTA section
- [ ] `HowItWorks.tsx` — 3-step visual
- [ ] `Features.tsx` — feature grid
- [ ] `Footer.tsx` — minimal dark footer
- [ ] `page.tsx` — compose marketing components

---

## Non-Negotiable Rules (enforced at every step)

| # | Rule | Enforcement |
|---|---|---|
| 1 | No API calls in components | Components call hooks only |
| 2 | No inline types | All interfaces in `types/index.ts` |
| 3 | Every async state has 3 cases | isLoading → skeleton, isError → error + retry, data → render |
| 4 | React Query keys are arrays | `['models']`, `['model', id]`, `['logs', id, page]`, `['keys', id]` |
| 5 | Mutations invalidate related queries | upload→`['models']`, revoke→`['keys', id]`, infer→`['logs', id, 0]` |
| 6 | Never store server state in Zustand | Zustand = auth only, everything else = React Query |
| 7 | Providers in root layout only | Single `Providers.tsx` with `QueryClientProvider` |
| 8 | Toasts for all mutations | Success + error toasts via sonner |

---

## File Structure After Completion

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx              ← navbar + footer
│   │   └── page.tsx                ← landing page (Hero, HowItWorks, Features)
│   ├── (auth)/
│   │   ├── layout.tsx              ← centered, no sidebar
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← sidebar + topbar shell
│   │   ├── dashboard/page.tsx      ← overview with StatsCards + recent models
│   │   └── models/
│   │       ├── page.tsx            ← model list + ModelCard grid
│   │       └── [modelId]/page.tsx  ← detail: endpoint, keys, console, logs
│   ├── layout.tsx                  ← root: fonts, Providers, Toaster
│   └── globals.css
├── components/
│   ├── ui/                         ← shadcn only, never edit
│   ├── marketing/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ModelCard.tsx
│   │   ├── UploadModal.tsx
│   │   ├── ApiKeyCard.tsx
│   │   ├── InferenceConsole.tsx
│   │   └── LogsTable.tsx
│   └── Providers.tsx               ← QueryClientProvider
├── services/
│   ├── api.ts                      ← axios instance
│   ├── auth.service.ts
│   ├── model.service.ts
│   ├── inference.service.ts
│   └── apikey.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useModels.ts
│   └── useModelDetail.ts
├── store/
│   └── authStore.ts                ← zustand, auth only
├── types/
│   └── index.ts                    ← ALL interfaces
└── middleware.ts                   ← cookie-based route protection
```

---

## Backend Prerequisites (Spring Boot)

> [!WARNING]
> These must be done before Phase 2 testing works end-to-end:

1. **Add `GET /api/models/{id}`** endpoint to `ModelController` returning a single `ModelResponse`
2. **Add `totalCalls` (Long) and `avgLatencyMs` (Double)** to `ModelResponse` — query `inference_logs` in `ModelService`
3. **Confirm CORS allows `http://localhost:3000`** — already done in `AppConfig.java`

---

## Execution Plan

| Phase | Files | Est. Steps |
|---|---|---|
| **Phase 1 — Foundation** | 14 files (create/rewrite/move) + 3 deletions | ~15 steps |
| **Phase 2 — Auth + Dashboard** | 9 files | ~10 steps |
| **Phase 3 — Model Detail** | 5 files | ~6 steps |
| **Phase 4 — Landing Page** | 7 files | ~8 steps |

> [!TIP]
> Say **"Start Phase 1"** and I'll begin building every foundation file in order.
