# MarmoPro — núcleo da plataforma

O MarmoPro agora possui uma camada web em Next.js conectada ao projeto Supabase do núcleo.

## Arquitetura inicial

- **Web:** Next.js + React + TypeScript
- **Dados:** Supabase/PostgreSQL
- **Segurança:** Supabase Auth + Row Level Security
- **SaaS:** organizações e membros por empresa
- **Núcleo existente:** CRM, leads, orçamentos, produção, materiais, tarefas, documentos e agentes

## Variáveis do frontend

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

A chave publishable pode estar no navegador quando as tabelas expostas estiverem protegidas por RLS. Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## Primeiro fluxo funcional

1. Usuário entra/cria acesso.
2. O sistema identifica as organizações das quais ele é membro.
3. O usuário entra no workspace da marmoraria.
4. O dashboard consulta dados persistidos do workspace.
5. A navegação já separa CRM, orçamento, pedido, desenho, produção, estoque, instalação, financeiro, agentes e configurações.

## Próximas etapas de construção

1. CRM completo com cadastro e histórico.
2. Orçamento completo com ambientes, alternativas e PDF.
3. Conversão automática de orçamento aprovado em pedido.
4. Desenho técnico versionado.
5. Kanban de produção.
6. Estoque e movimentações.
7. Agenda de instalação.
8. Financeiro.
9. Documentos e templates por empresa.
10. Automações por eventos.
11. Agentes configuráveis por empresa.

## Publicação

O repositório está preparado para ser importado como projeto Next.js na Vercel. A documentação oficial da Vercel oferece suporte de primeira classe para Next.js.
