# Integrações de Mídia Social

## Arquitetura

Cada plataforma deve possuir um adaptador independente:

```text
Núcleo
  |
  +-- Social Adapter A
  +-- Social Adapter B
  +-- Social Adapter C
  +-- Messaging Adapter
```

## Contrato comum

Operações conceituais: publicar conteúdo, consultar status, receber eventos, enviar mensagem quando permitido e coletar métricas.

## Requisitos

- OAuth/tokenização segura;
- secrets fora do código;
- webhooks autenticados;
- idempotência para eventos;
- retry com limite e backoff;
- logs sem dados sensíveis;
- tratamento de rate limit;
- isolamento de falhas por canal.

## Segurança

Tokens e credenciais devem existir apenas em secret manager ou configuração segura de ambiente. Nunca devem ser commitados.
