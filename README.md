# MarmoPro Núcleo

Base central do ecossistema MarmoPro: operação, CRM, marketing, suporte, agentes e integrações.

## O que já está funcionando

- API HTTP e health check.
- Dashboard web em `/`.
- Cadastro de leads.
- Chatbot com agente humanizado e escalonamento para humano.
- Métricas operacionais básicas.
- Campanhas de marketing protegidas por autenticação administrativa.
- Adaptadores isolados para WhatsApp, Instagram e Facebook.
- Persistência local para desenvolvimento.
- Modelo PostgreSQL/Supabase para produção.
- Testes e GitHub Actions CI.

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

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/integrations`
- `POST /api/leads`
- `POST /api/chat`
- `POST /api/campaigns` (admin)
- `POST /api/messages/send` (admin)

## Arquitetura

```text
Canais sociais / Web
        -> Webhooks/API
        -> CRM + Marketing
        -> Agent Router
        -> Agente / IA / Humano
        -> Persistência + Auditoria
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
13-DOCUMENTOS/       documentos e templates
14-SUPORTE/          suporte e atendimento
15-TESTES/            estratégia de testes
16-GOVERNANCA/       segurança, permissões e governança
```

## Próxima camada de produção

A documentação em `docs/IMPLEMENTACAO.md` define a migração para PostgreSQL/Supabase, autenticação/RBAC, provedor de IA, webhooks oficiais, filas, observabilidade e requisitos LGPD.
