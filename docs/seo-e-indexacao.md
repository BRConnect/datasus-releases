# SEO e compartilhamento

O projeto expõe uma URL canônica, `robots.txt`, `sitemap.xml`, dados estruturados em JSON-LD, metadados Open Graph e Twitter, além de uma imagem social PNG gerada pela aplicação. O conjunto torna a página compreensível para rastreadores e determina como o título, a descrição e a prévia visual são apresentados em canais de compartilhamento.

> SEO técnico melhora a capacidade de descoberta e interpretação do site, mas **não garante uma posição específica** nos resultados. A relevância do conteúdo, a autoridade do domínio e os sinais externos continuam influenciando o posicionamento.

| Recurso | Endereço | Finalidade |
| --- | --- | --- |
| Sitemap | `/sitemap.xml` | Indica a URL prioritária aos mecanismos de busca. |
| Regras de rastreamento | `/robots.txt` | Autoriza a indexação pública e aponta para o sitemap. |
| Favicon | `/icon.svg` e `/favicon.ico` | Identidade em abas, favoritos e clientes legados. |
| Ícone Apple | `/apple-icon` | Ícone PNG para atalhos em dispositivos Apple. |
| Cartão Open Graph | `/opengraph-image` | Prévia PNG de 1200 × 630 para mensageiros e redes sociais. |
| Cartão Twitter/X | `/twitter-image` | Prévia PNG para cards do Twitter/X. |

As convenções `opengraph-image` e `twitter-image` do Next.js inserem automaticamente os metadados de imagem correspondentes e geram imagens estáticas quando a rota não utiliza dados de tempo de requisição.[1] Um sitemap ajuda os mecanismos de busca a descobrir URLs importantes, mas não obriga a indexação de todas elas.[2] O Open Graph explicita título, descrição e imagem, evitando que redes sociais recorram apenas a heurísticas ao criar uma prévia.[3]

## Configuração na Vercel

Defina a variável `NEXT_PUBLIC_SITE_URL` com a URL canônica de produção, sem barra no final:

```ini
NEXT_PUBLIC_SITE_URL=https://datasus.vercel.app
```

Depois do deploy, valide `https://datasus.vercel.app/robots.txt`, `https://datasus.vercel.app/sitemap.xml` e `https://datasus.vercel.app/opengraph-image`. Para acelerar a descoberta, envie o sitemap no Google Search Console e solicite a indexação da página inicial. Para atualizar uma prévia já cacheada no Facebook e no WhatsApp, execute uma nova inspeção no Sharing Debugger; plataformas sociais podem manter imagens em cache por URL.[3]

## Referências

[1] [Next.js — opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

[2] [Google Search Central — Learn about sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

[3] [Meta for Developers — A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
