# MarmoPro Núcleo

Base central do ecossistema MarmoPro.

## Objetivo

Organizar a arquitetura interna, operações, marketing, integrações de mídia social, agentes inteligentes e suporte em uma base única, modular e preparada para evolução.

## Escopo inicial

- Arquitetura interna e regras gerais
- Marketing e jornada comercial
- Integrações com aplicativos de mídia social
- Agente humanizado MarmoPro
- Chatbot de suporte
- Inteligência, automações e roteamento
- Banco de dados e contratos de integração
- Segurança, governança, testes e prevenção de falhas

## Estrutura

```text
00-DOCUMENTO-MAE/    visão geral e princípios
01-REGRAS-GERAIS/    regras operacionais e técnicas
02-ARQUITETURA/      arquitetura e camadas
03-DECISOES/         decisões arquiteturais
04-PROCESSOS/        processos e fluxos
05-MODULOS/          módulos do produto
06-AGENTES/          agentes inteligentes
07-INTELIGENCIA/     IA, contexto, memória e roteamento
08-ANTI-BUG/         prevenção, observabilidade e recuperação
09-BANCO-DE-DADOS/   modelo e contratos de dados
10-INTEGRACOES/      integrações externas
11-EMPRESAS/         estruturas por empresa/unidade
12-IDENTIDADE/       identidade e padrões de comunicação
13-DOCUMENTOS/       documentos e templates
14-SUPORTE/          suporte e atendimento
15-TESTES/            estratégia de testes
16-GOVERNANCA/       segurança, permissões e governança
```

## Princípios

1. Modularidade sem duplicação de regras.
2. Integrações externas isoladas por adaptadores.
3. Agentes com identidade, escopo, limites e escalonamento definidos.
4. Dados sensíveis protegidos e nunca versionados no repositório.
5. Toda automação deve ser observável, idempotente quando aplicável e recuperável.
6. Mudanças estruturais devem ser documentadas.

## Estado

Este repositório inicia a fundação consolidada do MarmoPro Núcleo. A implementação de produção deve seguir os contratos e regras documentados aqui.
