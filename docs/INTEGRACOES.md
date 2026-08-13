# MarmoPro — Integrações

## Núcleo

- Supabase: dados, autenticação, storage, realtime e Edge Functions.
- Vercel: aplicação e deploy.
- GitHub: versionamento e CI/CD.

## Canais previstos

- WhatsApp
- Instagram
- Facebook
- Google
- IA/Agentes
- Financeiro

## Padrão

As integrações externas não acessam diretamente tabelas internas sem controle. Eventos entram pelo gateway de integração, são registrados em `integration_events` e processados por funções específicas.

Segredos e credenciais ficam fora do código-fonte. Chaves públicas podem ser usadas no cliente conforme RLS; chaves secretas ficam exclusivamente no backend/Edge Functions.
