# MarmoPro — Produção Operacional

## Objetivo
Transformar o módulo de produção em uma fila visual de fábrica, mantendo pedido, cliente, material, tarefas, qualidade e expedição vinculados ao mesmo registro.

## Fluxo padrão
1. Pedido liberado
2. Ordem de produção criada
3. Planejamento
4. Corte
5. Beneficiamento
6. Acabamento
7. Qualidade
8. Pronto para expedição
9. Expedido
10. Entregue

## Regras
- OP deve possuir número único dentro da organização.
- Alterações de status e prioridade exigem autenticação administrativa.
- Prazo vencido gera indicador de atraso.
- A OP não deve ser considerada concluída enquanto houver tarefa operacional pendente.
- Movimentações de estoque devem permanecer vinculadas à OP quando originadas da produção.
- Cliente, pedido e produto devem ser selecionados de registros existentes sempre que disponíveis; evitar redigitação.
- Chaves privilegiadas do Supabase permanecem exclusivamente no servidor.

## Painel
Indicadores mínimos:
- OPs abertas
- OPs em produção
- OPs atrasadas
- OPs concluídas
- tarefas pendentes
- movimentações de estoque

## Próxima camada
- Kanban por etapa
- apontamento de início/fim
- checklist de qualidade
- registro de perdas e sobras
- anexos/fotos
- expedição e comprovante
- alertas automáticos
- agente de planejamento de produção
