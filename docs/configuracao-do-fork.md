# Configuração de um fork

O catálogo é independente de serviços externos privados e consulta somente a **API pública do GitHub**. Por padrão, usa `BRConnect/datasus-releases`.

Para exibir as releases do seu fork, crie um arquivo `.env.local` na raiz do projeto com o conteúdo abaixo. Esse arquivo é local, não entra no Git e deve ser criado manualmente tanto no Windows quanto no Linux.

```ini
DATASUS_RELEASES_REPOSITORY=seu-usuario/seu-fork
```

Após alterar a variável, reinicie `bun run dev`. O site passa a consultar `https://api.github.com/repos/seu-usuario/seu-fork/releases` e mostra os executáveis anexados às releases mais recentes de SISAIH01, BPA e SIA.

> Em um fork, habilite as Actions do GitHub. O workflow usa automaticamente o repositório do próprio fork para criar as releases; não há token ou conta de serviço adicional a configurar.
