# Services Reordering — Design Spec

**Date:** 2026-04-26
**Status:** Approved (pending implementation)
**Owner:** Forma Studio admin

## Problem

The admin can create, edit, and delete services, but cannot control the order in which they appear on the public `/services` page. Today every service is created with `sort_order = 0`, so display order falls back to whatever order the database returns rows in. The admin has no way to say "show Architectural Design first, then Interior Design, then Urban Planning."

## Goals

- Give the admin a direct, visual way to reorder services.
- Persist that order so the public `/services` page reflects it.
- Keep the change small, self-contained, and reusable as a pattern for Projects / Gallery / Team later.

## Non-goals

- Reordering Projects, Gallery, Team, Careers, etc. The same pattern can be applied later but is out of scope here.
- Changing how the home-page services section picks its services. That section is driven by `home.servicesServiceSlugs` (an explicit ordered slug array) and continues to own its own order.
- Categorizing or grouping services (drag between buckets).
- Multi-admin concurrent edit reconciliation. The site is operated by a single admin; last-write-wins is acceptable.

## User-facing behavior

On `/admin/services`:

1. Each service row (desktop table) and card (mobile list) gains a drag handle on the left, rendered as the lucide `GripVertical` icon (⋮⋮).
2. The admin grabs the handle and drags the row to its desired position. The list reorders visually as they drag.
3. On drop, the new order is saved automatically. A subtle "Saving order…" indicator appears next to the page title; on success it disappears, on failure the list reverts and a toast says "Failed to save order."
4. Keyboard users can tab to a handle, press Space to lift, use ↑/↓ to move, and Space to drop — provided by `@dnd-kit`'s keyboard sensor.
5. On mobile, drag activation requires a 200ms hold (or a 5px move) so the page can still be scrolled normally.
6. Edit and Delete buttons remain clickable; only the handle initiates a drag.

The public `/services` page automatically reflects the new order because its query already sorts by `sort_order`. Cache revalidation is triggered on every successful reorder so the change is visible without a manual rebuild.

## Architecture

### Library

Add `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`. Combined gzipped weight ≈ 10 kb. Reasons over alternatives:

- **vs. `react-beautiful-dnd`:** unmaintained, larger, no React 19 support story.
- **vs. `react-sortablejs`:** drags an entire jQuery-era SortableJS along; harder to style.
- **vs. hand-rolled HTML5 drag-and-drop:** no built-in keyboard accessibility, fiddly cross-browser behavior, no touch support.

`@dnd-kit` is headless (no styles), accessible by default, and actively maintained.

### Backend

#### New endpoint: `PATCH /api/admin/services/reorder`

- **Auth:** `auth()` session check (same pattern as existing routes). 401 if not signed in.
- **Body schema (Zod):** `{ orderedIds: z.array(z.string().uuid()).min(1) }`
- **Validation steps:**
  1. Parse and validate body shape.
  2. Fetch the current set of service IDs from the database.
  3. Reject (400) if `orderedIds` does not contain exactly the same set of IDs as the current services. This catches stale clients that sent a deleted service or missed a newly added one — the admin should refresh before retrying.
- **Update:** Single `db.transaction` that issues one `UPDATE services SET sort_order = $idx WHERE id = $id` per ID, indexed `0..n-1`.
- **Side effect:** Call `revalidatePublicSite()` on success.
- **Response:** `{ ok: true }` on 200; `{ error: string }` on failure.

#### `POST /api/admin/services` (existing) — modified

When inserting a new service, compute `sortOrder` as `(max(sort_order) + 1)` from the existing rows, defaulting to `0` if the table is empty. This way new services append to the end of the list rather than colliding at `0`.

Implementation: a `SELECT MAX(sort_order) FROM services` inside the same insert path, before the `INSERT`.

#### `PUT /api/admin/services/[id]` (existing) — unchanged

The edit route does not need to touch `sort_order`. Reordering is a separate operation and the edit form will not expose a sort-order field. This is an intentional simplification; if the admin wants to move a service they use drag-and-drop on the list page.

#### Backfill migration

