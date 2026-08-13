import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'runtime.json');
const initial = { leads: [], conversations: [], messages: [], campaigns: [], events: [] };

const remoteEnabled = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const remoteUrl = remoteEnabled ? `${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/runtime_states` : null;
const remoteHeaders = remoteEnabled ? {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  'content-type': 'application/json',
  accept: 'application/json'
} : null;

async function loadRemote() {
  const response = await fetch(`${remoteUrl}?scope=eq.global&select=data&limit=1`, { headers: remoteHeaders });
  if (!response.ok) throw new Error(`supabase_load_${response.status}`);
  const rows = await response.json();
  return rows[0]?.data || null;
}

async function saveRemote(store) {
  const response = await fetch(remoteUrl, {
    method: 'POST',
    headers: { ...remoteHeaders, prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ scope: 'global', data: store, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`supabase_save_${response.status}`);
}

export async function loadStore() {
  if (remoteEnabled) {
    try { return (await loadRemote()) || structuredClone(initial); }
    catch (error) { console.error('Supabase store unavailable; using local fallback.', error.message); }
  }
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { await fs.mkdir(DATA_DIR, { recursive: true }); await fs.writeFile(FILE, JSON.stringify(initial, null, 2)); return structuredClone(initial); }
}

export async function saveStore(store) {
  if (remoteEnabled) {
    try { await saveRemote(store); return; }
    catch (error) { console.error('Supabase save failed; writing local fallback.', error.message); }
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2));
  await fs.rename(tmp, FILE);
}

export function id(prefix = 'id') { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
