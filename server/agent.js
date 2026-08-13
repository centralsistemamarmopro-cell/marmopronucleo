const escalationTerms = /humano|atendente|reclamação|reclamacao|cancelar|urgente|problema grave/i;

export function replyToMessage(input, context = {}) {
  const text = String(input || '').trim();
  if (!text) return { text: 'Pode me contar um pouco mais para eu te ajudar?', intent: 'unknown', escalate: false };

  if (escalationTerms.test(text)) {
    return { text: 'Entendi. Vou encaminhar seu atendimento para uma pessoa da equipe para cuidar disso com você.', intent: 'escalation', escalate: true };
  }
  if (/orçamento|orcamento|preço|preco|valor|cotação|cotacao/i.test(text)) {
    return { text: 'Claro. Posso organizar seu pedido de orçamento. Me diga o material, as medidas aproximadas e, se tiver, envie uma foto ou referência.', intent: 'sales', escalate: false };
  }
  if (/prazo|entrega|pedido|status/i.test(text)) {
    return { text: 'Posso verificar o andamento. Me informe o número do pedido ou o nome usado no cadastro.', intent: 'order_status', escalate: false };
  }
  if (/olá|ola|oi|bom dia|boa tarde|boa noite/i.test(text)) {
    return { text: 'Olá! Sou o assistente do MarmoPro. Estou aqui para ajudar com orçamento, pedidos, suporte ou atendimento comercial. Como posso te ajudar?', intent: 'greeting', escalate: false };
  }
  return { text: `Entendi: “${text}”. Posso ajudar com orçamento, pedido, suporte ou encaminhar você para a equipe. Qual dessas opções você precisa?`, intent: 'general', escalate: false };
}
