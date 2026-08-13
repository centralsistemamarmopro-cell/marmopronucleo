import { supabase } from './supabase.js';

const TABLES = ['leads', 'conversations', 'messages', 'campaigns', 'events'];

export async function loadStore() {
  const store = {};
  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    store[table] = data || [];
  }
  return store;
}

export async function saveStore() {
  // Mutations are persisted transactionally at the operation level through insert/update helpers below.
  return true;
}

export async function insert(table, row) {
  if (!TABLES.includes(table)) throw new Error(`invalid_table:${table}`);
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function update(table, id, patch) {
  if (!TABLES.includes(table)) throw new Error(`invalid_table:${table}`);
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function count(table) {
  if (!TABLES.includes(table)) throw new Error(`invalid_table:${table}`);
  const { count: total, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return total || 0;
}

export function id() {
  return crypto.randomUUID();
}
