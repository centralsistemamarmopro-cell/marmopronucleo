# Chatbot de Suporte

## Pipeline

```text
Mensagem
  -> identificação de sessão
  -> classificação da intenção
  -> recuperação de conhecimento
  -> resposta
  -> validação de confiança
  -> encerramento ou escalonamento
```

## Categorias

- dúvida;
- problema técnico;
- financeiro/comercial;
- acompanhamento;
- reclamação;
- solicitação humana.

## SLA e prioridade

Cada atendimento deve registrar prioridade, estado, responsável e timestamps. Casos críticos devem ser encaminhados imediatamente.

## Base de conhecimento

Respostas devem ser fundamentadas em conteúdo aprovado e versionado. Quando não houver conhecimento suficiente, o chatbot deve admitir a limitação e encaminhar.

## Auditoria

Registrar somente os eventos necessários para operação, segurança e melhoria do serviço, respeitando permissões e privacidade.
