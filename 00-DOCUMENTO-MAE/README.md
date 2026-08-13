# Documento-Mãe — MarmoPro Núcleo

## 1. Visão

O MarmoPro Núcleo é a camada central responsável por coordenar operações, marketing, integrações, agentes inteligentes e suporte.

## 2. Componentes principais

- **Núcleo interno:** regras, processos, permissões e configuração.
- **Marketing:** campanhas, conteúdos, leads, jornadas e métricas.
- **Integrações sociais:** conectores desacoplados para publicação, mensagens, eventos e métricas.
- **Agente humanizado:** atendimento conversacional com identidade MarmoPro, contexto e transferência para humano.
- **Suporte:** triagem, classificação, base de conhecimento, SLA e escalonamento.
- **Inteligência:** roteamento de agentes, memória contextual e automações.

## 3. Regra de ouro

Nenhum canal externo deve conter a regra de negócio principal. Canais e aplicativos funcionam como adaptadores do núcleo.

## 4. Fluxo de alto nível

```text
Usuário / Cliente
      |
      v
Canal (Web / Social / WhatsApp / outros)
      |
      v
Gateway / Integração
      |
      v
Roteador do Núcleo
   |       |       |
Marketing Agente  Suporte
   |       |       |
   +-------+-------+
           |
           v
       Dados / Eventos / Auditoria
```

## 5. Resultado esperado

O sistema deve permitir adicionar canais, agentes e módulos sem reescrever o núcleo ou duplicar regras de negócio.
