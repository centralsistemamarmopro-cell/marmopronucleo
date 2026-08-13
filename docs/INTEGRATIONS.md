# MarmoPro — Integrações

## Núcleo
- Supabase: banco, Auth, Storage, Realtime e Edge Functions.
- Vercel: aplicação/deploy.
- GitHub: versionamento e CI/CD.

## Canais
- WhatsApp Business/Cloud API
- Instagram Messaging
- Facebook Messenger
- E-mail/Google Workspace

## Inteligência
- Agente comercial
- Agente de atendimento humanizado
- Agente de orçamento
- Agente de leitura/validação de documentos e plantas
- Agente de marketing
- Agente de produção

## Fluxo padrão
1. Canal externo envia evento.
2. `integration-webhook` recebe e valida autenticação/assinatura específica do provedor.
3. Evento é persistido em `integration_events`.
4. Orquestrador identifica organização, cliente e contexto.
5. Agente apropriado processa.
6. Resultado é persistido e, quando necessário, enviado ao canal externo.
7. Falhas entram em fila/retry e são registradas para auditoria.

## Segredos
Nunca armazenar tokens em código, banco público ou Git. Usar secrets/env vars do ambiente de execução.

## Status
A infraestrutura-base já está implantada no Supabase. As conexões com provedores externos ficam condicionadas às credenciais e IDs oficiais de cada conta.