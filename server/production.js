import { randomUUID } from 'node:crypto';

const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function configured() { return Boolean(base && key); }
async function supabase(path, options = {}) {
  if (!configured()) throw new Error('supabase_not_configured');
  const response = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.method === 'POST' || options.method === 'PATCH' ? 'return=representation' : undefined,
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!response.ok) throw new Error(data?.message || data?.hint || data?.error || `supabase_${response.status}`);
  return data;
}

async function organizationId(input) {
  if (input) return input;
  if (process.env.DEFAULT_ORGANIZATION_ID) return process.env.DEFAULT_ORGANIZATION_ID;
  const rows = await supabase('organizations?select=id&limit=2');
  if (rows.length !== 1) throw new Error('organization_id_required');
  return rows[0].id;
}

export async function productionDashboard(orgId) {
  const organization_id = await organizationId(orgId);
  const [orders, tasks, movements] = await Promise.all([
    supabase(`production_orders?organization_id=eq.${encodeURIComponent(organization_id)}&select=id,order_number,status,priority,due_date,customer_id,created_at&order=due_date.asc.nullslast`),
    supabase(`tasks?organization_id=eq.${encodeURIComponent(organization_id)}&production_order_id=not.is.null&select=id,title,status,priority,due_at,production_order_id&order=due_at.asc.nullslast`),
    supabase(`stock_movements?select=id,material_id,movement_type,quantity,production_order_id,created_at&production_order_id=not.is.null&order=created_at.desc&limit=500`)
  ]);
  const byStatus = orders.reduce((acc, row) => { acc[row.status] = (acc[row.status] || 0) + 1; return acc; }, {});
  const late = orders.filter(o => o.due_date && !['completed','delivered','cancelled'].includes(o.status) && new Date(o.due_date) < new Date()).length;
  return { organizationId: organization_id, totals: { orders: orders.length, tasks: tasks.length, stockMovements: movements.length, late }, byStatus, orders, tasks, movements };
}

export async function listProductionOrders(orgId, status) {
  const organization_id = await organizationId(orgId);
  const filter = status ? `&status=eq.${encodeURIComponent(status)}` : '';
  return supabase(`production_orders?organization_id=eq.${encodeURIComponent(organization_id)}&select=*,customers(name,phone),production_items(*)&order=created_at.desc${filter}`);
}

export async function createProductionOrder(data) {
  const organization_id = await organizationId(data.organizationId);
  if (!data.orderNumber) throw new Error('order_number_required');
  const order = (await supabase('production_orders', { method: 'POST', body: JSON.stringify({
    id: randomUUID(), organization_id, order_number: data.orderNumber, customer_id: data.customerId || null,
    lead_id: data.leadId || null, due_date: data.dueDate || null, priority: data.priority || 'normal',
    status: data.status || 'pending', notes: data.notes || null
  }) }))[0];
  if (Array.isArray(data.items) && data.items.length) {
    await supabase('production_items', { method: 'POST', body: JSON.stringify(data.items.map(item => ({
      id: randomUUID(), production_order_id: order.id, product_id: item.productId || null,
      description: item.description || 'Item de produção', quantity: Number(item.quantity || 1), unit: item.unit || 'un',
      measurements: item.measurements || {}, status: 'pending'
    }))) });
  }
  return order;
}

export async function updateProductionOrder(id, data) {
  if (!id) throw new Error('production_order_id_required');
  const patch = {};
  for (const key of ['status','priority','due_date','notes','customer_id']) if (data[key] !== undefined) patch[key] = data[key];
  if (!Object.keys(patch).length) throw new Error('no_changes');
  return (await supabase(`production_orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }))[0];
}

export async function productionHealth() {
  if (!configured()) return { connected: false, reason: 'supabase_not_configured' };
  try { await supabase('production_orders?select=id&limit=1'); return { connected: true }; }
  catch (error) { return { connected: false, reason: error.message }; }
}
