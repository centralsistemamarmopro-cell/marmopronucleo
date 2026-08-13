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

## Migrações

- `20260813011042_marmopro_master_registry_and_document_core`
- `marmopro_master_registry_document_indexes_and_policy_hardening`

## Próxima implementação

1. Tela de Cadastro Mestre.
2. Cadastro de Obras e participantes.
3. Cadastro de ambientes e medições.
4. Biblioteca de templates MarmoPro.
5. Motor de preenchimento automático dos documentos.
6. Central de Documentos por cliente/obra/pedido.
7. Geração de PDF/HTML e armazenamento seguro.
8. Fluxo de aprovação, assinatura, revisão e histórico.
