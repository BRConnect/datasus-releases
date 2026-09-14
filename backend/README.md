# Anonymous Survey API

Backend multi-tenant para pesquisas anônimas, adicionado ao repositório sem alterar o catálogo Next.js existente. A API usa Bun, Fastify, PostgreSQL e Drizzle ORM.

## Execução

```bash
cp .env.example .env
bun install
bun run db:push
bun run dev
```

A API fica em `http://localhost:3333`; health em `/health`, documentação Scalar em `/docs` e OpenAPI JSON em `/docs/json`.

Com Docker: `docker compose up --build` após criar `.env` a partir do exemplo.

## Segurança e anonimato

Todas as consultas administrativas filtram `tenant_id` derivado do JWT. Refresh tokens são armazenados somente como HMAC. Respostas públicas não possuem `user_id`, nome ou e-mail. Para limitar duplicidade, o sistema armazena, separado das respostas, somente um HMAC temporário de slug, IP normalizado, user-agent e janela. Esse identificador é dado técnico potencialmente pessoal conforme a jurisdição, expira em 24 horas e não representa perfeitamente uma pessoa.

Exclusões administrativas são soft delete. A rotina `bun run cleanup:deleted-users` remove usuários marcados há mais de 30 dias e tokens revogados; execute-a em job operacional controlado, nunca automaticamente durante o boot.

## Scripts

`bun run typecheck`, `bun run build`, `bun test`, `bun run db:generate`, `bun run db:migrate`, `bun run db:push` e `bun run cleanup:deleted-users`.

## Limitações conhecidas

O rate limit padrão usa memória local para desenvolvimento. Em múltiplas instâncias, substitua o store pelo Redis. O endpoint CRUD de usuários e recuperação de conta está reservado para a próxima etapa; a fundação já impede login de usuários soft-deleted e revoga sessões por logout.
