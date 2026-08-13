# Deploy MarmoPro Núcleo no Vercel

## Arquitetura
GitHub → Vercel → MarmoPro Núcleo → Supabase → Edge Functions (`integration-gateway` / `integration-webhook`).

## Configuração do projeto
- Framework: Other
- Root Directory: `/`
- Build Command: `npm run check`
- Install Command: `npm install`
- Output Directory: deixar vazio
- Node.js: 20.x

## Variáveis de ambiente
Configure no Vercel, sem colocar segredos no Git:

- `ADMIN_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (somente backend/servidor)
- `RATE_LIMIT_PER_MINUTE` (opcional; padrão 120)

As chaves reais devem vir do projeto Supabase MarmoPro Master.

## Deploy
Cada push em `main` deve gerar um novo deployment. O endpoint `/api/health` deve retornar `ok: true` após o deploy.

## Segurança
Nunca commitar `.env`, tokens, service-role keys ou credenciais de WhatsApp/Meta/Google. Use apenas variáveis de ambiente do Vercel/Supabase.
