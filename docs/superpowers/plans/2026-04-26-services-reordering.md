# Services Reordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the admin reorder services on `/admin/services` via drag-and-drop, with the new order persisted to the database and reflected on the public `/services` page.

**Architecture:** Add a drag handle to each row/card in the admin services list using `@dnd-kit`. On drop, the new order is sent to a new `PATCH /api/admin/services/reorder` endpoint that rewrites `sort_order` for every service in a single atomic SQL `UPDATE ... CASE` statement (no transaction needed — `neon-http` doesn't support them). New services append to the end via `MAX(sort_order) + 1`. A one-time backfill assigns sequential `sort_order` values to existing rows. Public `/services` already orders by `sort_order`, so cache revalidation is the only consumer-side change.

**Tech Stack:** Next.js 16 App Router (API routes), React 19, TypeScript, Drizzle ORM (`drizzle-orm/neon-http`), Neon Postgres, NextAuth v5 (`auth()` session check), Zod v4, Tailwind v4, sonner toasts, lucide-react icons. New dependency: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`.

**Spec:** [`forma-studio/docs/superpowers/specs/2026-04-26-services-reordering-design.md`](../specs/2026-04-26-services-reordering-design.md)

---

## Preconditions

- Working tree of `forma-studio/` has uncommitted edits to `src/app/api/admin/services/route.ts`, `src/app/api/admin/services/[id]/route.ts`, and other admin route files. **Before executing this plan, commit or stash those changes** — Task 3 modifies `services/route.ts` and would otherwise entangle with in-flight work.
- `DATABASE_URL` is set in `.env.local` and points at a Neon Postgres instance with the `services` table populated (run `npm run db:seed-content` if empty).
- `npm install` has been run at least once.

---

## File Structure

**Files created:**

| File | Responsibility |
|---|---|
| `forma-studio/scripts/backfill-services-sort-order.ts` | One-time tsx script that assigns sequential `sort_order` to existing services ordered by `created_at`. Run via `npm run db:backfill-services-order`. |
| `forma-studio/drizzle/0005_backfill_services_sort_order.sql` | The SQL the script runs, kept under `drizzle/` for record-keeping alongside other migration files. |
| `forma-studio/src/app/api/admin/services/reorder/route.ts` | `PATCH` endpoint. Validates body, ensures ID set matches DB, rewrites `sort_order` via a single CASE update, calls `revalidatePublicSite()`. |
| `forma-studio/src/components/admin/SortableServiceRow.tsx` | Desktop table row that uses `useSortable`. Renders the drag handle plus the existing row content (title, slug, feature count, Edit/Delete). |
| `forma-studio/src/components/admin/SortableServiceCard.tsx` | Mobile card that uses `useSortable`. Renders the drag handle plus the existing card content. |

**Files modified:**

| File | Change |
|---|---|
| `forma-studio/package.json` | Add `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` to `dependencies`. Add `db:backfill-services-order` script. |
| `forma-studio/src/lib/schemas.ts` | Add `servicesReorderSchema = z.object({ ordered_ids: z.array(z.uuid()).min(1) })`. |
| `forma-studio/src/app/api/admin/services/route.ts` | In `POST`, compute `sortOrder = (max(sort_order) + 1)` before insert. |
| `forma-studio/src/app/admin/services/page.tsx` | Replace inline desktop `<tr>` and mobile card with `SortableServiceRow` / `SortableServiceCard`. Wrap each list in `<DndContext>` + `<SortableContext>`. Add `handleDragEnd` and `isReordering` state. |

---

## Task 1: Install @dnd-kit dependencies

**Files:**
- Modify: `forma-studio/package.json` (auto by npm)
- Modify: `forma-studio/package-lock.json` (auto by npm)

- [ ] **Step 1: Install the three packages**

```bash
cd forma-studio
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: three packages appear in `package.json` `dependencies`. No errors.

- [ ] **Step 2: Verify the install**

```bash
node -e "require('@dnd-kit/core'); require('@dnd-kit/sortable'); require('@dnd-kit/utilities'); console.log('ok')"
```

Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @dnd-kit for admin drag-and-drop reordering"
```

---

## Task 2: Add backfill SQL and runner script

**Files:**
- Create: `forma-studio/drizzle/0005_backfill_services_sort_order.sql`
- Create: `forma-studio/scripts/backfill-services-sort-order.ts`
- Modify: `forma-studio/package.json` (add `db:backfill-services-order` script)

- [ ] **Step 1: Create the SQL file**

Create `forma-studio/drizzle/0005_backfill_services_sort_order.sql` with this exact content:

```sql
-- Backfill sort_order for existing services so that drag-and-drop
-- reordering starts from a sensible sequential baseline (0, 1, 2, …)
-- ordered by created_at ascending. Safe to re-run.

WITH ordered AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1) AS new_order
  FROM services
)
UPDATE services s
SET sort_order = ordered.new_order
FROM ordered
WHERE s.id = ordered.id;
```

(`id ASC` is a tiebreaker for rows created in the same millisecond.)

- [ ] **Step 2: Create the runner script**

Create `forma-studio/scripts/backfill-services-sort-order.ts` with this exact content:

```ts
import { config } from 'dotenv'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

