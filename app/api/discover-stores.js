import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const SYSTEM_PROMPT = `You are a knowledgeable Tokyo shopping assistant. When given a shopping list item, recommend 3–5 real Tokyo stores where a tourist can buy it.

Return a JSON array of store objects. Each object must have:
- store_name: string (official store name)
- area: string (Tokyo neighbourhood, e.g. "Akihabara", "Shinjuku", "Shibuya")
- address: string (street address in English)
- lat: number (approximate latitude, Tokyo range: 35.5–35.9)
- lng: number (approximate longitude, Tokyo range: 139.5–139.9)
- reasoning: string (1 sentence: why this store is a great match for the item)

Return ONLY the JSON array, no markdown, no explanation.`

function buildUserPrompt(item) {
  const parts = [`Find Tokyo stores for: "${item.name}"`]
  if (item.category) parts.push(`Category: ${item.category.replace('_', ' ')}`)
  if (item.budget) parts.push(`Budget: ¥${item.budget}`)
  if (item.notes) parts.push(`Notes: ${item.notes}`)
  return parts.join('\n')
}

async function discoverForItem(item) {
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildUserPrompt(item) }],
    system: SYSTEM_PROMPT,
  })

  const text = msg.content[0].text.trim()
  let stores
  try {
    stores = JSON.parse(text)
  } catch {
    return []
  }

  if (!Array.isArray(stores)) return []
  return stores.slice(0, 5).map(s => ({
    item_id: item.id,
    store_name: s.store_name ?? '',
    area: s.area ?? null,
    address: s.address ?? null,
    lat: typeof s.lat === 'number' ? s.lat : null,
    lng: typeof s.lng === 'number' ? s.lng : null,
    reasoning: s.reasoning ?? null,
  }))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { items } = req.body ?? {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array required' })
  }

  // Only discover for items that don't have cached results yet
  const itemIds = items.map(i => i.id)
  const { data: existing } = await supabase
    .from('store_matches')
    .select('item_id')
    .in('item_id', itemIds)

  const cachedItemIds = new Set((existing ?? []).map(r => r.item_id))
  const uncachedItems = items.filter(i => !cachedItemIds.has(i.id))

  // Run Claude discovery for uncached items (sequential to respect rate limits)
  const newMatches = []
  for (const item of uncachedItems) {
    try {
      const matches = await discoverForItem(item)
      if (matches.length > 0) {
        const { data, error } = await supabase
          .from('store_matches')
          .insert(matches)
          .select()
        if (!error && data) newMatches.push(...data)
      }
    } catch (err) {
      console.error(`Discovery failed for item ${item.id}:`, err.message)
    }
  }

  // Return all matches (cached + newly discovered)
  const { data: allMatches, error } = await supabase
    .from('store_matches')
    .select('*')
    .in('item_id', itemIds)
    .order('cached_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ matches: allMatches ?? [] })
}