A one-time SQL migration assigns sequential `sort_order` values to existing rows so the first reorder doesn't fight a sea of zeroes:

```sql
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS new_order
  FROM services
)
UPDATE services s
SET sort_order = ordered.new_order
FROM ordered
WHERE s.id = ordered.id;
```

This ships as a new file under `forma-studio/drizzle/` following the existing migration naming convention.

### Frontend

#### Files touched

- `src/app/admin/services/page.tsx` — wrap the list in `<DndContext>` + `<SortableContext>`, add drag handle to each row/card, wire `handleDragEnd` to call the new endpoint.

#### Files added

- `src/components/admin/SortableServiceRow.tsx` — desktop table row using `useSortable`. Renders the handle, title, slug, feature count, and Edit/Delete buttons.
- `src/components/admin/SortableServiceCard.tsx` — mobile card variant using `useSortable`. Same data, card layout.

(The list page composes these; no shared abstraction yet — premature for one consumer. When Projects/Gallery adopt the same pattern, extract a generic `<SortableList>` then.)

#### State machine

```
idle ──drag start──▶ dragging ──drop──▶ saving ──success──▶ idle
                                            └──error──▶ reverted (toast) → idle
```

- Local state holds `services: Service[]` (already exists).
- On drag end, optimistically reorder local state.
- Set `isReordering = true`, fire `PATCH`.
- On 200: clear `isReordering`.
- On non-200: restore the pre-drag snapshot, clear `isReordering`, show error toast.

#### Sensors

```ts
useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
)
```

The 5px activation distance for pointer prevents accidental drags when the admin clicks Edit/Delete. The 200ms touch delay preserves normal page scrolling on mobile.

## Data flow

```
[admin drags row]
        │
        ▼
[optimistic local reorder]
        │
        ▼
[PATCH /api/admin/services/reorder { orderedIds: [...] }]
        │
        ├──200──▶ revalidatePublicSite() ──▶ public /services reflects new order
        │
        └──4xx/5xx──▶ revert local state, toast error
```

## Error handling

| Failure | Behavior |
|---|---|
| Network error / 5xx | Revert local state, toast `Failed to save order` |
| 401 (session expired) | Revert local state, toast `Session expired — please sign in again`. The admin re-authenticates through the existing login flow; no auto-redirect added by this feature. |
| 400 (stale ID set) | Revert local state, toast `Service list changed — reloading`, then re-fetch the services list so the next drag uses the current data. |
| DB transaction rollback | Returns 500; treated like any 5xx |

## Testing

The project currently has no test framework configured. Standing up vitest/jest just for this feature is out of scope. Verification is therefore manual:

- **Backfill migration check:** after running the migration against the local database, `SELECT id, sort_order, created_at FROM services ORDER BY created_at` returns sequential `sort_order` values starting at 0.
- **Reorder happy path:** on `/admin/services`, drag a row, reload the page, confirm the new order persists. Visit `/services` on the public site and confirm the order matches.
- **Reorder failure path:** with the dev server stopped, attempt a drag — the optimistic UI should revert and the error toast should fire. Restart the server and confirm the next drag works.
- **Stale-set path:** open `/admin/services` in two tabs. Delete a service in tab A. In tab B, drag a row — the request should 400 and the page should re-fetch.
- **Mobile path:** on a phone (or device emulation), confirm the page still scrolls normally and that a 200ms hold on the handle initiates a drag.
- **Keyboard path:** tab to a handle, press Space, use ↑/↓ to move, press Space to drop. Confirm the order persists.

If a test framework is added in a future feature, the API route should get a unit test covering the auth, validation, transaction, and revalidation paths.

## Open questions

None at design time. Implementation may surface details (toast wording, exact handle styling) that get decided in the plan.

## Rollout

Single PR / single merge:

1. Add `@dnd-kit` dependencies.
2. Add the backfill migration.
3. Add the reorder API route.
4. Modify the create-service route to append.
5. Update the admin services list page.
6. Verify locally; merge.

No feature flag — this is purely additive UX in an admin area; existing services keep working unchanged.
