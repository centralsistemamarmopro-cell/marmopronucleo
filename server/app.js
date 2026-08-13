import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadStore, saveStore, id } from './store.js';
import { replyToMessage } from './agent.js';
import { integrationStatus, sendMessage } from './integrations.js';
import { createCampaign, updateCampaignMetrics, marketingDashboard, generateMarketingBrief } from './marketing.js';
import { listPlans, createCheckout, handleStripeWebhook } from './billing.js';
import { ensureCommercial, commercialDashboard, createProject, createTechnicalAnalysis, createBudget, updateBudget, createOrder, updateOrder } from './commercial.js';

const store = await loadStore();
ensureCommercial(store);
const rate = new Map();
const webIndex = path.resolve(process.cwd(), 'web/index.html');
function json(res, status, data, extra = {}) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', 'permissions-policy': 'camera=(), microphone=(), geolocation=()', ...extra }); res.end(JSON.stringify(data)); }
function auth(req) { return req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}` && Boolean(process.env.ADMIN_TOKEN); }
function allowed(req) { const now = Date.now(), key = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'; const hit = rate.get(key) || { start: now, count: 0 }; if (now - hit.start > 60_000) { hit.start = now; hit.count = 0; } hit.count++; rate.set(key, hit); return hit.count <= Number(process.env.RATE_LIMIT_PER_MINUTE || 120); }
async function rawBody(req) { let raw = ''; for await (const chunk of req) raw += chunk; if (raw.length > 2_000_000) throw new Error('payload_too_large'); return raw; }
async function body(req) { const raw = await rawBody(req); if (!raw) return {}; return JSON.parse(raw); }
function route(req) { return new URL(req.url, 'http://localhost'); }
function originHeaders(req) { const configured = process.env.APP_ORIGIN; const requestOrigin = req.headers.origin; if (!configured || !requestOrigin || requestOrigin === configured) return configured ? { 'access-control-allow-origin': configured, vary: 'Origin' } : {}; return {}; }
function readiness() { return { service: 'marmopro-nucleo', supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), ai: Boolean(process.env.AI_API_URL && process.env.AI_API_KEY && process.env.AI_MODEL), billing: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET), whatsapp: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID), instagram: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID), facebook: Boolean(process.env.FACEBOOK_PAGE_ACCESS_TOKEN && process.env.FACEBOOK_PAGE_ID), adminAuth: Boolean(process.env.ADMIN_TOKEN), time: new Date().toISOString() }; }

export async function handle(req, res) {
  const cors = originHeaders(req);
  if (req.method === 'OPTIONS') return json(res, 204, null, { ...cors, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'Content-Type, Authorization', 'access-control-max-age': '600' });
  if (!allowed(req)) return json(res, 429, { error: 'rate_limit' }, cors);
  const url = route(req);
  try {
    if (req.method === 'POST' && url.pathname === '/api/billing/webhook') { const raw = await rawBody(req); const result = await handleStripeWebhook(raw, req.headers['stripe-signature']); return json(res, 200, result, cors); }
    if (req.method === 'GET' && url.pathname === '/') { const html = await fs.readFile(webIndex, 'utf8'); res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer', ...cors }); return res.end(html); }
    if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/api/health')) return json(res, 200, { ok: true, ...readiness() }, cors);
    if (req.method === 'GET' && url.pathname === '/api/ready') { const status = readiness(); const ready = status.supabase && status.adminAuth; return json(res, ready ? 200 : 503, { ready, ...status }, cors); }
    if (req.method === 'GET' && url.pathname === '/api/dashboard') return json(res, 200, { leads: store.leads.length, conversations: store.conversations.length, messages: store.messages.length, campaigns: store.campaigns.length, escalations: store.conversations.filter(c => c.escalated).length, commercial: commercialDashboard(store) }, cors);
    if (req.method === 'GET' && url.pathname === '/api/commercial/dashboard') return json(res, 200, commercialDashboard(store), cors);
    if (req.method === 'GET' && url.pathname === '/api/projects') return json(res, 200, store.projects, cors);
    if (req.method === 'POST' && url.pathname === '/api/projects') { const project = createProject(store, await body(req)); await saveStore(store); return json(res, 201, project, cors); }
    if (req.method === 'POST' && url.pathname === '/api/technical-analyses') { const analysis = createTechnicalAnalysis(store, await body(req)); await saveStore(store); return json(res, 201, analysis, cors); }
    if (req.method === 'GET' && url.pathname === '/api/technical-analyses') return json(res, 200, store.technicalAnalyses, cors);
    if (req.method === 'GET' && url.pathname === '/api/budgets') return json(res, 200, store.budgets, cors);
    if (req.method === 'POST' && url.pathname === '/api/budgets') { const budget = createBudget(store, await body(req)); await saveStore(store); return json(res, 201, budget, cors); }
    if (req.method === 'PATCH' && url.pathname.startsWith('/api/budgets/')) { const budget = updateBudget(store, url.pathname.split('/').pop(), await body(req)); if (!budget) return json(res, 404, { error: 'budget_not_found' }, cors); await saveStore(store); return json(res, 200, budget, cors); }
    if (req.method === 'GET' && url.pathname === '/api/orders') return json(res, 200, store.orders, cors);
    if (req.method === 'POST' && url.pathname === '/api/orders') { const order = createOrder(store, await body(req)); await saveStore(store); return json(res, 201, order, cors); }
    if (req.method === 'PATCH' && url.pathname.startsWith('/api/orders/')) { const order = updateOrder(store, url.pathname.split('/').pop(), await body(req)); if (!order) return json(res, 404, { error: 'order_not_found' }, cors); await saveStore(store); return json(res, 200, order, cors); }
    if (req.method === 'GET' && url.pathname === '/api/plans') return json(res, 200, await listPlans(), cors);
    if (req.method === 'GET' && url.pathname === '/api/marketing/dashboard') return json(res, 200, marketingDashboard(store), cors);
    if (req.method === 'GET' && url.pathname === '/api/integrations') return json(res, 200, integrationStatus(), cors);
    if (req.method === 'POST' && url.pathname === '/api/billing/checkout') { const data = await body(req); const result = await createCheckout({ planKey: data.planKey, companyName: data.companyName, email: data.email }); return json(res, 201, result, cors); }
    if (req.method === 'POST' && url.pathname === '/api/leads') { const data = await body(req); if (!data.name && !data.phone && !data.email) return json(res, 400, { error: 'lead_identifier_required' }, cors); const lead = { id: id('lead'), name: data.name || '', phone: data.phone || '', email: data.email || '', source: data.source || 'direct', campaignId: data.campaignId || null, status: 'new', createdAt: new Date().toISOString() }; store.leads.push(lead); await saveStore(store); return json(res, 201, lead, cors); }
    if (req.method === 'POST' && url.pathname === '/api/chat') { const data = await body(req); if (!data.message || typeof data.message !== 'string') return json(res, 400, { error: 'message_required' }, cors); const conversationId = data.conversationId || randomUUID(); let conversation = store.conversations.find(c => c.id === conversationId); if (!conversation) { conversation = { id: conversationId, escalated: false, createdAt: new Date().toISOString() }; store.conversations.push(conversation); } const answer = await replyToMessage(data.message, data.context); conversation.escalated ||= answer.escalate; store.messages.push({ id: id('msg'), conversationId, role: 'user', text: data.message, createdAt: new Date().toISOString() }); store.messages.push({ id: id('msg'), conversationId, role: 'assistant', text: answer.text, intent: answer.intent, createdAt: new Date().toISOString() }); await saveStore(store); return json(res, 200, { conversationId, ...answer }, cors); }
    if (req.method === 'POST' && url.pathname === '/api/campaigns') { if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' }, cors); const campaign = createCampaign(await body(req)); store.campaigns.push(campaign); await saveStore(store); return json(res, 201, campaign, cors); }
    if (req.method === 'POST' && url.pathname === '/api/campaigns/metrics') { if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' }, cors); const data = await body(req); const campaign = store.campaigns.find(c => c.id === data.campaignId); if (!campaign) return json(res, 404, { error: 'campaign_not_found' }, cors); updateCampaignMetrics(campaign, data); await saveStore(store); return json(res, 200, campaign, cors); }
    if (req.method === 'POST' && url.pathname === '/api/marketing/brief') { if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' }, cors); return json(res, 200, generateMarketingBrief(await body(req)), cors); }
    if (req.method === 'POST' && url.pathname === '/api/messages/send') { if (!auth(req)) return json(res, 401, { error: 'admin_auth_required' }, cors); const data = await body(req); if (!data.channel || !data.recipient || !data.text) return json(res, 400, { error: 'channel_recipient_text_required' }, cors); const result = await sendMessage(data.channel, data.recipient, data.text); store.events.push({ id: id('evt'), type: 'message_send', ...result, createdAt: new Date().toISOString() }); await saveStore(store); return json(res, 202, result, cors); }
    return json(res, 404, { error: 'not_found' }, cors);
  } catch (error) { console.error(error); return json(res, 400, { error: error.message || 'bad_request' }, cors); }
}
