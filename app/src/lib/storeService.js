import { supabase } from './supabase'

/**
 * Fetch cached store matches for the given item IDs from Supabase.
 * Returns a map: itemId → store_matches[]
 */
export async function getCachedMatches(itemIds) {
  if (!itemIds.length) return {}
  const { data, error } = await supabase
    .from('store_matches')
    .select('*')
    .in('item_id', itemIds)
    .order('cached_at', { ascending: false })
  if (error) throw error
  const map = {}
  for (const row of data ?? []) {
    if (!map[row.item_id]) map[row.item_id] = []
    map[row.item_id].push(row)
  }
  return map
}

/**
 * Call the Vercel serverless function to discover stores for uncached items.
 * Returns the full matches map after discovery.
 */
export async function discoverStores(items) {
  const res = await fetch('/api/discover-stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Discovery failed: ${res.status}`)
  }
  const { matches } = await res.json()
  const map = {}
  for (const row of matches ?? []) {
    if (!map[row.item_id]) map[row.item_id] = []
    map[row.item_id].push(row)
  }
  return map
}
