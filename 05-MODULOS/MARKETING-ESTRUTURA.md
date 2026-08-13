# MarmoPro — Estrutura completa de Marketing

## 1. Núcleo
- Dashboard de marketing
- Campanhas e objetivos
- Segmentos e públicos
- Conteúdo por canal
- Calendário editorial
- Jornada de lead
- Automações
- Consentimento e opt-out
- Métricas e atribuição
- Aprovação e auditoria

## 2. Canais
Instagram, Facebook, WhatsApp, TikTok, LinkedIn e e-mail entram por adaptadores. O núcleo não conhece detalhes de APIs externas.

## 3. Funil
```text
Origem -> Campanha -> Conteúdo -> Lead -> Qualificação -> Atendimento -> Orçamento -> Venda -> Pós-venda
```

## 4. API
- `GET /api/marketing/dashboard`
- `POST /api/campaigns`
- `POST /api/campaigns/metrics`
- `POST /api/marketing/brief`
- `POST /api/leads` com `campaignId`
- `POST /api/messages/send`

Rotas administrativas exigem `Authorization: Bearer <ADMIN_TOKEN>`.

## 5. Agente de Marketing
O agente deve planejar campanhas, sugerir públicos, gerar briefings, identificar leads sem acompanhamento e recomendar ações. Toda publicação deve respeitar aprovação, consentimento e regras comerciais.

## 6. Automações prioritárias
1. Lead novo -> registrar origem e campanha.
2. Lead sem resposta -> criar tarefa de follow-up.
3. Orçamento enviado -> sequência de acompanhamento autorizada.
4. Cliente inativo -> campanha de reativação com opt-out.
5. Pós-venda -> pedido de avaliação/indicação.

## 7. KPIs
Leads, leads qualificados, conversões, alcance, impressões, engajamento, cliques, investimento, CPL, CPA, taxa de conversão e receita atribuída.

## 8. Segurança
Dados por empresa/unidade, RLS no Supabase, tokens somente em secrets, auditoria das ações administrativas e respeito à LGPD/consentimento.
