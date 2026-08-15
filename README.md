# DATASUS Releases

Este repositório reúne um **catálogo público de versões DATASUS** e um fluxo diário de coleta. A interface foi desenvolvida em **Next.js**, **Tailwind CSS 4**, componentes compatíveis com **shadcn/ui** e **Bun 1.2.21**.

| Origem monitorada | Regra de publicação |
| --- | --- |
| SISAIH01 | Publica todas as versões da competência mais recente. |
| BPA | Publica o instalador `BPAMAG*.exe` mais recente. |
| SIA | Publica o banco mensal `BDSIAAAAAMMx.exe` mais recente. |

O fluxo é executado automaticamente todos os dias às **07:00 no horário de Brasília** (10:00 UTC), com opção de disparo manual pela aba **Actions**. Ele consulta as páginas oficiais, transfere apenas os instaladores selecionados, cria releases públicas e atualiza `public/releases.json`. O site busca esse manifesto no repositório para refletir novas releases sem precisar alterar o código da interface.

## Executar localmente

```bash
bun install
bun run dev
```

Para testar apenas os tipos, execute `bun run check`. A sincronização manual exige um token GitHub com permissão de escrita em releases e conteúdo do repositório:

```bash
export GH_TOKEN="seu_token"
bun run sync:datasus
```

> Os executáveis são obtidos das fontes oficiais e **nunca são executados** pelo workflow. O projeto existe apenas para organizar, preservar e disponibilizar os downloads oficiais.

## Fontes

As fontes consultadas são a página do [SISAIH01](http://sihd.datasus.gov.br/versao/versao_sisaih01.php), a lista de [BPA](https://sia.datasus.gov.br/versao/listar_ftp_bpa.php) e a lista de [SIA](https://sia.datasus.gov.br/versao/listar_ftp_sia.php).
