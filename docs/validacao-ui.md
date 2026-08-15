# Validação de UI e acessibilidade

## Verificação de 15 de agosto de 2026

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Tema escuro | Aprovado | O alternador foi acionado e atualizou rótulo, ícone e cores da página. |
| Foco por teclado | Aprovado | O botão de consulta exibiu foco visível de alto contraste durante a navegação por teclado. |
| Controles nomeados | Aprovado | A inspeção encontrou 25 controles interativos e nenhum sem nome acessível. |
| Overflow horizontal em desktop | Aprovado | A largura de rolagem da página foi de 1265 px para viewport de 1280 px. |
| Assets | Aprovado | Marca, ilustrações e ícones são carregados a partir de `/assets/` local. |
| Fichas no tema escuro | Aprovado | Metadados, ações de download e contraste foram revisados visualmente no acervo. |
| Compilação de produção | Aprovado | `NODE_ENV=production bun run check` e `NODE_ENV=production bun run build` concluídos com geração estática e rota de API dinâmica. |
| Filtro por programa | Aprovado | A seleção de SISAIH01 reduziu o acervo às duas fichas correspondentes, preservando o estado visual e o atributo `aria-pressed`. |

> A validação de produção também deve incluir `bun run check` e `bun run build` antes de cada publicação.
