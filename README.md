# DATASUS Releases

Catálogo de versões oficiais do DATASUS construído com **Next.js**, **Tailwind CSS**, componentes compatíveis com **shadcn/ui** e **Bun**. O projeto não depende de serviços privados: funciona localmente em Windows ou Linux e consulta a API pública do GitHub para listar os executáveis anexados às releases.

## Uso local

Instale o [Bun](https://bun.sh/) e execute os comandos abaixo na raiz do repositório.

```bash
bun install
bun run dev
```

Abra `http://localhost:3000`. Para compilar para produção, execute `bun run build` e `bun run start`. Nenhuma conta, token ou serviço adicional é necessário para **executar e consultar o catálogo**.

## Usar um fork

Faça o fork, habilite as Actions no repositório e crie `.env.local` na raiz:

```ini
DATASUS_RELEASES_REPOSITORY=seu-usuario/seu-fork
```

Reinicie `bun run dev`. A interface passa a ler diretamente as releases públicas do seu fork. A explicação completa está em [`docs/configuracao-do-fork.md`](docs/configuracao-do-fork.md).

| Programa | Regra de seleção |
| --- | --- |
| SISAIH01 | Todos os instaladores da competência mais recente. |
| BPA | O arquivo `BPAMAG*.exe` de maior versão. |
| SIA | O arquivo `BDSIAAAAAMMx.exe` de maior ano, mês e sufixo. |

## Atualização automática

O workflow `.github/workflows/sync-datasus.yml` roda diariamente às **07:00 no horário de Brasília** e pode ser executado manualmente na aba **Actions**. Ele consulta as fontes oficiais, baixa somente os executáveis selecionados, anexa-os a releases públicas e atualiza `public/releases.json` como trilha de auditoria.

Em forks, o token temporário do próprio GitHub Actions tem as permissões necessárias. Para executar `bun run sync:datasus` fora do GitHub, é necessário um `GH_TOKEN` com permissão de escrita no repositório, pois essa operação cria releases.

> Os binários são apenas transferidos e publicados. Este projeto não os executa.
