# MarmoPro — Cadastro Mestre e Motor Documental

## Objetivo

O cadastro passa a ser a fonte mestre de dados da operação. Documentos, orçamento, pedido, medição, produção, instalação, financeiro, compras, estoque, RH e pós-venda devem reutilizar os registros existentes em vez de redigitar informações.

## Cadastros mestres

- Clientes e empresas
- Obras
- Arquitetos, engenheiros, designers, mestres de obra e demais profissionais
- Fornecedores e prestadores
- Funcionários
- Transportadoras e instaladores
- Parceiros e consultores
- Produtos e materiais
- Endereços e contatos

A entidade `marmopro_parties` funciona como diretório mestre de pessoas/empresas e `marmopro_party_roles` permite que a mesma entidade tenha mais de uma função sem duplicação de cadastro.

## Obra

Cada obra pode possuir cliente, endereço, participantes profissionais e ambientes. Os ambientes são ordenados e carregam material, acabamento, espessura, área e status de medição/instalação. Medições possuem revisão e aprovação.

## Motor documental

A base contém:

- catálogo de tipos de documento;
- templates versionados;
- documentos gerados;
- revisões do conteúdo/renderização;
- relações entre documentos;
- vínculo com cliente, obra, orçamento e ordem de produção;
- responsáveis, aprovação e histórico de revisão.

## Famílias iniciais

Comercial, cliente, técnico, produção, logística, instalação, entrega, financeiro, compras, estoque, RH, administrativo, qualidade e pós-venda.

Inclui, entre outros: proposta, orçamento, pedido, contrato, aditivo, aceite, medição, liberação técnica, ordem de corte, ordem de acabamento, ordem de produção, checklist, ordem de instalação, vistoria, não conformidade, termo de entrega, recibo, documentos de compras/estoque, ficha de funcionário, contrato de trabalho, contracheque/holerite, férias, desligamento, garantia e guia de cuidados.

## Linguagem visual

Todos os templates devem usar o Design System MarmoPro: mesma marca, tipografia, hierarquia, ícones, linhas, cabeçalho, rodapé, revisão e identificação do pedido/obra. A diferença entre documentos será funcional, não de identidade.

## Fluxo mestre

`Cadastro → Obra → Orçamento → Pedido → Medição → Liberação Técnica → Corte → Acabamento → Produção → Instalação → Vistoria → Entrega → Garantia/Pós-venda`

Os documentos são saídas do processo e não a fonte primária dos dados.

## Segurança

As novas tabelas ficam protegidas por RLS e isoladas por organização. Templates globais são somente leitura para usuários autenticados; templates específicos da organização são administrados por usuários com permissão de administrador.

## Migração aplicada

Supabase migration: `20260813004100_marmopro_master_registry_and_document_core` (nome lógico: `marmopro_master_registry_and_document_core`).
