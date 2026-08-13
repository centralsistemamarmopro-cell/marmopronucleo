# MarmoPro — Produção com Supabase

## Persistência

A aplicação usa PostgreSQL/Supabase para os dados operacionais. O arquivo `data/runtime.json` não é mais o armazenamento de produção.

## Variáveis obrigatórias

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

A `SUPABASE_SERVICE_ROLE_KEY` deve existir somente no ambiente do servidor/Vercel e nunca no Git.

## Tabelas principais

- `leads`
- `conversations`
- `messages`
- `campaigns`
- `events`

## Validação

Antes do deploy:

```bash
npm run check
npm test
```

Em produção, validar:

- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/leads`
- `POST /api/chat`
- `GET /api/integrations`

## Segurança

RLS permanece habilitado no banco. A chave service role é usada exclusivamente pelo backend para operações administrativas; nunca deve ser exposta ao navegador.
