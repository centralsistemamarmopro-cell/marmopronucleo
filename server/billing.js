import crypto from 'node:crypto';

const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = Boolean(base && key);
const headers = enabled ? { apikey: key, authorization: `Bearer ${key}`, accept: 'application/json', 'content-type': 'application/json' } : null;

async function db(path, options = {}) {
  if (!enabled) throw new Error('supabase_not_configured');
  const response = await fetch(`${base}/rest/v1/${path}`, { headers: { ...headers, ...(options.headers || {}) }, ...options });
  if (!response.ok) throw new Error(`supabase_${response.status}`);
  return response.status === 204 ? [] : response.json();
}

async function authAdmin(path, options = {}) {
  if (!enabled) throw new Error('supabase_not_configured');
  const response = await fetch(`${base}/auth/v1/admin/${path}`, { headers: { apikey: key, authorization: `Bearer ${key}`, accept: 'application/json', 'content-type': 'application/json' }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || `supabase_auth_${response.status}`);
  return data;
}

export async function listPlans() {
  return db('marmopro_plans?active=eq.true&order=sort_order.asc&select=key,name,description,monthly_price_brl,setup_price_brl');
}

async function getPlan(planKey) {
  const rows = await db(`marmopro_plans?key=eq.${encodeURIComponent(planKey)}&active=eq.true&select=id,key,name,description,monthly_price_brl,setup_price_brl&limit=1`);
  return rows[0] || null;
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || `marmopro-${Date.now()}`;
}

async function createOrganization(companyName) {
  const id = crypto.randomUUID();
  const slug = `${slugify(companyName)}-${id.slice(0, 8)}`;
  const rows = await db('organizations', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify({ id, name: companyName, slug, plan: 'pending' }) });
  return rows[0];
}

async function createPendingSubscription(organizationId, planId, email) {
  const rows = await db('marmopro_subscriptions', { method: 'POST', headers: { prefer: 'return=representation' }, body: JSON.stringify({ organization_id: organizationId, plan_id: planId, customer_email: email, status: 'pending' }) });
  return rows[0];
}

function stripeForm(data) {
  const params = new URLSearchParams();
  const walk = (value, prefix) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${prefix}[${i}]`));
    else if (typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, `${prefix}[${k}]`));
    else params.append(prefix, String(value));
  };
  Object.entries(data).forEach(([k, v]) => walk(v, k));
  return params;
}

async function stripe(path, data) {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('stripe_not_configured');
  const response = await fetch(`https://api.stripe.com/v1/${path}`, { method: 'POST', headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' }, body: stripeForm(data) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'stripe_request_failed');
  return payload;
}

