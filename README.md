# MarmoPro Núcleo

Base central do ecossistema MarmoPro: operação, CRM, marketing, suporte, agentes, integrações e licenciamento.

## Estado atual

A base de código, CI e schema de produção estão versionados no GitHub. O projeto Supabase conectado está ativo e recebeu as migrations de segurança, persistência e licenciamento comercial. O runtime usa Supabase quando `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão configurados e mantém fallback local para desenvolvimento.

## Comercial e licenciamento

O MarmoPro usa um único motor com módulos/recursos licenciáveis por organização.

| Plano | Mensalidade | Implantação |
|---|---:|---:|
| Start | R$ 149 | R$ 490 |
| Profissional | R$ 299 | R$ 990 |
| Premium | R$ 499 | R$ 1.990 |
| Enterprise | R$ 899 | R$ 3.990 |
| Custom | Sob consulta | Sob consulta |

A página de planos consulta o banco e envia o cliente ao checkout online. A liberação não depende do navegador: o webhook assinado atualiza a assinatura, sincroniza os recursos liberados e provisiona o acesso da organização.

## O que está funcionando

- API HTTP e health check em `/health` e `/api/health`.
- Dashboard web em `/` com seleção de planos.
- Checkout online por plano.
- Webhook de pagamento com assinatura, idempotência e atualização da assinatura.
- Licenciamento por organização, plano e recurso.
- Provisionamento de acesso após assinatura ativa.
- Cadastro de leads com origem/campanha.
- Chatbot com agente humanizado, classificação de intenção e escalonamento para humano.
- Integração opcional com provedor de IA compatível com Chat Completions.
- Persistência remota no Supabase com fallback local.
- Métricas operacionais e dashboard de marketing.
- Campanhas de marketing protegidas por autenticação administrativa.
- Briefing de marketing e atualização de métricas por campanha.
- Adaptadores isolados para WhatsApp, Instagram e Facebook.
- PostgreSQL/Supabase com organizações, membros, clientes, leads, conversas, mensagens, IA, integrações, produção, auditoria e RLS.
- Testes automatizados e GitHub Actions CI.
- Runbook de produção em `docs/PRODUCAO.md`.

## Executar localmente

Requisito: Node.js 20+.

```bash
npm run check
npm test
npm start
```

Abra `http://localhost:3000`.

Copie `.env.example` para `.env` quando precisar configurar integrações. Nunca coloque tokens no Git.

## API principal

- `GET /health`
- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/plans`
- `GET /api/marketing/dashboard`
- `GET /api/integrations`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- `POST /api/leads`
- `POST /api/chat`
- `POST /api/campaigns` (admin)
- `POST /api/campaigns/metrics` (admin)
- `POST /api/marketing/brief` (admin)
- `POST /api/messages/send` (admin)

## Configuração de produção

Preencha os secrets no ambiente de execução:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`
- `PUBLIC_APP_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `AI_API_URL`, `AI_API_KEY`, `AI_MODEL` (se IA externa for usada)
- credenciais Meta/WhatsApp/Instagram/Facebook

Configure no provedor de pagamento o webhook para `/api/billing/webhook` e mantenha as chaves somente como secrets do ambiente. O Supabase Auth precisa ter o envio de convites por e-mail configurado para que novos responsáveis recebam automaticamente o convite de acesso.

## Arquitetura

```text
Cliente
  -> Planos
  -> Checkout
  -> Webhook assinado
  -> Assinatura
  -> Plano
  -> Entitlements
  -> Organização + usuário
  -> Módulos liberados
```

Para a operação normal:

```text
Canais sociais / Web
        -> Webhooks/API
        -> CRM + Marketing
        -> Agent Router
        -> Agente / IA / Humano
        -> Supabase + Auditoria
```

Integrações externas ficam isoladas em adaptadores. Credenciais entram somente por variáveis de ambiente/secrets.

## Estrutura documental

```text
00-DOCUMENTO-MAE/    visão geral e princípios
01-REGRAS-GERAIS/    regras operacionais e técnicas
02-ARQUITETURA/      arquitetura e camadas
03-DECISOES/         decisões arquiteturais
04-PROCESSOS/        processos e fluxos
05-MODULOS/          módulos do produto
06-AGENTES/          agentes inteligentes
07-INTELIGENCIA/     IA, contexto, memória e roteamento
08-ANTI-BUG/         prevenção, observabilidade e recuperação
09-BANCO-DE-DADOS/   modelo e contratos de dados
10-INTEGRACOES/      integrações externas
11-EMPRESAS/         estruturas por empresa/unidade
12-IDENTIDADE/       identidade e padrões de comunicação
13-DOCUMENTOS/       documentos, templates e licenciamento
14-SUPORTE/          suporte e atendimento
15-TESTES/            estratégia de testes
16-GOVERNANCA/       segurança, permissões e governança
docs/                runbooks e implementação
supabase/migrations/ schema versionado
```

## Critério para produção

CI verde, migrations aplicadas, secrets configurados, webhook de pagamento validado, Auth configurado para convites, health check respondendo e validação dos fluxos críticos antes da abertura pública.