config({ path: '.env.local' })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const db = drizzle(process.env.DATABASE_URL)
  const sqlPath = resolve(process.cwd(), 'drizzle/0005_backfill_services_sort_order.sql')
  const sqlText = readFileSync(sqlPath, 'utf8')

  await db.execute(sql.raw(sqlText))

  const rows = await db.execute(
    sql`SELECT id, sort_order, created_at FROM services ORDER BY sort_order ASC`
  )
  console.log('Backfilled. Current order:')
  console.table(rows.rows)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 3: Add the npm script**

Edit `forma-studio/package.json` `scripts` block. Add this line after `"db:seed-content"`:

```json
"db:backfill-services-order": "tsx scripts/backfill-services-sort-order.ts"
```

The full `scripts` block should look like:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:generate": "drizzle-kit generate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx scripts/seed.ts",
  "db:seed-admin": "tsx scripts/seed-admin.ts",
  "db:seed-content": "tsx scripts/seed-content.ts",
  "db:backfill-services-order": "tsx scripts/backfill-services-sort-order.ts"
}
```

- [ ] **Step 4: Run the backfill against the local database**

```bash
cd forma-studio
npm run db:backfill-services-order
```

Expected output: a printed table of services with `sort_order` values starting at `0` and incrementing by 1 in `created_at` order. No errors.

- [ ] **Step 5: Commit**

```bash
git add drizzle/0005_backfill_services_sort_order.sql scripts/backfill-services-sort-order.ts package.json package-lock.json
git commit -m "feat(db): backfill sort_order for existing services"
```

---

## Task 3: Make new services append to the end

**Files:**
- Modify: `forma-studio/src/app/api/admin/services/route.ts`

- [ ] **Step 1: Update the POST handler to compute sortOrder before insert**

Open `forma-studio/src/app/api/admin/services/route.ts`. Replace the entire `POST` function with this version:

```ts
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = serviceSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Append new services to the end of the order
    const [maxRow] = await db
      .select({ max: sql<number>`coalesce(max(${services.sortOrder}), -1)` })
      .from(services)
    const nextSortOrder = (maxRow?.max ?? -1) + 1

    const [data] = await db
      .insert(services)
      .values({
        title: v.title,
        slug: v.slug,
        shortTitle: v.short_title,
        description: v.description,
        icon: v.icon,
        features: v.features,
        imageUrl: v.image_url || null,
        imageAlt: v.image_alt,
        imageWidth: v.image_width,
        imageHeight: v.image_height,
        featuredProjectSlug: v.featured_project_slug,
        sortOrder: nextSortOrder,
      })
      .returning()

    revalidatePublicSite()

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/services error:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Add the `sql` import**

