const escalationTerms = /humano|atendente|reclamação|reclamacao|cancelar|urgente|problema grave/i;
const intentRules = [
  ['sales', /orçamento|orcamento|preço|preco|valor|cotação|cotacao/i],
  ['order_status', /prazo|entrega|pedido|status/i],
  ['greeting', /olá|ola|oi|bom dia|boa tarde|boa noite/i]
];

function classify(text) {
  if (escalationTerms.test(text)) return 'escalation';
  return intentRules.find(([, rule]) => rule.test(text))?.[0] || 'general';
}

function fallback(text) {
  const intent = classify(text);
  if (intent === 'escalation') return { text: 'Entendi. Vou encaminhar seu atendimento para uma pessoa da equipe para cuidar disso com você.', intent, escalate: true };
  if (intent === 'sales') return { text: 'Claro. Posso organizar seu pedido de orçamento. Me diga o material, as medidas aproximadas e, se tiver, envie uma foto ou referência.', intent, escalate: false };
  if (intent === 'order_status') return { text: 'Posso verificar o andamento. Me informe o número do pedido ou o nome usado no cadastro.', intent, escalate: false };
  if (intent === 'greeting') return { text: 'Olá! Sou o assistente do MarmoPro. Estou aqui para ajudar com orçamento, pedidos, suporte ou atendimento comercial. Como posso te ajudar?', intent, escalate: false };
  return { text: `Entendi: “${text}”. Posso ajudar com orçamento, pedido, suporte ou encaminhar você para a equipe. Qual dessas opções você precisa?`, intent, escalate: false };
}

async function aiReply(text, context) {
  const url = process.env.AI_API_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!url || !key || !model) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: 'system', content: 'Você é o assistente humanizado do MarmoPro. Seja claro, cordial e objetivo. Não invente preços, prazos ou informações. Quando houver pedido de humano, reclamação, cancelamento ou situação urgente, recomende encaminhamento para a equipe. Responda em português do Brasil.' },
          { role: 'user', content: JSON.stringify({ message: text, context: context || {} }) }
        ]
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const intent = classify(text);
    return { text: String(content), intent, escalate: intent === 'escalation' };
  } catch { return null; }
  finally { clearTimeout(timer); }
}

export async function replyToMessage(input, context = {}) {
  const text = String(input || '').trim();
  if (!text) return { text: 'Pode me contar um pouco mais para eu te ajudar?', intent: 'unknown', escalate: false };
  return (await aiReply(text, context)) || fallback(text);
}
