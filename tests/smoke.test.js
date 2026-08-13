import test from 'node:test';
import assert from 'node:assert/strict';
import { replyToMessage } from '../server/agent.js';

test('agent responds to greeting', () => {
  const result = replyToMessage('Olá');
  assert.equal(result.intent, 'greeting');
  assert.equal(result.escalate, false);
});

test('agent escalates human requests', () => {
  const result = replyToMessage('quero falar com um humano');
  assert.equal(result.intent, 'escalation');
  assert.equal(result.escalate, true);
});
