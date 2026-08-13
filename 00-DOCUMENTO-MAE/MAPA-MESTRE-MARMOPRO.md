# Mapa Mestre do MarmoPro

**Versão:** 1.0  
**Status:** Base oficial de planejamento e homologação  
**Objetivo:** ser a fonte de verdade para requisitos, processos, treinamento, documentação, segurança, testes e anti-bug do MarmoPro.

## 1. Princípios obrigatórios

1. O MarmoPro é multi-tenant: dados, usuários, permissões e operações devem permanecer isolados por empresa/marmoraria.
2. Regra de negócio fica no núcleo; canais externos são adaptadores.
3. Toda função crítica precisa de requisito, regra de negócio, treinamento, teste e critério de homologação.
4. IA pode interpretar, sugerir e automatizar dentro de limites definidos, mas operações técnicas críticas exigem validação humana quando houver risco de erro material.
5. Toda alteração relevante deve ser auditável e reversível quando tecnicamente possível.
6. Nenhum segredo deve ser armazenado no código ou em documentação pública.
7. Segurança, RLS, permissões e isolamento por empresa são requisitos de primeira classe.
8. Uma funcionalidade só é considerada concluída quando implementação, testes, documentação e treinamento correspondente estiverem validados.

## 2. Mapa de módulos

| ID | Módulo | Funções principais | Usuários | Documentos obrigatórios | Anti-bug principal |
|---|---|---|---|---|---|
| M01 | Dashboard | KPIs, alertas, visão operacional | Gestor, administrador | DRF, regras de KPI, manual, testes | Consistência de indicadores |
| M02 | CRM | Leads, clientes, funil, histórico | Comercial, gestor | DRF, POP, manual por cargo, matriz de permissões | Duplicidade, estados inválidos |
| M03 | Projetos | Projeto, ambientes, medidas, versões | Técnico, vendedor | DRF, padrão de medição, POP, ficha técnica | Medidas incompletas e versões conflitantes |
| M04 | Leitura técnica/plantas | PDFs, imagens, OCR/visão, extração técnica | Técnico, projetista | Especificação técnica, protocolo de conferência, manual IA | IA não libera produção sem validação |
| M05 | Orçamentos | Custos, aproveitamento, perdas, margem, proposta | Orçamentista, comercial, gestor | Regras de preço, DRF, POP, modelo de orçamento | Cálculo, limites, arredondamento, margem |
| M06 | Vendas | Proposta, negociação, aprovação, pedido | Comercial, gestor | DRF, política comercial, POP | Transições inválidas |
| M07 | Produção | Ordem, corte, acabamento, montagem, qualidade | Produção, técnico, gestor | OP, fichas, checklists, POPs | Avanço sem pré-requisitos |
| M08 | Estoque | Chapas, insumos, entradas, saídas, reservas | Estoque, produção, gestor | Cadastro padrão, POP, inventário | Saldo negativo, concorrência, rastreabilidade |
| M09 | Financeiro | Receber, pagar, custos, caixa, conciliação | Financeiro, gestor | Plano de contas, POPs, regras de aprovação | Valores inconsistentes e permissões |
| M10 | Marketing | Campanhas, públicos, automações, métricas | Marketing, gestor | Briefing, plano de campanha, POP, KPIs | Segmentação e métricas inconsistentes |
| M11 | Atendimento | Chatbot, humano, histórico, SLA | Atendimento, gestor | Manual, scripts, POP, SLA | Fallback e encaminhamento |
| M12 | Agentes IA | Roteamento, memória, tarefas, guardrails | Atendimento, técnico, gestor | Especificação de agente, políticas, testes | Alucinação, escopo e ação indevida |
| M13 | Documentos | Upload, classificação, versionamento, vínculo | Todos conforme permissão | Política documental, taxonomia, manual | Arquivo inválido, vínculo errado, versão |
| M14 | Integrações | WhatsApp, Instagram, Facebook, APIs, webhooks | Admin, suporte | Especificação de integração, runbook | Retry, webhook duplicado, credencial expirada |
| M15 | Relatórios | Relatórios operacionais e gerenciais | Gestor, administrador | Dicionário de métricas, manual | Dados divergentes da origem |
| M16 | Administração | Empresas, usuários, cargos, permissões | Administrador | Matriz RBAC, manual admin, política de segurança | Escalada de privilégio |

## 3. Pacote documental por módulo

Cada módulo deve possuir, conforme aplicabilidade:

- `01-REQUISITOS-FUNCIONAIS.md`
- `02-ESPECIFICACAO-TECNICA.md`
- `03-REGRAS-DE-NEGOCIO.md`
- `04-PROCESSOS-E-POPS.md`
- `05-MANUAL-DE-OPERACAO.md`
- `06-MANUAL-POR-CARGO.md`
- `07-MATRIZ-DE-PERMISSOES.md`
- `08-PLANO-ANTI-BUG-E-TESTES.md`
- `09-TRATAMENTO-DE-ERROS-E-RECUPERACAO.md`
- `10-CHECKLIST-DE-HOMOLOGACAO.md`

Módulos técnicos acrescentam documentos especializados, como padrão de medição, ficha de corte, memorial descritivo, política de formação de preço, política de campanhas ou especificação de agente.

## 4. Trilhas de treinamento

### Comercial
CRM -> atendimento -> projeto -> orçamento -> proposta -> negociação -> fechamento -> pós-venda.

