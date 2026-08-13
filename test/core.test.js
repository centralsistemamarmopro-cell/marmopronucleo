import test from 'node:test';
import assert from 'node:assert/strict';
import { replyToMessage } from '../server/agent.js';
import { integrationStatus, sendMessage } from '../server/integrations.js';

test('agent handles greeting', () => {
  const result = replyToMessage('Oi');
  assert.equal(result.intent, 'greeting');
  assert.equal(result.escalate, false);
});

test('agent handles sales intent', () => {
  const result = replyToMessage('Quero um orçamento');
  assert.equal(result.intent, 'sales');
  assert.equal(result.escalate, false);
});

test('agent escalates human support requests', () => {
  const result = replyToMessage('Preciso falar com um atendente');
  assert.equal(result.intent, 'escalation');
  assert.equal(result.escalate, true);
});

test('agent handles order status', () => {
  const result = replyToMessage('Qual o status do meu pedido?');
  assert.equal(result.intent, 'order_status');
});

test('integration status exposes supported channels without secrets', () => {
  const status = integrationStatus();
  assert.deepEqual(Object.keys(status).sort(), ['facebook', 'instagram', 'whatsapp']);
  for (const channel of Object.values(status)) {
    assert.equal(channel.mode, 'adapter-ready');
    assert.equal(typeof channel.configured, 'boolean');
  }
});

test('unconfigured integration is safely queued', async () => {
  delete process.env.WHATSAPP_ACCESS_TOKEN;
  const result = await sendMessage('whatsapp', '5511999999999', 'Teste');
  assert.equal(result.queued, true);
  assert.equal(result.reason, 'integration_not_configured');
});

test('unsupported integration is rejected', async () => {
  await assert.rejects(
    () => sendMessage('telegram', 'recipient', 'Teste'),
    /Canal não suportado/
  );
});
