import { randomUUID } from 'node:crypto';
import { loadStore, saveStore, id } from './store.js';
import { replyToMessage } from './agent.js';
import { integrationStatus, sendMessage } from './integrations.js';

const store = await loadStore();
const rate = new Map();

function json(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(data));
}
function auth(req) { return req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}` && Boolean(process.env.ADMIN_TOKEN); }
function allowed(req) {
  const now = Date.now(), key = req.socket.remoteAddress || 'unknown';
  const hit = rate.get(key) || { start: now, count: 0 };
  if (now - hit.start > 60_000) { hit.start = now; hit.count = 0; }
  hit.count++; rate.set(key, hit); return hit.count <= Number(process.env.RATE_LIMIT_PER_MINUTE || 120);
}
async function body(req) {
  let raw = ''; for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  if (raw.length > 1_000_000) throw new Error('payload_too_large');
  return JSON.parse(raw);
}
function route(req) { return new URL(req.url, 'http://localhost'); }

export async function handle(req, res) {
  if (!allowed(req)) return json(res, 429, { error: 'rate_limit' });
  const url = route(req);
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, service: 'marmopro-nucleo', time: new Date().toISOString() });
    if (req.method === 'GET' && url.pathname === '/api/dashboard') return json(res, 200, { leads: store.leads.length, conversations: store.conversations.length, messages: store.messages.length, campaigns: store.campaigns.length, escalations: store.conversations.filter(c => c.escalated).length });
    if (req.method === 'GET' && url.pathname === '/api/integrations') return json(res, 200, integrationStatus());

    if (req.method === 'POST' && url.pathname === '/api/leads') {
      const data = await body(req); if (!data.name && !data.phone && !data.email) return json(res, 400, { error: 'lead_identifier_required' });
      const lead = { id: id('lead'), name: data.name || '', phone: data.phone || '', email: data.email || '', source: data.source || 'direct', status: 'new', createdAt: new Date().toISOString() };
      store.leads.push(lead); await saveStore(store); return json(res, 201, lead);
    }

    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const data = await body(req); const conversationId = data.conversationId || randomUUID();
      let conversation = store.conversations.find(c => c.id === conversationId);
      if (!conversation) { conversation = { id: conversationId, escalated: false, createdAt: new Date().toISOString() }; store.conversations.push(conversation); }
      const answer = replyToMessage(data.message, data.context); conversation.escalated ||= answer.escalate;
      store.messages.push({ id: id('msg'), conversationId, role: 'user', text: data.message, createdAt: new Date().toISOString() });
      store.messages.push({ id: id('msg'), conversationId, role: 'assistant', text: answer.text, intent: answer.intent, createdAt: new Date().toISOString() });
      await saveStore(store); return json(res, 200, { conversationId, ...answer });
    }

    if (req.method === 'POST' && url.pathname === '/api/campaigns') {
      if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' });
      const data = await body(req); if (!data.name) return json(res, 400, { error: 'campaign_name_required' });
      const campaign = { id: id('campaign'), name: data.name, channel: data.channel || 'internal', status: 'draft', audience: data.audience || 'all', createdAt: new Date().toISOString() };
      store.campaigns.push(campaign); await saveStore(store); return json(res, 201, campaign);
    }

    if (req.method === 'POST' && url.pathname === '/api/messages/send') {
      if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' });
      const data = await body(req); if (!data.channel || !data.recipient || !data.text) return json(res, 400, { error: 'channel_recipient_text_required' });
      const result = await sendMessage(data.channel, data.recipient, data.text);
      store.events.push({ id: id('evt'), type: 'message_send', ...result, createdAt: new Date().toISOString() }); await saveStore(store);
      return json(res, 202, result);
    }

    return json(res, 404, { error: 'not_found' });
  } catch (error) { console.error(error); return json(res, 400, { error: error.message || 'bad_request' }); }
}
