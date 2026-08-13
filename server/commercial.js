import { id } from './store.js';

export const COMMERCIAL_STAGES = [
  'ORÇAMENTO','REVISÃO TÉCNICA','APROVAÇÃO','PEDIDO','MEDIÇÃO','LIBERAÇÃO','PRODUÇÃO','RETIRADA','ENTREGA','INSTALAÇÃO'
];

function num(value) { const n = Number(value); return Number.isFinite(n) ? n : 0; }
function calc(items = [], discountPct = 0) {
  const subtotal = items.reduce((s, i) => s + num(i.qty) * num(i.unitPrice), 0);
  const discount = subtotal * Math.max(0, Math.min(100, num(discountPct))) / 100;
  const total = subtotal - discount;
  const cost = items.reduce((s, i) => s + num(i.qty) * num(i.unitCost), 0);
  const margin = total - cost;
  return { subtotal, discount, total, cost, margin, marginPct: total ? (margin / total) * 100 : 0 };
}

export function ensureCommercial(store) {
  store.companies ||= [];
  store.projects ||= [];
  store.technicalAnalyses ||= [];
  store.budgets ||= [];
  store.orders ||= [];
  store.services ||= [];
  store.materials ||= [];
  return store;
}

export function commercialDashboard(store) {
  ensureCommercial(store);
  return {
    attention: store.orders.filter(o => ['MEDIÇÃO','LIBERAÇÃO','PRODUÇÃO','RETIRADA'].includes(o.stage) && o.attention),
    orders: store.orders,
    budgets: store.budgets,
    projects: store.projects,
    counts: { projects: store.projects.length, budgets: store.budgets.length, orders: store.orders.length }
  };
}

export function createProject(store, data) {
  ensureCommercial(store);
  const project = { id: id('proj'), companyId: data.companyId || 'default', clientId: data.clientId || null, clientName: data.clientName || '', architect: data.architect || '', name: data.name || 'Novo projeto', files: data.files || [], status: 'RECEBIDO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.projects.push(project); return project;
}

export function createTechnicalAnalysis(store, data) {
  ensureCommercial(store);
  const analysis = { id: id('tech'), projectId: data.projectId, status: 'REVISÃO HUMANA', extracted: data.extracted || {}, notes: data.notes || '', sourceFiles: data.sourceFiles || [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.technicalAnalyses.push(analysis); return analysis;
}

export function createBudget(store, data) {
  ensureCommercial(store);
  const items = Array.isArray(data.items) ? data.items : [];
  const budget = { id: id('orc'), number: data.number || `ORC-${String(store.budgets.length + 1).padStart(5,'0')}`, projectId: data.projectId, companyId: data.companyId || 'default', title: data.title || 'Orçamento', version: num(data.version) || 1, items, discountPct: num(data.discountPct), status: 'RASCUNHO', ...calc(items, data.discountPct), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.budgets.push(budget); return budget;
}

export function updateBudget(store, budgetId, data) {
  ensureCommercial(store);
  const budget = store.budgets.find(b => b.id === budgetId);
  if (!budget) return null;
  if (data.items) budget.items = data.items;
  if (data.discountPct !== undefined) budget.discountPct = num(data.discountPct);
  if (data.status) budget.status = data.status;
  Object.assign(budget, calc(budget.items, budget.discountPct), { updatedAt: new Date().toISOString() });
  return budget;
}

export function createOrder(store, data) {
  ensureCommercial(store);
  const order = { id: id('ped'), number: data.number || `PED-${String(store.orders.length + 1).padStart(5,'0')}`, projectId: data.projectId, budgetId: data.budgetId || null, clientName: data.clientName || '', stage: data.stage || 'PEDIDO', attention: Boolean(data.attention), responsible: data.responsible || '', notes: data.notes || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.orders.push(order); return order;
}

export function updateOrder(store, orderId, data) {
  ensureCommercial(store);
  const order = store.orders.find(o => o.id === orderId);
  if (!order) return null;
  Object.assign(order, data, { updatedAt: new Date().toISOString() });
  return order;
}
