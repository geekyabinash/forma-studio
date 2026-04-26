import { revalidatePath } from 'next/cache'

/**
 * Revalidate the entire public (site) layout. Call after any admin write
 * that affects content rendered on the public site so the cached pages
 * pick up the new data on the next request.
 */
export function revalidatePublicSite() {
  revalidatePath('/', 'layout')
}