export async function createCheckout({ planKey, companyName, email }) {
  if (!planKey || !companyName || !email) throw new Error('plan_company_email_required');
  const plan = await getPlan(planKey);
  if (!plan) throw new Error('plan_not_found');
  if (plan.key === 'custom') throw new Error('custom_plan_requires_contact');
  const organization = await createOrganization(companyName);
  const subscription = await createPendingSubscription(organization.id, plan.id, email);
  const origin = process.env.PUBLIC_APP_URL || 'http://localhost:3000';
  const items = [{ price_data: { currency: 'brl', product_data: { name: plan.name }, unit_amount: Math.round(Number(plan.monthly_price_brl) * 100), recurring: { interval: 'month' } }, quantity: 1 }];
  if (Number(plan.setup_price_brl) > 0) items.push({ price_data: { currency: 'brl', product_data: { name: `Implantação ${plan.name}` }, unit_amount: Math.round(Number(plan.setup_price_brl) * 100) }, quantity: 1 });
  const session = await stripe('checkout/sessions', {
    mode: 'subscription', customer_email: email,
    success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancelled`, line_items: items,
    'metadata[organization_id]': organization.id, 'metadata[subscription_id]': subscription.id, 'metadata[plan_key]': plan.key,
    'subscription_data[metadata][organization_id]': organization.id, 'subscription_data[metadata][subscription_id]': subscription.id, 'subscription_data[metadata][plan_key]': plan.key
  });
  await db(`marmopro_subscriptions?id=eq.${subscription.id}`, { method: 'PATCH', body: JSON.stringify({ stripe_checkout_session_id: session.id, stripe_customer_id: session.customer || null }) });
  return { checkoutUrl: session.url, sessionId: session.id, organizationId: organization.id, plan: plan.key };
}

function signatureIsValid(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const values = signature.split(',').reduce((acc, part) => { const [k, v] = part.split('=', 2); if (k && v) acc[k] = v; return acc; }, {});
  const timestamp = values.t, received = values.v1;
  if (!timestamp || !received) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function syncPlanEntitlements(organizationId, planId) {
  await db('rpc/marmopro_sync_entitlements', { method: 'POST', body: JSON.stringify({ p_organization_id: organizationId, p_plan_id: planId }) });
}

async function provisionAccess(current) {
  if (!current.customer_email || current.access_provisioned_at) return;
  let user = null;
  try {
    const invited = await authAdmin('invite', { method: 'POST', body: JSON.stringify({ email: current.customer_email, data: { organization_id: current.organization_id, marmopro_role: 'owner' }, redirect_to: `${process.env.PUBLIC_APP_URL || 'http://localhost:3000'}/` }) });
    user = invited?.user || invited;
  } catch {
    const page = await authAdmin('users?page=1&per_page=1000', { method: 'GET' });
    user = page?.users?.find(u => u.email?.toLowerCase() === current.customer_email.toLowerCase()) || null;
    if (!user) throw new Error('access_provisioning_failed');
  }
  if (user?.id) {
    await db('organization_members', { method: 'POST', headers: { prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ organization_id: current.organization_id, user_id: user.id, role: 'owner' }) });
    await db(`marmopro_subscriptions?id=eq.${current.id}`, { method: 'PATCH', body: JSON.stringify({ access_user_id: user.id, access_provisioned_at: new Date().toISOString() }) });
  }
}

async function activateSubscription(subscriptionId, stripeSubscription) {
  const rows = await db(`marmopro_subscriptions?id=eq.${subscriptionId}&select=id,organization_id,plan_id,customer_email,access_provisioned_at&limit=1`);
  const current = rows[0];
  if (!current) return;
  const status = stripeSubscription.status === 'active' ? 'active' : stripeSubscription.status;
  await db(`marmopro_subscriptions?id=eq.${subscriptionId}`, { method: 'PATCH', body: JSON.stringify({ status, stripe_subscription_id: stripeSubscription.id, stripe_customer_id: stripeSubscription.customer, current_period_start: stripeSubscription.current_period_start ? new Date(stripeSubscription.current_period_start * 1000).toISOString() : null, current_period_end: stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000).toISOString() : null, cancel_at_period_end: Boolean(stripeSubscription.cancel_at_period_end), activated_at: status === 'active' || status === 'trialing' ? new Date().toISOString() : null }) });
  if (status === 'active' || status === 'trialing') {
    const plan = (await db(`marmopro_plans?id=eq.${current.plan_id}&select=key&limit=1`))[0];
    await db(`organizations?id=eq.${current.organization_id}`, { method: 'PATCH', body: JSON.stringify({ plan: plan?.key || 'active', updated_at: new Date().toISOString() }) });
    await syncPlanEntitlements(current.organization_id, current.plan_id);
    await provisionAccess(current);
  } else if (['canceled', 'unpaid', 'incomplete_expired'].includes(status)) {
    await db(`marmopro_entitlements?organization_id=eq.${current.organization_id}&source=eq.plan`, { method: 'DELETE' });
  }
}

export async function handleStripeWebhook(rawBody, signature) {
  if (!signatureIsValid(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) throw new Error('invalid_stripe_signature');
  const event = JSON.parse(rawBody);
  const existing = await db(`marmopro_payment_events?event_id=eq.${encodeURIComponent(event.id)}&select=id&limit=1`);
  if (existing.length) return { received: true, duplicate: true };
  await db('marmopro_payment_events', { method: 'POST', body: JSON.stringify({ event_id: event.id, event_type: event.type, payload: event }) });
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object, subscriptionId = session.metadata?.subscription_id;
    if (subscriptionId) {
      await db(`marmopro_subscriptions?id=eq.${subscriptionId}`, { method: 'PATCH', body: JSON.stringify({ stripe_customer_id: session.customer || null, stripe_subscription_id: session.subscription || null }) });
      if (session.subscription && process.env.STRIPE_SECRET_KEY) {
        const subResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${session.subscription}`, { headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } });
        const sub = await subResponse.json();
        if (sub.id) await activateSubscription(subscriptionId, sub);
      }
    }
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const rows = await db(`marmopro_subscriptions?stripe_subscription_id=eq.${encodeURIComponent(sub.id)}&select=id&limit=1`);
    if (rows[0]) await activateSubscription(rows[0].id, sub);
    if (event.type === 'customer.subscription.deleted' && rows[0]) await db(`marmopro_subscriptions?id=eq.${rows[0].id}`, { method: 'PATCH', body: JSON.stringify({ status: 'canceled', canceled_at: new Date().toISOString() }) });
  }
  return { received: true };
}

export async function featureEnabled(organizationId, featureKey) {
  const value = await db('rpc/marmopro_has_feature', { method: 'POST', body: JSON.stringify({ p_organization_id: organizationId, p_feature_key: featureKey }) });
  return value === true || value?.[0] === true;
}