At the top of the same file, change the `drizzle-orm` import line from:

```ts
import { asc } from 'drizzle-orm'
```

to:

```ts
import { asc, sql } from 'drizzle-orm'
```

- [ ] **Step 3: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors related to `services/route.ts`.

- [ ] **Step 4: Smoke-test via the running dev server**

In one terminal:

```bash
cd forma-studio
npm run dev
```

In another terminal, log in to `/admin` in a browser, navigate to `/admin/services/new`, create a dummy service named "Plan Test 1". Then create another named "Plan Test 2". Then in `psql` or Drizzle Studio (`npm run db:studio`), verify:

```
SELECT title, sort_order FROM services ORDER BY sort_order DESC LIMIT 2;
```

Expected: the two test services have the two highest `sort_order` values, with "Plan Test 2" greater than "Plan Test 1". Delete both test services after verifying.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/services/route.ts
git commit -m "feat(api): append new services to end of sort order"
```

---

## Task 4: Add the Zod schema for the reorder body

**Files:**
- Modify: `forma-studio/src/lib/schemas.ts`

- [ ] **Step 1: Append the schema at the bottom of the file**

Open `forma-studio/src/lib/schemas.ts`. Add this at the end of the file (after the last existing export):

```ts
// ========== Admin: Services Reorder ==========
export const servicesReorderSchema = z.object({
  ordered_ids: z.array(z.uuid()).min(1, 'ordered_ids must contain at least one ID'),
});

export type ServicesReorderValues = z.infer<typeof servicesReorderSchema>;
```

- [ ] **Step 2: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/schemas.ts
git commit -m "feat(schemas): add servicesReorderSchema"
```

---

## Task 5: Build the reorder API route

**Files:**
- Create: `forma-studio/src/app/api/admin/services/reorder/route.ts`

- [ ] **Step 1: Create the route file**

Create `forma-studio/src/app/api/admin/services/reorder/route.ts` with this exact content:

```ts
import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { servicesReorderSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { inArray, sql, type SQL } from 'drizzle-orm'

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = servicesReorderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }
    const orderedIds = parsed.data.ordered_ids

    // Ensure orderedIds matches the current set of services exactly.
    const existing = await db.select({ id: services.id }).from(services)
    const existingSet = new Set(existing.map((row) => row.id))
    const incomingSet = new Set(orderedIds)

    if (
      existingSet.size !== incomingSet.size ||
      orderedIds.some((id) => !existingSet.has(id)) ||
      existing.some((row) => !incomingSet.has(row.id))
    ) {
      return NextResponse.json(
        { error: 'Service list changed since you loaded the page. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Single atomic UPDATE: SET sort_order = CASE id WHEN ... THEN ... END
    const cases: SQL[] = [sql`(case`]
    orderedIds.forEach((id, idx) => {
      cases.push(sql`when ${services.id} = ${id}::uuid then ${idx}`)
    })
    cases.push(sql`end)`)
    const caseExpr = sql.join(cases, sql.raw(' '))

    await db
      .update(services)
      .set({ sortOrder: caseExpr })
      .where(inArray(services.id, orderedIds))

    revalidatePublicSite()

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PATCH /api/admin/services/reorder error:', error)
    return NextResponse.json(
      { error: 'Failed to save order' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors related to the new route.

- [ ] **Step 3: Smoke-test the route directly**

Make sure the dev server is running (`npm run dev`). Log in to `/admin` so you have an authenticated cookie. Open DevTools → Application → Cookies → copy the value of the `authjs.session-token` (or `__Secure-authjs.session-token`) cookie.

Run this curl, substituting `<COOKIE_VALUE>` and `<COOKIE_NAME>` accordingly. First fetch the current order:

```bash
curl -s http://localhost:3000/api/admin/services \
  -H 'Cookie: <COOKIE_NAME>=<COOKIE_VALUE>' | jq '.services[] | {id, title, sort_order: .sortOrder}'
