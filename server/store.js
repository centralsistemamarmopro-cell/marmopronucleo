import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'runtime.json');
const initial = { leads: [], conversations: [], messages: [], campaigns: [], events: [] };

export async function loadStore() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }
  catch { await fs.mkdir(DATA_DIR, { recursive: true }); await fs.writeFile(FILE, JSON.stringify(initial, null, 2)); return structuredClone(initial); }
}

export async function saveStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2));
  await fs.rename(tmp, FILE);
}

export function id(prefix = 'id') { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
