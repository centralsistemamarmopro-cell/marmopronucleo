# MarmoPro — Estrutura Mestre por Conversas e Módulos

## Objetivo

Este documento define como organizar as diferentes conversas e frentes do projeto MarmoPro sem fragmentar o produto. Cada conversa representa uma frente funcional, enquanto o Mapa Mestre permanece como fonte central de verdade.

## Regra central

**Um único motor MarmoPro. Múltiplas frentes funcionais. Cada módulo possui documentação própria.**

Nenhum aplicativo ou módulo novo deve existir isoladamente. Toda nova frente deve ser vinculada ao Mapa Mestre, receber uma função definida, documentação própria, treinamento, regras, permissões, anti-bug, testes e homologação.

## Frentes oficiais

1. CRM / Vendas
2. Projetos / Engenharia / Leitura de Plantas
3. Orçamento
4. Produção
5. Estoque
6. Financeiro
7. Marketing
8. Atendimento / Chatbot
9. IA / Agentes
10. Documentos
11. Integrações
12. Dashboard / Relatórios
13. Administração / Licenciamento
14. Suporte
15. Treinamento
16. Testes / Anti-bug
17. Supabase / Banco de Dados
18. Vercel / Infraestrutura
19. GitHub / Desenvolvimento
20. Planos / Pagamentos

## Estrutura obrigatória de cada frente

Cada módulo/frente deve possuir, conforme aplicável:

- Visão e finalidade
- Requisitos funcionais
- Requisitos técnicos
- Regras de negócio
- Fluxos e processos
- Perfis e permissões
- Treinamento por função
- POPs e checklists
- Documentos e templates
- IA e automações
- Integrações
- Anti-bug e validações
- Testes unitários, integração e aceitação
- Homologação
- Métricas/KPIs
- Histórico de decisões
- Dependências com outros módulos
- Plano/licença que libera o recurso
- Status: planejado, em desenvolvimento, homologação, pronto ou liberado

## Relação entre conversa e repositório

As conversas não são consideradas sistemas independentes. Elas são espaços de trabalho por domínio. As decisões relevantes devem ser consolidadas no repositório e refletidas no Mapa Mestre e na documentação do módulo correspondente.

Exemplo:

`Conversa Produção` → documentação de Produção → Mapa Mestre → requisitos/testes/código.

`Conversa Marketing` → documentação de Marketing → Mapa Mestre → requisitos/testes/código.

Se uma decisão de um módulo afetar outro, a dependência deve ser registrada nos dois módulos e no Mapa Mestre.

## Aplicativos adicionais

Quando surgir um aplicativo adicional:

1. identificar a finalidade;
2. verificar se já existe função equivalente;
3. decidir se é módulo, submódulo, integração ou serviço transversal;
4. registrar no Mapa Mestre;
5. criar a documentação própria;
6. definir usuários, permissões e dependências;
7. definir treinamento;
8. definir anti-bug e testes;
9. definir se será incluído em algum plano ou vendido como adicional;
10. somente então implementar e homologar.

## Licenciamento

O motor é único. A liberação é controlada por organização, plano e recurso.

`Organização → Plano → Entitlements → Módulos → Recursos → Permissões`

O administrador do MarmoPro controla quais recursos são liberados, enquanto o pagamento online pode ativar automaticamente o plano contratado após confirmação segura do provedor de pagamento.

## Regra de qualidade

Nenhum módulo crítico será considerado pronto somente porque a tela funciona. Para ser considerado pronto deve possuir funcionalidade validada, treinamento correspondente, regras de negócio, permissões, proteção contra erros, testes e homologação.

## Fonte de verdade

O Mapa Mestre define a visão geral e as relações entre módulos. Os detalhes operacionais permanecem nos documentos próprios de cada módulo. Isso evita duplicidade, perda de decisões e mistura de responsabilidades.
