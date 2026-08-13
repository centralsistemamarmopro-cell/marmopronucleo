import { id } from './store.js';

export function createSeller(input = {}) {
  return { id: input.id || id('seller'), name: input.name || 'Novo vendedor', email: input.email || null, active: input.active !== false, monthlyGoal: Number(input.monthlyGoal || 0), createdAt: new Date().toISOString() };
}

export function sellerScope(store, sellerId) {
  const filter = (items = []) => items.filter(item => item.sellerId === sellerId);
  return { sellerId, projects: filter(store.projects), budgets: filter(store.budgets), orders: filter(store.orders), leads: filter(store.leads), technicalAnalyses: filter(store.technicalAnalyses) };
}

export function sellerDashboard(store, sellerId) {
  const scope = sellerScope(store, sellerId);
  const budgets = scope.budgets.filter(b => !['APROVADO','REJEITADO','CANCELADO'].includes(String(b.status || '').toUpperCase()));
  const orders = scope.orders.filter(o => !['CONCLUÍDO','CANCELADO'].includes(String(o.stage || '').toUpperCase()));
  const pending = [...budgets, ...orders].filter(item => item.attention || item.needsFollowUp);
  return { sellerId, counts: { projects: scope.projects.length, budgets: budgets.length, orders: orders.length, pending: pending.length }, projects: scope.projects, budgets, orders, pending };
}
