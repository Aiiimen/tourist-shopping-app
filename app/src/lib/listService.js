import { supabase } from './supabase'

const LIST_KEY = 'tsa_list_id'

export async function getOrCreateList() {
  const storedId = localStorage.getItem(LIST_KEY)

  if (storedId) {
    const { data } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('id', storedId)
      .maybeSingle()
    if (data) return data
  }

  const { data, error } = await supabase
    .from('shopping_lists')
    .insert({ name: 'My Tokyo List', city: 'tokyo' })
    .select()
    .single()
  if (error) throw error
  localStorage.setItem(LIST_KEY, data.id)
  return data
}

export async function getItems(listId) {
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function addItem(listId, { name, notes, budget, for_whom }) {
  const { data, error } = await supabase
    .from('list_items')
    .insert({
      list_id: listId,
      name: name.trim(),
      notes: notes?.trim() || null,
      budget: budget ? Number(budget) : null,
      for_whom: for_whom?.trim() || null,
      category: 'other',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateItem(itemId, updates) {
  const { data, error } = await supabase
    .from('list_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteItem(itemId) {
  const { error } = await supabase
    .from('list_items')
    .delete()
    .eq('id', itemId)
  if (error) throw error
}