### Técnico/Projetista
Projetos -> leitura de documentos -> medidas -> materiais -> ficha técnica -> conferência -> aprovação técnica.

### Orçamentista
Custos -> chapas -> aproveitamento -> perdas -> mão de obra -> instalação -> margem -> proposta.

### Produção
Ordem de produção -> preparação -> corte -> acabamento -> montagem -> qualidade -> expedição/instalação.

### Estoque
Cadastro -> entrada -> armazenamento -> reserva -> saída -> inventário -> perdas.

### Financeiro
Contas -> lançamentos -> aprovação -> recebimento/pagamento -> conciliação -> fluxo de caixa -> fechamento.

### Marketing
Lead -> campanha -> segmentação -> conteúdo -> automação -> conversão -> métricas.

### Atendimento/IA
Triagem -> chatbot -> agente -> contexto -> transferência humana -> encerramento -> auditoria.

### Administrador
Empresa -> usuários -> cargos -> permissões -> integrações -> auditoria -> segurança -> configuração.

## 5. Ciclo de anti-bug

Para cada função crítica:

`Entrada -> validação -> autorização -> processamento -> persistência -> integração -> resultado -> auditoria -> recuperação`.

### Classes mínimas de teste

- Caminho feliz.
- Campo obrigatório ausente.
- Formato inválido.
- Limites mínimo/máximo.
- Duplicidade.
- Concorrência.
- Falha de rede.
- Timeout.
- Retry e idempotência.
- Permissão insuficiente.
- Isolamento entre empresas.
- Dados corrompidos ou incompletos.
- Reprocessamento.
- Regressão após alteração.

## 6. Fluxo oficial da operação de uma marmoraria

`Lead -> Cliente -> Projeto -> Documentos/Planta -> Medição -> Orçamento -> Aprovação -> Pedido -> Produção -> Qualidade -> Instalação -> Financeiro -> Pós-venda -> Marketing/Relacionamento`.

Nenhuma etapa deve depender de informação que não esteja registrada ou validada no sistema.

## 7. Leitura técnica e IA

A leitura de planta/documentos deverá seguir:

1. Recepção do arquivo.
2. Validação do tipo e integridade.
3. OCR/visão/interpretação.
4. Extração de entidades e medidas.
5. Apresentação das evidências ao usuário.
6. Conferência técnica.
7. Aprovação.
8. Geração de dados estruturados.
9. Só então disponibilização para orçamento/produção.

A IA não deve inventar medidas, materiais ou especificações. Quando houver baixa confiança, conflito ou ausência de informação, deve marcar a pendência e solicitar validação.

## 8. Orçamentação

O motor deve separar:

- custo de material;
- aproveitamento;
- perdas;
- corte;
- acabamento/bordas;
- furações e acessórios;
- mão de obra;
- terceirização;
- transporte;
- instalação;
- impostos/taxas configuráveis;
- comissão;
- desconto;
- margem;
- preço final.

Toda alteração relevante deve gerar histórico/versionamento do orçamento.

## 9. Documentos e versionamento

Todo documento operacional deve ter, quando aplicável:

`empresa -> cliente -> projeto -> pedido/orçamento -> tipo -> versão -> responsável -> data -> status -> histórico`.

Documentos críticos não devem ser sobrescritos sem preservação da versão anterior.

## 10. Segurança e governança

- RBAC por função.
- Isolamento por empresa.
- RLS no banco exposto.
- Auditoria de ações críticas.
- Segredos somente em secrets/variáveis protegidas.
- Separação entre privilégios administrativos e operacionais.
- Validação de autorização no servidor.
- Logs sem exposição de segredos ou dados desnecessários.

## 11. Critério de pronto

Um módulo só recebe status `PRONTO` quando:

- requisito aprovado;
- regra de negócio definida;
- implementação concluída;
- testes unitários/integrados relevantes passando;
- testes anti-bug passando;
- permissões validadas;
- isolamento por empresa validado;
- documentação publicada;
- treinamento publicado;
- checklist de homologação aprovado;
- observabilidade/recuperação definida;
- CI verde quando aplicável.

## 12. Status inicial do mapa

| Área | Status inicial |
|---|---|
| Núcleo/CRM/Marketing/Chatbot | Base já existente no repositório; deve ser auditada contra este mapa |
| Agentes | Estrutura existente; detalhamento funcional a consolidar |
| Anti-bug | Estrutura documental existente; transformar em matriz por módulo |
| Banco/Supabase | Base existente; validar cobertura multi-tenant e regras de segurança |
| Integrações | Adaptadores existentes; validar contratos e falhas |
| Produção | Estrutura existente; ampliar para fluxo completo da marmoraria |
| Engenharia/leitura de planta | Requisito estratégico; especificação detalhada pendente |
| Orçamentação técnica | Requisito estratégico; motor de regras pendente |
| Documentos | Requisito estratégico; taxonomia e versionamento pendentes |
| Treinamento | Deve ser criado por cargo e por módulo |
| Homologação final | Deve ocorrer após integração dos módulos |

## 13. Regra de evolução

Toda nova funcionalidade deve ser registrada neste mapa antes de ser considerada parte oficial do produto. Alterações devem indicar módulo afetado, requisito, regra de negócio, impacto técnico, treinamento, testes e critério de homologação.
