# Contexto comercial por vendedor

A partir desta versão, projetos, orçamentos, pedidos e análises técnicas devem carregar `sellerId` quando houver vendedor responsável.

## Regras

- O usuário escolhe o vendedor/contexto ao entrar quando tiver acesso a mais de um.
- O vendedor selecionado filtra clientes, projetos, orçamentos, pedidos, tarefas, follow-ups e indicadores.
- Usuário gestor pode visualizar todos e alternar para um vendedor específico.
- Regras comerciais e técnicas da empresa permanecem centralizadas; dados operacionais são separados por vendedor.
- O contexto selecionado deve acompanhar criação e atualização de orçamento, projeto e pedido.
- O assistente deve responder usando o contexto comercial selecionado.

## Dashboard individual

Mostrar prioritariamente pedidos e pendências, evitando excesso de cartões numéricos: medição pendente, em produção, liberado para retirada, entrega, instalação e follow-ups.

## Próxima integração

Conectar o contexto `sellerId` às rotas e telas de projetos, orçamentos, pedidos e dashboard comercial.
