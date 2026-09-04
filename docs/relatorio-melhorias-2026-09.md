# Relatório técnico — evolução do DATASUS Releases

## Escopo

O projeto foi evoluído incrementalmente, preservando a arquitetura, a identidade editorial, o catálogo, as rotas legais, o fluxo de releases e a integração existente. A proposta continua sendo a de um catálogo técnico independente, informativo e rastreável; a interface não afirma vínculo institucional com o Ministério da Saúde ou com o DATASUS.

## SEO

A home mantém title e description específicos, canonical configurado em `app/layout.tsx`, Open Graph e Twitter Cards gerados pela aplicação, além de JSON-LD para `WebSite` e `CollectionPage`. As rotas `/termos` e `/privacidade` possuem metadata e canonical próprios. O sitemap agora inclui `/`, `/termos` e `/privacidade`, enquanto `robots.txt` permanece gerado pela aplicação. A home utiliza H1 único, seções com H2, navegação interna para acervo, fontes e documentos legais e textos naturais sobre o propósito do catálogo, sem keyword stuffing.

## Acessibilidade e WCAG 2.2 AA

Foram preservados skip links, landmarks, headings e foco visível. Os filtros possuem `aria-pressed` e `aria-current`, o catálogo anuncia estados pelo `aria-live`/`role=status`, o carregamento inicial possui skeleton com `role=status` e os cards possuem nomes acessíveis para download e auditoria da fonte. Os links externos usam `noopener noreferrer` e informam abertura em nova aba aos leitores de tela. As páginas legais receberam breadcrumbs, índice navegável e impressão sem elementos interativos. Os estilos mantêm contraste por tokens de tema, estados de foco e suporte a teclado.

A conformidade WCAG AA é tratada como objetivo de implementação e foi verificada estaticamente e por inspeção local da árvore de elementos. Uma auditoria formal com axe/Lighthouse em produção ainda deve ser executada em um ambiente com a URL publicada acessível.

## Anime.js e microinterações

Anime.js 4.5 foi adicionado como dependência. O hero usa entrada curta com `opacity`, `translateY`, duração de 650 ms e stagger de 75 ms. Os cards de release usam entrada de 420 ms com stagger de 55 ms. O CSS complementa a interação com elevação sutil de cards, transições de filtros e skeleton shimmer. Todas as animações verificam `prefers-reduced-motion`; o CSS reduz duração, remove loops de skeleton e evita elevação decorativa quando a preferência está ativa.

## Performance e responsividade

A aplicação continua usando assets locais SVG, dimensões explícitas nas imagens principais e ausência de scripts externos adicionais. A home foi compilada com bundle inicial informado pelo Next.js de 131 kB e rota de 28,9 kB após a integração de Anime.js. O CSS cobre breakpoints para desktop, tablet, 40 rem e 24 rem, incluindo o alvo de 320 px, reduzindo o risco de overflow horizontal. A imagem do hero permanece acima da dobra sem lazy loading explícito.

LCP, INP e CLS devem ser medidos em produção com dados reais de campo ou Lighthouse; o build não substitui essas medições.

## Assets

O projeto mantém os assets locais existentes e adiciona `public/assets/source-sigtap.svg`, usado pelo card da fonte SIGTAP. A imagem Open Graph continua sendo gerada de forma determinística em `app/opengraph-image.tsx`, com versão equivalente para Twitter. Não foram adicionadas imagens genéricas ou dependências externas de assets.

## Testes

| Verificação | Resultado | Observação |
| --- | --- | --- |
| TypeScript | PASS | `pnpm run check` |
| Build | PASS | `pnpm run build`, 13 páginas geradas |
| Lint | PASS parcial | O projeto não possui script `lint`; o build executou verificação de lint e tipos. |
| Manifesto | PASS | JSON válido e cinco programas presentes: SISAIH01, SIA, CIHA01, BPA e SIGTAP. |
| SEO estático | PASS | Metadata, canonical, JSON-LD, sitemap, robots, OG/Twitter e links internos presentes. |
| Acessibilidade estática | PASS | Foco, skip links, labels, estados dinâmicos, breadcrumbs e reduced motion verificados. |
| Inspeção local | PASS | Home e `/termos` abertas localmente; controles e conteúdo apareceram na árvore acessível. |
| Responsividade | PASS estrutural | Breakpoints e regra específica para telas de 320 px revisados. |
| Lighthouse/axe em produção | PENDENTE | Requer execução no domínio publicado; não foi inventado um resultado de campo. |

## Referências

[1]: https://animejs.com/ "Anime.js"
[2]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines 2.2"
[3]: https://schema.org/CollectionPage "Schema.org CollectionPage"
