# Arquitetura técnica

```text
Web / canais sociais
        |
        v
   API / Webhooks
        |
  +-----+----------------+
  |                      |
  v                      v
CRM/Marketing       Agent Router
  |                      |
  v                +-----+-----+
PostgreSQL         |           |
  |                v           v
  +----------> Support     AI Provider
                   |
                   v
              Human handoff
```

## Regras

- O frontend nunca recebe tokens de provedores.
- Cada canal social possui um adaptador isolado.
- O roteador decide entre agente, automação e humano.
- Toda mensagem recebe identificador e timestamp.
- Operações externas devem ser idempotentes quando o provedor permitir.
- Auditoria registra ações administrativas e eventos críticos.
- Persistência de produção é PostgreSQL/Supabase; o armazenamento JSON do MVP é somente local/desenvolvimento.
