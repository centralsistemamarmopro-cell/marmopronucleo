# Módulo de Produção — MarmoPro

## Objetivo
Centralizar o fluxo da fábrica desde a ordem de produção até qualidade e expedição, usando o Supabase como fonte operacional.

## Fluxo

`Pedido → OP → Planejamento → Corte → Beneficiamento → Acabamento → Qualidade → Pronto → Expedição → Entrega`

## Tela operacional

- Indicadores: ordens, tarefas, atrasadas e movimentações de estoque.
- Lista de ordens com status, prioridade, prazo e cliente.
- Filtro por status.
- Fila de tarefas.
- Criação e alteração de OP protegidas por `ADMIN_TOKEN`.
- Chatbot/agente humanizado no mesmo ambiente.

## API

- `GET /api/production/dashboard`
- `GET /api/production/orders`
- `POST /api/production/orders` — admin
- `PATCH /api/production/orders/:id` — admin
- `GET /api/health` inclui saúde da conexão de produção.

## Banco

O módulo usa `organizations`, `customers`, `production_orders`, `production_items`, `tasks` e `stock_movements` já existentes no schema do MarmoPro. A aplicação usa a API REST do Supabase com a service role apenas no servidor.

## Segurança

O `SUPABASE_SERVICE_ROLE_KEY` nunca vai para o navegador. Operações de escrita exigem `ADMIN_TOKEN`. O navegador mantém esse token apenas em `sessionStorage` quando o operador o informa.

## Próximas extensões

1. Etapas e apontamentos de máquina.
2. Controle de qualidade com fotos e não conformidades.
3. Expedição e comprovante de entrega.
4. Planejamento automático por capacidade.
5. Agente de IA para gargalos, atrasos e sequência de produção.
