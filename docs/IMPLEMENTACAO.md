# Implementação MarmoPro

## Estado consolidado

A fundação do MarmoPro Núcleo está versionada no GitHub e conectada ao projeto Supabase de produção/desenvolvimento. O repositório contém API, dashboard, CRM inicial, chatbot, agentes, marketing, billing, adaptadores de canais, persistência, testes e CI.

## Entregue

- API HTTP e health check.
- Endpoint de readiness (`/api/ready`) que verifica dependências críticas sem expor segredos.
- Dashboard web inicial.
- Cadastro de leads.
- Conversas e histórico do chatbot.
- Agente humanizado com escalonamento para atendimento humano.
- Módulo de campanhas/marketing com autenticação administrativa.
- Adaptadores isolados para WhatsApp, Instagram e Facebook.
- Billing/checkout e webhook Stripe com segredos somente por ambiente.
- Persistência local atômica para desenvolvimento.
- Persistência remota compatível com Supabase Runtime State quando as variáveis de servidor estão configuradas.
- PostgreSQL/Supabase com organizações, usuários, RBAC, clientes, leads, produtos, orçamento, produção, estoque, tarefas, agentes, integrações, auditoria, consentimento e billing.
- RLS habilitado nas tabelas públicas.
- Índices e constraints de integridade na base.
- Hardening de funções SECURITY DEFINER e `search_path` das funções conhecidas.
- Limite de requisições, limite de payload e headers de segurança.
- CORS restrito ao `APP_ORIGIN` configurado.
- CI com verificação sintática e testes automatizados.

## Testes

O pipeline do GitHub Actions deve executar, no mínimo:

```bash
npm run check
npm test
```

Os testes cobrem intenção do agente, escalonamento humano e comportamento seguro dos adaptadores quando um canal não está configurado.

## Produção — somente configuração externa

A implementação de código está preparada. A ativação real de serviços de terceiros depende de credenciais pertencentes ao proprietário da operação:

1. Configurar variáveis/secrets no ambiente de deploy.
2. Configurar domínio e `APP_ORIGIN`.
3. Configurar credenciais oficiais de Meta/WhatsApp/Instagram/Facebook.
4. Configurar provedor de IA e modelo aprovado.
5. Configurar Stripe em modo de teste, validar webhooks e só depois migrar para live.
6. Configurar monitoramento e alertas do ambiente de execução.

Nenhuma dessas credenciais deve ser enviada pelo chat ou commitada no Git.

## Regra de segurança

Nenhum token, senha, cookie, chave de API ou dado pessoal deve ser gravado no código ou commitado no Git. Use variáveis de ambiente/secrets. O service-role do Supabase é exclusivamente server-side.

## Critério de conclusão

O sistema pode ser considerado **tecnicamente preparado para implantação**, mas a operação não é declarada como "100% em produção" enquanto as credenciais externas, domínio e testes de integração reais não forem fornecidos. Isso evita marcar como concluída uma integração que ainda não pode ser validada contra o serviço externo.
