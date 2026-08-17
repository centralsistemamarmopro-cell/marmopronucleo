# Amanda — Assistente de Rotina

Aplicativo PWA local-first para organização pessoal e profissional, pensado para reduzir carga de memória e função executiva.

## Princípios
- Conversar em vez de preencher formulários.
- Uma próxima ação por vez.
- Capturar ideias sem exigir organização imediata.
- Transformar datas em lembretes e tarefas.
- Manter memória local no dispositivo.
- Não depender de API de IA paga para o núcleo.
- Nunca tratar o aplicativo como substituto de psicólogo, médico ou outro profissional de saúde.

## Exemplos
- “Dia 20 preciso pagar o aluguel.”
- “Me lembra daqui a cinco dias de conferir o material do Luiz.”
- “Fechei o Luiz Henrique.”
- “Já fiz a academia e tomei meu remédio.”

## Privacidade
Os dados desta primeira implementação ficam no `localStorage` do navegador. Não há banco remoto nem chave de IA no frontend.

## Voz
O reconhecimento de fala usa a Web Speech API quando o navegador/dispositivo oferece suporte. O Chrome no Android é a opção mais provável para funcionar.

## Instalação
A pasta foi preparada como PWA com `manifest.json` e `sw.js`. Para aparecer como aplicativo instalável, publique esta pasta em HTTPS e abra-a no navegador compatível.

## Próxima etapa
Aprimorar notificações persistentes/push, sincronização opcional, backup/exportação e interpretação conversacional local sem criar dependência obrigatória de créditos.
