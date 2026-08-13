# MarmoPro — Licenciamento, Planos e Liberação de Acesso

## Regra oficial

O MarmoPro possui um único motor tecnológico. O que muda por cliente é a licença: plano, módulos, recursos e eventuais overrides. O cliente não recebe um sistema diferente; recebe uma seleção de capacidades do mesmo núcleo.

## Planos padrão

| Plano | Mensalidade | Implantação | Posicionamento |
|---|---:|---:|---|
| Start | R$ 149/mês | R$ 490 | Pequenas marmorarias |
| Profissional | R$ 299/mês | R$ 990 | Operação comercial + produção |
| Premium | R$ 499/mês | R$ 1.990 | Gestão + IA + marketing + integrações |
| Enterprise | R$ 899/mês | R$ 3.990 | Engenharia + multiunidade + automações |
| Custom | Sob consulta | Sob consulta | Projeto personalizado |

Valores são parâmetros comerciais iniciais e podem ser alterados pelo administrador sem alterar a arquitetura.

## Fluxo de contratação

1. Cliente abre a página de planos.
2. Escolhe um plano.
3. Informa empresa e e-mail.
4. MarmoPro cria a organização em estado `pending`.
5. MarmoPro cria a assinatura pendente.
6. O cliente é enviado ao Stripe Checkout.
7. O Stripe confirma o pagamento/assinatura por webhook assinado.
8. O MarmoPro ativa a assinatura.
9. O plano é aplicado à organização.
10. As entitlements (recursos liberados) são sincronizadas automaticamente.
11. O acesso aos módulos passa a ser controlado pelo plano.

## Segurança

- Nunca confiar no retorno do navegador para liberar acesso.
- A liberação oficial acontece no webhook assinado do provedor de pagamento.
- O webhook é idempotente por `event_id`.
- Chaves Stripe e Supabase ficam somente no servidor/secrets.
- Recursos críticos devem verificar entitlement no backend.
- O administrador pode aplicar override manual sem alterar o plano-base.

## Entitlement

A autorização de recurso segue:

`organização -> assinatura ativa -> plano -> recurso -> permissão`

Tabela de recursos: `marmopro_features`.

Tabela de associação plano/recurso: `marmopro_plan_features`.

Tabela de acesso efetivo: `marmopro_entitlements`.

## Pagamento online

O backend usa Stripe Checkout em modo de assinatura. A mensalidade é recorrente e a implantação é cobrada como item avulso na primeira cobrança.

Para produção é obrigatório configurar:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_APP_URL`

Endpoint do webhook:

`POST /api/billing/webhook`

Endpoint de checkout:

`POST /api/billing/checkout`

Endpoint público de planos:

`GET /api/plans`

## Customização

O plano Custom não deve ser liberado automaticamente. Ele exige análise comercial e configuração manual do contrato/licença.
