# Status — Cadastro Mestre e Motor Documental

## Implementado no Supabase

- Diretório mestre de pessoas/empresas (`marmopro_parties`)
- Papéis múltiplos por entidade (`marmopro_party_roles`)
- Endereços (`marmopro_party_addresses`)
- Integração automática do cadastro atual de clientes com o diretório mestre (`customers.party_id` + trigger)
- Obras (`marmopro_works`)
- Endereço de obra (`marmopro_work_addresses`)
- Participantes da obra (`marmopro_work_participants`)
- Ambientes (`marmopro_work_areas`)
- Medições versionadas/aprováveis (`marmopro_work_measurements`)
- Catálogo inicial de 30 tipos de documentos (`marmopro_document_types`)
- Templates versionados (`marmopro_document_templates`)
- Documentos e status (`marmopro_documents`)
- Revisões/renderizações (`marmopro_document_revisions`)
- Relações entre documentos (`marmopro_document_links`)
- RLS por organização nas novas estruturas
- Índices e hardening das políticas das novas estruturas

## Padrão visual aprovado para implementação

A referência visual PORCELANE enviada para a Ficha do Pedido/Proposta A4 é o documento-mestre de proporção, densidade e hierarquia. O padrão deve ser premium, técnico, limpo e economicamente imprimível.

### Elementos fixos

- logo e proporções;
- tipografia;
- preto, branco e escala de cinzas;
- ícones lineares;
- grid, margens e hierarquia;
- cabeçalho com tipo do documento, número, data e validade quando aplicável;
- rodapé institucional;
- tratamento de tabelas e status.

### Regra de ergonomia

A meta é utilizar aproximadamente 85–92% da área útil do A4, evitando espaços verticais excessivos. Respiro deve existir entre grupos de informação, não dentro de grupos. Tabelas e blocos podem crescer conforme conteúdo sem alterar a identidade.

### Classificação

- `EXT` — externo/cliente;
- `OP` — operacional;
- `INT` — interno;
- `FIN` — financeiro;
- `ADM` — administrativo.

A classificação orienta permissões e o motor documental e não precisa aparecer no PDF final.

## Biblioteca documental inicial

1. Proposta comercial — EXT
2. Orçamento comparativo — EXT
3. Ficha do pedido — INT/OP
4. Ordem de medição — OP
5. Ordem de corte — OP
6. Ordem de acabamento — OP
7. Checklist de entrega — OP
8. Protocolo de entrega — EXT/OP
9. Protocolo de retirada — EXT/OP
10. Protocolo de instalação — EXT/OP
11. Termo de vistoria — EXT
12. Termo de conclusão — EXT
13. Termo de garantia — EXT
14. Pós-venda — EXT
15. Recibo — EXT/FIN
16. Controle financeiro — FIN
17. Relatório de obra — INT/OP
18. Documento administrativo — ADM

A família mantém a mesma identidade visual, mas cada documento possui layout próprio conforme sua finalidade. **Mesma identidade não significa mesmo layout.**

## Migrações

- `20260813011042_marmopro_master_registry_and_document_core`
- `marmopro_master_registry_document_indexes_and_policy_hardening`

## Implementação do produto

- Dashboard operacional com barra lateral de módulos;
- quadro de Atualizações da Operação;
- fluxo Pedido → Medição → Liberação → Produção → Qualidade → Instalação → Entrega;
- painel persistente de Comunicação;
- módulos de CRM, Orçamentos, Projetos, Pedidos, Medição, Liberação, Produção, Qualidade, Entrega/Instalação, Financeiro + RH, Marketing, Agenda, Relatórios e Configurações;
- área inicial de documentos no Dashboard;
- navegação responsiva.

## Próxima implementação técnica

1. Tela de Cadastro Mestre.
2. Cadastro de Obras e participantes.
3. Cadastro de ambientes e medições.
4. Biblioteca de templates MarmoPro.
5. Motor de preenchimento automático dos documentos.
6. Central de Documentos por cliente/obra/pedido.
7. Geração de PDF/HTML e armazenamento seguro.
8. Fluxo de aprovação, assinatura, revisão e histórico.
9. Permissões por função e organização no front-end e back-end.
10. Integração de eventos operacionais ao feed de Atualizações da Operação.
