# Direção de design — DATASUS Releases

## Três abordagens consideradas

| Tema | Introdução breve | Probabilidade |
| --- | --- | --- |
| **Arquivo de Serviço Público** | Um catálogo sereno, documental e confiável, inspirado em fichas de acervo e sinalização institucional brasileira. O foco é a legibilidade das versões e a sensação de permanência. | 0,06 |
| **Painel de Operações Sanitárias** | Uma leitura mais técnica, com sinais de atividade, metadados e linguagem de console operacional. Transmite atualização contínua sem parecer um painel genérico. | 0,08 |
| **Caderno de Sistemas** | Uma composição editorial leve, como anotações técnicas bem organizadas, usando blocos assimétricos e detalhes de papel. Faz do catálogo uma referência agradável de consultar. | 0,04 |

## Abordagem selecionada: Arquivo de Serviço Público

### Movimento de design

**Modernismo editorial brasileiro aplicado a um arquivo digital.** A interface deve parecer uma ficha técnica pública cuidadosamente atualizada: objetiva, humana e visualmente estável.

### Princípios centrais

1. **A informação é a interface:** nome, competência, versão, data, tamanho e origem têm precedência visual inequívoca.
2. **Ritmo documental:** linhas finas, numeração, etiquetas e espaçamento vertical estruturam a leitura sem sobrecarregar a tela.
3. **Confiança verificável:** cada release identifica origem, status de sincronização e data de publicação.
4. **Utilidade sem ornamento excessivo:** interações ficam discretas; o destaque existe apenas para arquivos e ações de download.

### Filosofia de cor

O fundo em **marfim técnico** reduz a fadiga das longas listas; o texto em grafite mantém o caráter documental. Verde profundo evoca sistemas de saúde e serviço público, enquanto o laranja-argila distingue ações e atualizações sem usar alertas agressivos.

### Paradigma de layout

Uma **linha editorial vertical** organiza a página: um cabeçalho deslocado à esquerda, uma faixa de monitoramento à direita e uma lista de releases que parece uma série de registros de acervo. No desktop, metadados ficam em uma coluna estreita e os arquivos em uma coluna principal; no celular, a hierarquia se empilha sem perder a ordem documental.

### Elementos de assinatura

1. **Marcador de registro:** quadrado verde com uma barra laranja para sinalizar cada nova competência.
2. **Réguas de catálogo:** filetes horizontais e pequenos códigos alfanuméricos que dividem fontes e versões.
3. **Selo de sincronização:** ponto pulsante muito sutil com a última checagem da automação.

### Filosofia de interação

O usuário explora como quem consulta um arquivo: filtros e abas respondem imediatamente; os botões de download têm contraste forte e informam o arquivo exato antes do clique. Links para a origem permanecem sempre visíveis para auditoria.

### Animação

As entradas usam deslocamento vertical de no máximo 10 px e opacidade, com cascata curta de 45 ms entre registros. Cartões elevam apenas 2 px no hover; botões comprimem levemente no clique. Nenhuma animação decorativa é reproduzida quando há preferência por redução de movimento.

### Sistema tipográfico

**DM Serif Display** sustenta títulos e a personalidade editorial; **IBM Plex Sans** é usada em navegação, descrições e botões; **IBM Plex Mono** identifica versões, nomes de arquivos, datas e tamanhos. Títulos são largos, sem centralização, e a tipografia monoespaçada nunca é usada em blocos longos.

### Essência da marca

**Um catálogo público e verificável de atualizações DATASUS, para equipes que precisam baixar a versão correta sem procurar em vários portais.** Personalidade: **confiável, precisa e tranquila**.

### Voz da marca

Direta, institucional e clara; títulos descrevem o estado do acervo e CTAs indicam exatamente o que será baixado. Evitar frases promocionais genéricas.

> “Versões oficiais, organizadas para consulta rápida.”

> “Baixar BPAMAG0500.exe · 7,4 MB”

### Logotipo e ícone

O símbolo é uma **pasta de arquivo geométrica** formada por três blocos sobrepostos, com uma abertura central sugerindo uma seta de download. Sem texto dentro do ícone; o wordmark combina uma assinatura de serif com código monoespaçado em peças maiores.

### Cor de assinatura

**Verde Prontuário — `#0A5B4A`**. Uma cor profunda, sóbria e memorável para ações principais e marcas de atualização.

## Decisões de estilo

1. As ações de download identificam sempre o artefato e seu tamanho no padrão **“Baixar [arquivo] · [tamanho]”**.
2. Cada ficha de release repete um marcador Verde Prontuário, uma barra laranja-argila, um código monoespaçado e um selo de rastreio para tornar a origem verificável à primeira leitura.
3. Em telas desktop, a lista mantém a separação editorial entre uma coluna estreita de metadados de acervo, a coluna principal do arquivo e a área de retirada/auditoria.
