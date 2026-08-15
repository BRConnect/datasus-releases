# DATASUS Releases

![Marca do projeto](public/assets/brand-mark.svg)

> **Versões oficiais, organizadas para consulta rápida e downloads em HTTPS.**

O **DATASUS Releases** é um catálogo independente que reúne os instaladores mais recentes de **SISAIH01**, **BPA** e **SIA** em releases públicas do GitHub. A aplicação foi criada por [Lucas Camargo Stivan](https://github.com/stivan-lucas) para reduzir o esforço de localizar arquivos em páginas distintas do DATASUS e apresentar um caminho de download moderno, auditável e compatível com navegadores atuais.

## Por que este projeto existe?

Parte das distribuições históricas desses sistemas é publicada por FTP. Esse protocolo deixou de ser uma opção prática para navegação cotidiana: o Chrome removeu seu suporte nativo a FTP, e os navegadores atuais concentram suas garantias de segurança e interoperabilidade no HTTPS.[1] O projeto consulta as páginas oficiais, preserva a origem de cada arquivo e republica os instaladores selecionados como **assets de GitHub Releases com URLs HTTPS**.

> O objetivo não é substituir os portais oficiais. O catálogo organiza a descoberta e a distribuição HTTPS dos arquivos, mantendo o vínculo de auditoria com cada fonte DATASUS.

## Como funciona

| Camada | Responsabilidade | Resultado para quem usa o site |
| --- | --- | --- |
| **Fontes oficiais** | Expõem as versões e os instaladores originais. | A origem de cada arquivo permanece visível. |
| **GitHub Actions** | Executa uma rotina diária às 07:00 BRT, reconhece os arquivos atuais e cria ou atualiza releases. | Downloads públicos por HTTPS e sem cliente FTP. |
| **GitHub Releases** | Armazena os binários anexados às tags do projeto. | URLs diretas, versionadas e públicas para os instaladores. |
| **Next.js** | Consulta a API pública do GitHub e apresenta apenas os assets válidos. | Catálogo atualizado, rápido e compatível com Vercel. |
| **SVGs locais** | Formam a marca, ilustrações e ícones em `public/assets/`. | Interface autocontida, sem imagens hospedadas em serviços externos. |

O agendamento usa o evento `schedule` do GitHub Actions. Workflows programados precisam existir na branch padrão do repositório, conforme a documentação do GitHub.[2]

## Programas acompanhados

| Programa | Arquivo reconhecido | Regra aplicada |
| --- | --- | --- |
| **SISAIH01** | `sisaih01_ver*.exe` | Publica todas as versões indicadas para a competência mais recente. |
| **BPA** | `BPAMAG*.exe` | Publica a maior versão encontrada. |
| **SIA** | `BDSIAAAAAMMx.exe` | Publica o maior ano, mês e sufixo disponíveis. |

O catálogo descarta assets que não correspondem a esses padrões. Quando uma fonte falha temporariamente, o sincronizador conserva o último manifesto válido em vez de substituir o acervo por dados incompletos.

## Executar localmente

O projeto usa **Bun** como gerenciador de pacotes e pode ser executado em Windows, Linux ou macOS. Não é preciso criar conta, configurar token ou instalar um cliente FTP apenas para rodar a interface localmente.

```bash
git clone https://github.com/BRConnect/datasus-releases.git
cd datasus-releases
bun install --frozen-lockfile
bun run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para validar a aplicação antes de publicar mudanças, use:

```bash
bun run check
bun run build
bun run start
```

## Usar o seu fork

Após fazer um fork, habilite o GitHub Actions na aba **Actions** e crie o arquivo `.env.local` na raiz do projeto. Esse arquivo é ignorado pelo Git e não deve ser enviado ao repositório.

```ini
DATASUS_RELEASES_REPOSITORY=seu-usuario/seu-fork
```

Depois, reinicie `bun run dev`. O catálogo passará a consultar as releases públicas do seu próprio fork. A rotina diária utiliza o token temporário da própria Action; portanto, você não precisa adicionar token ao site. Um token só é necessário se executar manualmente o comando de publicação fora do GitHub:

```bash
GH_TOKEN=seu_token_com_permissao_de_escrita bun run sync:datasus
```

Veja [`docs/configuracao-do-fork.md`](docs/configuracao-do-fork.md) para os detalhes de configuração.

## Publicar na Vercel

A aplicação usa o App Router do Next.js e funciona sem configuração adicional na Vercel. A plataforma oferece suporte nativo a Next.js, cache de CDN e cabeçalhos `Cache-Control` para funções e rotas dinâmicas.[3]

| Campo na Vercel | Valor recomendado |
| --- | --- |
| Framework Preset | `Next.js` |
| Install Command | `bun install --frozen-lockfile` |
| Build Command | `bun run build` |
| Output Directory | Deixe em branco; o Next.js gerencia a saída. |
| Node.js | 20.x ou superior |
| Variável opcional | `DATASUS_RELEASES_REPOSITORY=usuario/repositorio` para apontar para um fork. |

Os SVGs locais recebem cache imutável de um ano. A rota `/api/releases` usa cache compartilhado de cinco minutos com revalidação em segundo plano, diminuindo chamadas à API do GitHub sem deixar o acervo desatualizado por longos períodos.

## Estrutura relevante

```text
app/                         # Interface Next.js e rota de API
components/                  # Fichas de releases e ícones locais
public/assets/               # Marca, ilustrações e ícones SVG autocontidos
scripts/sync-datasus.ts      # Sincronizador portátil em Bun
.github/workflows/           # Agendamento diário e publicação das releases
public/releases.json         # Último manifesto válido para contingência
```

## Segurança e limites

Os executáveis são baixados e anexados às releases, mas **nunca são executados** pelo projeto nem pelo workflow. A decisão de instalar um arquivo continua sendo responsabilidade de quem faz o download. Antes de distribuir uma versão diferente, valide a origem, o nome, o tamanho e, quando disponível, a integridade do arquivo.

O nome **DATASUS** e os arquivos oficiais pertencem aos seus respectivos titulares. Esta aplicação é um catálogo independente e não declara afiliação institucional.

## Licença e autoria

O código-fonte e os SVGs criados para esta aplicação são distribuídos sob a [Apache License 2.0](LICENSE), com copyright de **Lucas Camargo Stivan** em 2026. A licença não concede direitos sobre marcas ou arquivos de terceiros.

## Referências

[1] [Chrome Developers — Deprecation and removal of FTP support](https://developer.chrome.com/blog/deps-rems-ftp)

[2] [GitHub Docs — Events that trigger workflows: `schedule`](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

[3] [Vercel Docs — Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