```

Pick all the IDs and reverse them. Then PATCH:

```bash
curl -s -X PATCH http://localhost:3000/api/admin/services/reorder \
  -H 'Cookie: <COOKIE_NAME>=<COOKIE_VALUE>' \
  -H 'Content-Type: application/json' \
  -d '{"ordered_ids":["<id-1>","<id-2>","<id-3>"]}'
```

Expected response: `{"ok":true}`

Re-run the first curl. Expected: services come back in the new (reversed) order with `sort_order` values 0, 1, 2, …

Then test the stale-set case — pass an array missing one ID:

```bash
curl -s -X PATCH http://localhost:3000/api/admin/services/reorder \
  -H 'Cookie: <COOKIE_NAME>=<COOKIE_VALUE>' \
  -H 'Content-Type: application/json' \
  -d '{"ordered_ids":["<id-1>"]}' \
  -w '\nHTTP %{http_code}\n'
```

Expected: HTTP 400, body contains `"Service list changed since you loaded the page"`.

Test the unauthenticated case (no cookie):

```bash
curl -s -X PATCH http://localhost:3000/api/admin/services/reorder \
  -H 'Content-Type: application/json' \
  -d '{"ordered_ids":["00000000-0000-0000-0000-000000000000"]}' \
  -w '\nHTTP %{http_code}\n'
```

Expected: HTTP 401, body `{"error":"Unauthorized"}`.

Restore the original order with another PATCH before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/services/reorder/route.ts
git commit -m "feat(api): add PATCH /api/admin/services/reorder"
```

---

## Task 6: Build the SortableServiceRow component (desktop)

**Files:**
- Create: `forma-studio/src/components/admin/SortableServiceRow.tsx`

- [ ] **Step 1: Create the component**

Create `forma-studio/src/components/admin/SortableServiceRow.tsx` with this exact content:

```tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, GripVertical, Trash2 } from 'lucide-react'

export interface SortableServiceRowProps {
  service: {
    id: string
    title: string
    slug: string
    features: string[] | null
  }
  isLast: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function SortableServiceRow({
  service,
  isLast,
  onEdit,
  onDelete,
}: SortableServiceRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: service.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'rgba(245, 230, 208, 0.05)' : undefined,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-[#F5E6D0]/5 hover:bg-[#F5E6D0]/5 transition-colors
        ${isLast ? 'border-b-0' : ''}`}
    >
      <td className="p-4 w-10">
        <button
          type="button"
          aria-label={`Drag to reorder ${service.title}`}
          className="cursor-grab active:cursor-grabbing text-[#D4B896] hover:text-[#F5E6D0]
            p-1 rounded transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="p-4 font-josefin text-[#F5E6D0]">{service.title}</td>
      <td className="p-4 font-josefin text-[#D4B896] text-sm">{service.slug}</td>
      <td className="p-4 font-josefin text-[#D4B896] text-sm">
        {service.features?.length || 0} features
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(service.id)}
            className="p-2 text-[#D4B896] hover:text-[#D4654A] hover:bg-[#D4654A]/10
              rounded-lg transition-all duration-300"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 text-[#D4B896] hover:text-red-400 hover:bg-red-400/10
              rounded-lg transition-all duration-300"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/SortableServiceRow.tsx
git commit -m "feat(admin): add SortableServiceRow component"
```

---

## Task 7: Build the SortableServiceCard component (mobile)

**Files:**
- Create: `forma-studio/src/components/admin/SortableServiceCard.tsx`

- [ ] **Step 1: Create the component**

Create `forma-studio/src/components/admin/SortableServiceCard.tsx` with this exact content:

```tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, GripVertical, Trash2 } from 'lucide-react'

