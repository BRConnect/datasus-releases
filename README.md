# DATASUS Releases

[![CI](https://github.com/BRConnect/datasus-releases/actions/workflows/ci.yml/badge.svg)](https://github.com/BRConnect/datasus-releases/actions/workflows/ci.yml)
[![Licença Apache 2.0](https://img.shields.io/badge/licen%C3%A7a-Apache%202.0-blue.svg)](LICENSE)

![Marca do projeto](public/assets/brand-mark.svg)

> **Versões oficiais do DATASUS, organizadas para consulta rápida e downloads em HTTPS.**

O **DATASUS Releases** é um catálogo independente que organiza instaladores e tabelas públicas de **SISAIH01, BPA, SIA, CIHA01 e SIGTAP** em [GitHub Releases](https://github.com/BRConnect/datasus-releases/releases). A aplicação reduz o esforço de localizar arquivos publicados em páginas distintas, preserva a origem de cada item e oferece links versionados em HTTPS.

> **Importante:** este projeto não substitui os portais oficiais, não declara afiliação ao Ministério da Saúde ou ao DATASUS e não executa os arquivos baixados. Antes de instalar qualquer arquivo, confira a origem, o nome, o tamanho e a integridade quando essa informação estiver disponível.

## Índice

- [Acesso rápido](#acesso-rápido)
- [Por que este projeto existe?](#por-que-este-projeto-existe)
- [Como funciona](#como-funciona)
- [Programas acompanhados](#programas-acompanhados)
- [Executar localmente](#executar-localmente)
- [Testar e validar](#testar-e-validar)
- [Sincronização de releases](#sincronização-de-releases)
- [Usar um fork](#usar-um-fork)
- [Publicar na Vercel](#publicar-na-vercel)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Segurança e limites](#segurança-e-limites)
- [Licença e autoria](#licença-e-autoria)

## Acesso rápido

| O que você procura | Link |
| --- | --- |
| Catálogo web | [datasus-releases.vercel.app](https://datasus-releases.vercel.app) |
| Releases e downloads | [GitHub Releases](https://github.com/BRConnect/datasus-releases/releases) |
| Fontes oficiais documentadas | [`docs/fontes-oficiais.md`](docs/fontes-oficiais.md) |
| Configuração de fork | [`docs/configuracao-do-fork.md`](docs/configuracao-do-fork.md) |
| Termos de uso | [`/termos`](https://datasus-releases.vercel.app/termos) |
| Política de privacidade | [`/privacidade`](https://datasus-releases.vercel.app/privacidade) |

## Por que este projeto existe?

Parte das distribuições históricas desses sistemas é publicada por FTP. Esse protocolo deixou de ser uma opção prática para navegação cotidiana: navegadores atuais concentram suas garantias de segurança e interoperabilidade no HTTPS.[1] O projeto consulta páginas oficiais, mantém os metadados de origem e republica os instaladores selecionados como assets de GitHub Releases com URLs HTTPS.

A republicação não altera o conteúdo dos arquivos oficiais. Ela apenas oferece uma camada de descoberta e distribuição mais conveniente, com tags, nomes de arquivo e histórico rastreáveis no GitHub.

## Como funciona

```text
Fontes oficiais DATASUS
          │ páginas HTML, RSS e arquivos
          ▼
Sincronizador GitHub Actions
          │ parsers + validação de nomes + downloads
          ▼
GitHub Releases ───► public/releases.json ───► catálogo Next.js
```

| Camada | Responsabilidade | Resultado |
| --- | --- | --- |
| **Fontes oficiais** | Publicam versões, competências e arquivos originais. | A origem de cada item permanece visível. |
| **Sincronizador** | Consulta as fontes, interpreta os metadados, valida nomes e publica assets. | O catálogo é atualizado sem executar os binários. |
| **GitHub Releases** | Armazena os arquivos anexados às tags do projeto. | Downloads públicos, versionados e disponíveis por HTTPS. |
| **Manifesto** | Registra metadados e URLs de download em `public/releases.json`. | O site continua funcional com um último estado válido quando uma fonte falha. |
| **Next.js** | Consulta o manifesto e a API pública do GitHub para renderizar o catálogo. | Interface rápida, responsiva e compatível com Vercel. |

O workflow [`sync-datasus.yml`](.github/workflows/sync-datasus.yml) é executado diariamente às **07:00 no horário de Brasília (10:00 UTC)** e também pode ser disparado manualmente pela aba **Actions**. A atualização de código passa pelo workflow [`ci.yml`](.github/workflows/ci.yml), que valida TypeScript, testes e build.

## Programas acompanhados

| Programa | Arquivo reconhecido | Regra de seleção |
| --- | --- | --- |
| **SISAIH01** | `sisaih01_ver*.exe` | Publica as versões indicadas para a competência mais recente. |
| **BPA** | `BPAMAG*.exe` | Publica a maior versão encontrada. |
| **SIA** | `BDSIAAAAAMMx.exe` | Seleciona o maior ano, mês e sufixo disponíveis. |
| **CIHA01** | `CIHA01_VERNNNN.exe` | Seleciona a versão mais recente indicada na página oficial. |
| **SIGTAP** | `TabelaUnificada_AAAAMM_vNNNNNNNNNN.zip` | Consulta o RSS, seleciona a maior competência e tenta o download antes de preservar o manifesto anterior. |

Assets que não correspondem aos padrões esperados são descartados. Se uma fonte estiver temporariamente indisponível ou mudar de formato, o sincronizador registra o erro e conserva os dados válidos anteriores em vez de publicar um acervo incompleto.

## Executar localmente

Requisitos:

- [Bun](https://bun.sh/) 1.2.21 ou superior;
- Node.js 20.9 ou superior, conforme o `package.json`;
- acesso à internet apenas para instalar dependências e, no caso da sincronização, consultar as fontes e o GitHub.

Para executar a interface:

```bash
git clone https://github.com/BRConnect/datasus-releases.git
cd datasus-releases
bun install --frozen-lockfile
bun run dev
```

Abra <http://localhost:3000> no navegador. O modo de desenvolvimento atualiza a página automaticamente após alterações nos arquivos.

## Testar e validar

Antes de enviar uma alteração, execute:

```bash
bun install --frozen-lockfile
bun run check       # TypeScript sem emissão de arquivos
bun run test        # parsers, validações e sincronizador
bun run build       # build de produção Next.js
```

Para testar o build localmente:

```bash
bun run start
```

A suíte usa respostas HTML/RSS fixas e dependências simuladas. Portanto, os testes não dependem da disponibilidade dos portais DATASUS e não transformam um timeout externo em falso erro de CI. O build não executa os instaladores.

## Sincronização de releases

A rotina de publicação pode ser executada localmente por quem possui permissão de escrita no repositório:

```bash
GH_TOKEN=seu_token_com_permissao_de_escrita bun run sync:datasus
```

O token é usado pelo GitHub CLI para consultar releases e publicar assets. Não coloque tokens em arquivos versionados, no `.env.local` ou no código-fonte. No GitHub Actions, a rotina utiliza o token temporário fornecido pelo próprio workflow.

O sincronizador segue estas regras operacionais:

1. consulta as páginas HTML/RSS oficiais em paralelo;
2. interpreta cada resposta com um parser específico;
3. valida o padrão do nome e agrupa itens pela tag da release;
4. baixa e publica somente os assets esperados;
5. atualiza `public/releases.json` com URLs HTTPS das releases;
6. preserva o manifesto anterior quando todas as fontes falham ou quando uma publicação individual não pode ser concluída.

A fonte DATASUS pode apresentar timeout, bloqueio de rede ou indisponibilidade temporária. Isso não é corrigido aumentando indefinidamente as tentativas: o código aplica limites de tempo, registra a fonte problemática e usa o último manifesto válido como contingência.

## Usar um fork

Depois de criar um fork:

1. habilite o GitHub Actions na aba **Actions**;
2. crie `.env.local` na raiz do projeto;
3. configure o repositório que o catálogo deve consultar:

```ini
DATASUS_RELEASES_REPOSITORY=seu-usuario/seu-fork
```

O arquivo `.env.local` é ignorado pelo Git e não deve ser enviado ao repositório. Reinicie `bun run dev` após alterar a variável. Para detalhes, consulte [`docs/configuracao-do-fork.md`](docs/configuracao-do-fork.md).

## Publicar na Vercel

A aplicação usa o App Router do Next.js e pode ser publicada diretamente na Vercel:

| Configuração | Valor recomendado |
| --- | --- |
| Framework Preset | `Next.js` |
| Install Command | `bun install --frozen-lockfile` |
| Build Command | `bun run build` |
| Output Directory | Deixe em branco. |
| Node.js | 20.x ou superior |
| Variável opcional | `DATASUS_RELEASES_REPOSITORY=usuario/repositorio` |

Os SVGs locais recebem cache imutável de um ano. A rota `/api/releases` usa cache compartilhado de cinco minutos com revalidação em segundo plano, reduzindo chamadas à API do GitHub sem deixar o catálogo desatualizado por longos períodos.

## Estrutura do projeto

```text
app/                         # Interface Next.js, metadata e rotas
components/                  # Fichas de releases, controles e ícones
public/assets/               # Marca, ilustrações e SVGs locais
public/releases.json         # Último manifesto válido para contingência
scripts/sync-datasus.ts      # Ponto de entrada do sincronizador
scripts/sync/                # Parsers, rede, GitHub, tipos e testes
.github/workflows/ci.yml     # Testes e build em PRs e pushes na main
.github/workflows/sync-datasus.yml # Agendamento da sincronização
docs/                        # Fontes, configuração e relatórios técnicos
```

## Segurança e limites

Os executáveis e arquivos compactados são baixados e anexados às releases, mas **nunca são executados** pelo projeto ou pelo workflow. O GitHub Releases é uma camada de distribuição; não é uma certificação de segurança do conteúdo. Antes de instalar um arquivo, valide se a release, o nome, a competência, o tamanho e a origem correspondem ao que você espera.

O projeto não fornece suporte aos sistemas DATASUS, não garante a disponibilidade dos portais oficiais e não substitui validações internas de compliance, antivírus ou políticas de instalação da sua organização.

O nome **DATASUS** e os arquivos oficiais pertencem aos seus respectivos titulares. Esta aplicação é um catálogo independente e não declara afiliação institucional.

## Licença e autoria

O código-fonte e os SVGs criados para esta aplicação são distribuídos sob a [Apache License 2.0](LICENSE), com copyright de **Lucas Camargo Stivan** em 2026. A licença não concede direitos sobre marcas ou arquivos de terceiros.

## Referências

[1]: https://developer.chrome.com/blog/deps-rems-ftp "Chrome Developers — Deprecation and removal of FTP support"

[2]: https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule "GitHub Docs — Eventos que acionam workflows"

[3]: https://vercel.com/docs/frameworks/nextjs "Vercel Docs — Next.js on Vercel"

- [Chrome Developers — Deprecation and removal of FTP support][1]
- [GitHub Docs — Events that trigger workflows: `schedule`][2]
- [Vercel Docs — Next.js on Vercel][3]
