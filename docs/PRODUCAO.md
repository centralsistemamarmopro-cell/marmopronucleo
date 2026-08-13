# MarmoPro Núcleo — Produção

## Objetivo

Este documento define a passagem do núcleo para produção sem colocar credenciais no Git.

## Serviços

- PostgreSQL/Supabase: persistência, autenticação e políticas RLS.
- API Node.js: regras de negócio, CRM, suporte, agentes e webhooks.
- Vercel: deploy do painel/API compatível com a arquitetura atual.
- Provedor de IA: configurado somente por variáveis de ambiente.
- Meta/WhatsApp: tokens e IDs configurados somente como secrets.

## Configuração obrigatória

Copiar `.env.example` para o ambiente de execução e preencher os secrets no provedor de deploy.

Nunca versionar `.env` ou tokens.

## Health check

`GET /health` deve responder JSON com status operacional e timestamp.

## Segurança

- Validar autenticação antes de operações privadas.
- Aplicar RBAC por organização.
- Aplicar rate limiting.
- Validar payloads de entrada.
- Registrar eventos de auditoria sem armazenar segredos.
- Webhooks devem validar assinatura quando o provedor exigir.

## Operação

1. Rodar `npm run check`.
2. Rodar `npm test`.
3. Aplicar migrations no Supabase.
4. Configurar secrets.
5. Deploy em preview.
6. Validar health, autenticação, CRM e suporte.
7. Promover para produção.

## Critério de aceite

Nenhum segredo no Git, CI verde, migrations aplicadas, health check funcionando e fluxos críticos cobertos por testes.
