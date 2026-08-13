# Anti-Bug e Confiabilidade

1. Validar entradas antes de processar.
2. Não confiar em dados vindos de integrações externas.
3. Usar timeouts em chamadas externas.
4. Repetições devem ter limite e backoff.
5. Operações críticas devem ser idempotentes.
6. Erros devem possuir contexto operacional sem vazar segredos.
7. Falhas de um canal não podem derrubar o núcleo.
8. Alterações de contrato exigem atualização de documentação e testes.
9. Toda automação relevante deve possuir trilha de auditoria.
10. Nunca colocar tokens, senhas ou chaves no Git.

## Observabilidade mínima

Registrar correlação da operação, componente, resultado, duração e categoria do erro, evitando conteúdo sensível.
