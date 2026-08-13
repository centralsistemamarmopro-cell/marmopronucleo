import test from 'node:test';
import assert from 'node:assert/strict';
import { createCampaign, updateCampaignMetrics, marketingDashboard, generateMarketingBrief } from '../server/marketing.js';

test('marketing campaign validates channel and creates metrics', () => {
  const campaign = createCampaign({ name: 'Campanha Teste', channel: 'instagram', objective: 'lead_generation' });
  assert.equal(campaign.channel, 'instagram');
  assert.equal(campaign.metrics.leads, 0);
  updateCampaignMetrics(campaign, { metric: 'leads', value: 3 });
  assert.equal(campaign.metrics.leads, 3);
});

test('marketing dashboard calculates cost per conversion', () => {
  const result = marketingDashboard({
    leads: [{ id: 'l1' }, { id: 'l2' }],
    campaigns: [{ status: 'active', channel: 'instagram', leadIds: ['l1'], metrics: { spend: 100, conversions: 4 } }]
  });
  assert.equal(result.activeCampaigns, 1);
  assert.equal(result.costPerConversion, 25);
});

test('marketing brief applies guardrails', () => {
  const brief = generateMarketingBrief({ objective: 'vendas', audience: 'arquitetos' });
  assert.equal(brief.objective, 'vendas');
  assert.ok(brief.guardrails.includes('respeitar LGPD e opt-out'));
});
