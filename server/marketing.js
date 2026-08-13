import { id } from './store.js';

const VALID_CHANNELS = new Set(['instagram', 'facebook', 'whatsapp', 'tiktok', 'linkedin', 'email', 'internal']);
const VALID_STATUSES = new Set(['draft', 'scheduled', 'active', 'paused', 'completed']);

export function createCampaign(data) {
  if (!data?.name) throw new Error('campaign_name_required');
  const channel = data.channel || 'internal';
  if (!VALID_CHANNELS.has(channel)) throw new Error('invalid_campaign_channel');
  const status = data.status || 'draft';
  if (!VALID_STATUSES.has(status)) throw new Error('invalid_campaign_status');
  return {
    id: id('campaign'), name: data.name, objective: data.objective || 'lead_generation',
    channel, status, audience: data.audience || {}, budget: Number(data.budget || 0),
    content: data.content || { title: '', body: '', media: [] },
    utm: data.utm || {}, startsAt: data.startsAt || null, endsAt: data.endsAt || null,
    metrics: { reach: 0, impressions: 0, engagements: 0, clicks: 0, leads: 0, conversions: 0, spend: 0 },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
}

export function updateCampaignMetrics(campaign, event = {}) {
  const metric = String(event.metric || '');
  if (!(metric in campaign.metrics)) throw new Error('invalid_campaign_metric');
  const value = Number(event.value);
  if (!Number.isFinite(value) || value < 0) throw new Error('invalid_metric_value');
  campaign.metrics[metric] += value;
  campaign.updatedAt = new Date().toISOString();
  return campaign;
}

export function marketingDashboard(store) {
  const campaigns = store.campaigns || [];
  const leads = store.leads || [];
  const active = campaigns.filter(c => c.status === 'active' || c.status === 'scheduled').length;
  const spend = campaigns.reduce((n, c) => n + Number(c.metrics?.spend || 0), 0);
  const conversions = campaigns.reduce((n, c) => n + Number(c.metrics?.conversions || 0), 0);
  const campaignLeadIds = new Set(campaigns.flatMap(c => c.leadIds || []));
  return {
    campaigns: campaigns.length, activeCampaigns: active, leads: leads.length,
    attributedLeads: campaignLeadIds.size, spend, conversions,
    costPerConversion: conversions ? Number((spend / conversions).toFixed(2)) : 0,
    channels: [...new Set(campaigns.map(c => c.channel).filter(Boolean))]
  };
}

export function generateMarketingBrief(input = {}) {
  const audience = input.audience || 'clientes e parceiros do MarmoPro';
  const objective = input.objective || 'gerar leads qualificados';
  const offer = input.offer || 'soluções MarmoPro';
  return {
    objective, audience, offer,
    angle: 'benefício + prova + chamada para ação',
    cta: 'Fale com a equipe MarmoPro e solicite um atendimento.',
    channels: ['instagram', 'facebook', 'whatsapp'],
    guardrails: ['não inventar preços', 'não prometer prazos não confirmados', 'respeitar LGPD e opt-out']
  };
}