export interface SortableServiceCardProps {
  service: {
    id: string
    title: string
    features: string[] | null
  }
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function SortableServiceCard({
  service,
  onEdit,
  onDelete,
}: SortableServiceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: service.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1A2332] rounded-xl p-4 border border-[#F5E6D0]/10"
    >
      <div className="flex items-start gap-3 mb-3">
        <button
          type="button"
          aria-label={`Drag to reorder ${service.title}`}
          className="cursor-grab active:cursor-grabbing text-[#D4B896] hover:text-[#F5E6D0]
            p-1 -ml-1 rounded transition-colors touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-josefin text-[#F5E6D0] font-medium">{service.title}</h3>
          <p className="font-josefin text-[#D4B896] text-sm mt-0.5">
            {service.features?.length || 0} features
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-[#F5E6D0]/10">
        <button
          onClick={() => onEdit(service.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#D4B896]
            hover:text-[#D4654A] hover:bg-[#D4654A]/10 rounded-lg transition-all duration-300
            font-josefin text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-[#D4B896]
            hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300
            font-josefin text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/SortableServiceCard.tsx
git commit -m "feat(admin): add SortableServiceCard component"
```

---

## Task 8: Wire DndContext into the services list page

**Files:**
- Modify: `forma-studio/src/app/admin/services/page.tsx`

- [ ] **Step 1: Replace the entire file**

Replace the contents of `forma-studio/src/app/admin/services/page.tsx` with:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus, Loader2 } from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import SortableServiceRow from '@/components/admin/SortableServiceRow'
import SortableServiceCard from '@/components/admin/SortableServiceCard'
import { toast } from 'sonner'

interface Service {
  id: string
  title: string
  slug: string
  features: string[]
  created_at: string
}

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isReordering, setIsReordering] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = services.findIndex((s) => s.id === active.id)
    const newIndex = services.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const previous = services
    const reordered = arrayMove(services, oldIndex, newIndex)
    setServices(reordered)
    setIsReordering(true)

    try {
      const response = await fetch('/api/admin/services/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordered_ids: reordered.map((s) => s.id) }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          toast.error('Service list changed — reloading')
          await fetchServices()
        } else if (response.status === 401) {
          setServices(previous)
          toast.error('Session expired — please sign in again')
        } else {
          setServices(previous)
          const body = await response.json().catch(() => ({}))
          toast.error(body.error || 'Failed to save order')
        }
      }
    } catch (err) {
      console.error('Reorder failed:', err)
      setServices(previous)
      toast.error('Failed to save order')
    } finally {
      setIsReordering(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/services/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      toast.success('Service deleted successfully')
      setServices(services.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete service')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4654A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-josefin text-[#D4B896]">Loading services...</p>
        </div>
      </div>
    )
  }

  const serviceIds = services.map((s) => s.id)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
              Services
            </h1>
            {isReordering && (
              <span className="flex items-center gap-2 text-[#D4B896] font-josefin text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving order…
              </span>
            )}
          </div>
          <p className="font-josefin text-[#D4B896] text-sm">
            Drag the handle on the left of each row to reorder. Changes save automatically.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/services/new')}
          className="flex items-center gap-2 px-3 py-3 md:px-6 bg-[#D4654A] text-white rounded-lg
            font-josefin text-sm hover:bg-[#D4654A]/90 shadow-lg shadow-[#D4654A]/20
            transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add New Service</span>
        </button>
      </div>

      {/* Empty state */}
      {services.length === 0 ? (
        <div className="bg-[#1A2332] rounded-xl p-12 border border-[#F5E6D0]/10 text-center">
          <Briefcase className="w-16 h-16 text-[#D4B896]/40 mx-auto mb-4" />
          <h3 className="font-cormorant text-2xl text-[#F5E6D0] mb-2">
            No Services Yet
          </h3>
          <p className="font-josefin text-[#D4B896] mb-6">
            Get started by creating your first service
          </p>
          <button
            onClick={() => router.push('/admin/services/new')}
            className="px-6 py-3 bg-[#D4654A] text-white rounded-lg font-josefin text-sm
              hover:bg-[#D4654A]/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Service
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={serviceIds} strategy={verticalListSortingStrategy}>
            {/* Desktop Table */}
            <div className="hidden md:block bg-[#1A2332] rounded-xl border border-[#F5E6D0]/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5E6D0]/10">
                    <th className="text-left p-4 w-10 font-josefin text-[#D4B896] text-sm font-medium">
                      <span className="sr-only">Reorder</span>
                    </th>
                    <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                      Title
                    </th>
                    <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                      Slug
                    </th>
                    <th className="text-left p-4 font-josefin text-[#D4B896] text-sm font-medium">
                      Features
                    </th>
                    <th className="text-right p-4 font-josefin text-[#D4B896] text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <SortableServiceRow
                      key={service.id}
                      service={service}
                      isLast={index === services.length - 1}
                      onEdit={(id) => router.push(`/admin/services/${id}`)}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
              {services.map((service) => (
                <SortableServiceCard
                  key={service.id}
                  service={service}
                  onEdit={(id) => router.push(`/admin/services/${id}`)}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd forma-studio
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
cd forma-studio
npm run lint
```

Expected: no new errors. (Pre-existing warnings in other files are acceptable.)

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/services/page.tsx
git commit -m "feat(admin): drag-and-drop reordering on services list"
```

---

## Task 9: End-to-end manual verification

**Files:** None (verification only)

- [ ] **Step 1: Restart the dev server**

```bash
cd forma-studio
npm run dev
```

- [ ] **Step 2: Happy path — desktop**

In a desktop browser:
1. Log in to `/admin`.
2. Go to `/admin/services`. You should see the grip handle (⋮⋮) on the left of each row.
3. Drag a row from the bottom to the top. The list should reorder visually as you drag.
4. On drop, "Saving order…" appears next to the page title and disappears within ~1s.
5. Hard-refresh the page (`Cmd+Shift+R`). The new order persists.
6. Navigate to `/services` (public). The order matches.

- [ ] **Step 3: Happy path — mobile**

Open Chrome DevTools, switch to a phone viewport (e.g., iPhone 14):
1. Visit `/admin/services`. Cards show with grip handles.
2. Try scrolling the page by dragging anywhere except the handle — page should scroll normally.
3. Long-press (200ms+) the handle of one card and drag it. The card should reorder.
4. Release. "Saving order…" appears, then disappears.
5. Refresh — order persists.

- [ ] **Step 4: Keyboard path**

On desktop:
1. Tab through the page until focus reaches a grip handle (you should see a focus ring).
2. Press `Space` to lift the row.
3. Press `↓` arrow several times to move it down.
4. Press `Space` to drop.
5. Refresh — the new order persists.

- [ ] **Step 5: Failure path — server down**

1. With the dev server running, drag a row to a new position to confirm working state.
2. Stop the dev server (Ctrl+C in its terminal).
3. In the browser, drag another row.
4. Expected: the visual order reverts after the request fails, and a `Failed to save order` toast appears.
5. Restart the dev server.

- [ ] **Step 6: Failure path — stale set**

1. Open `/admin/services` in two browser tabs (A and B). Both show the same list.
2. In tab A, delete the bottom service.
3. In tab B (which still shows the deleted service in its list), drag any row.
4. Expected: a `Service list changed — reloading` toast fires, and the list re-fetches (the deleted service disappears).

- [ ] **Step 7: Public page revalidation**

1. Reorder services in `/admin/services`.
2. In a separate browser window (or incognito), visit `/services`.
3. Expected: the new order is reflected immediately.

- [ ] **Step 8: Final commit (if any incidental fixes)**

If you found any small issues during smoke testing and fixed them, commit them now:

```bash
git status
git add <files>
git commit -m "fix: <what you fixed>"
```

If nothing changed, skip this step.

---

## Done

After Task 9 passes all checks:

- The admin can reorder services via drag-and-drop (mouse, touch, keyboard).
- Order persists in `services.sort_order`.
- Public `/services` reflects the order on next request.
- New services append to the end automatically.
- Existing services have a sensible backfilled order.
