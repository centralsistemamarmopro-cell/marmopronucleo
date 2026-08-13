# Implementação MarmoPro

## Entregue nesta fundação

- API HTTP sem dependências externas.
- Dashboard web inicial.
- Cadastro de leads.
- Conversas e histórico do chatbot.
- Agente humanizado com roteamento para atendimento humano.
- Módulo de campanhas/marketing protegido por autenticação administrativa.
- Adaptadores isolados para WhatsApp, Instagram e Facebook.
- Controle básico de taxa, payload e headers de segurança.
- Persistência local atômica para desenvolvimento.
- Testes automatizados e CI.

## Produção

1. Trocar persistência local por PostgreSQL/Supabase.
2. Adicionar autenticação real com sessões/JWT e RBAC.
3. Configurar provedor de IA e guardar chaves somente em secrets.
4. Implementar webhooks oficiais das plataformas sociais e validação de assinatura.
5. Adicionar filas para mensagens e campanhas, com idempotência.
6. Criar observabilidade centralizada, auditoria e alertas.
7. Aplicar LGPD: consentimento, minimização, retenção e exclusão de dados.
8. Separar ambientes de desenvolvimento, homologação e produção.
9. Fazer testes de integração dos canais antes de ativar envio real.

## Regra de segurança

Nenhum token, senha, cookie, chave de API ou dado pessoal deve ser gravado no código ou commitado no Git. Use variáveis de ambiente/secrets.
