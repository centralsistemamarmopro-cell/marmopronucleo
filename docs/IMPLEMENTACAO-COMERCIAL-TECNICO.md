# Implementação Comercial e Técnica — V1

## Objetivo
Adicionar ao núcleo MarmoPro os contratos funcionais para Projeto, Análise Técnica, Orçamento, Pedido e Dashboard operacional, mantendo o Lovable intacto e sem depender de IA para cálculos determinísticos.

## Regras
- Projeto pode receber arquivos e informações técnicas.
- Análise técnica é assistiva e exige revisão humana antes de ser considerada validada.
- Um projeto pode possuir várias versões de orçamento.
- O motor de orçamento calcula subtotal, desconto, custo e margem.
- Regras específicas por empresa devem ser parametrizáveis; não devem ser codificadas como regra universal.
- Pedido deve guardar a etapa operacional atual.
- Dashboard deve priorizar itens que precisam de atenção, sem transformar exemplos em dados fixos.

## Próxima implementação
- endpoints de projetos;
- endpoints de análises técnicas;
- endpoints de orçamentos;
- endpoints de pedidos;
- dashboard operacional;
- testes automatizados;
- integração posterior com Supabase normalizado.

## Limite atual
A leitura automática de plantas/PDF depende de um serviço de OCR/visão e não deve ser simulada como se já estivesse implementada. O fluxo deve permitir entrada manual e posterior integração de IA.
