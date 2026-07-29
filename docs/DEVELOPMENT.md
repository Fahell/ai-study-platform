# Desenvolvimento

> Guia para desenvolver na **ai-study-platform**.

---

## 1. Ambiente

Requisitos:

- Node.js 18+
- pnpm 11+
- Docker + Docker Compose

---

## 2. Setup

```bash
git clone https://github.com/Fahell/ai-study-platform.git
cd ai-study-platform
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:push
pnpm dev
```

---

## 3. Estrutura dos Pacotes

| Pacote | Caminho | Descrição |
|--------|---------|-----------|
| `@fullstack/shared` | `packages/shared` | Tipos e utilitários compartilhados |
| `@fullstack/db` | `packages/db` | Prisma client e schema |
| `@fullstack/backend` | `packages/backend` | API Express |
| `@fullstack/frontend` | `packages/frontend` | React + Vite |

---

## 4. Comandos Úteis

```bash
# Instalar dependência em um pacote
pnpm add <pkg> --filter @fullstack/backend

# Rodar script em um pacote
pnpm --filter @fullstack/backend dev

# Typecheck em todos os pacotes
pnpm typecheck

# Build de todos os pacotes
pnpm build

# Reset do banco
pnpm --filter @fullstack/db db:reset
```

---

## 5. Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`)
- **Branches**: `master` (principal)
- **TypeScript**: strict mode ativado
- **Lint/Format**: Prettier (sem ESLint configurado ainda)

---

## 6. Fluxo de Trabalho

1. Crie ou atualize o schema em `packages/db/prisma/schema.prisma`
2. Rode `pnpm db:push` para sincronizar
3. Use o Prisma Client gerado em `@fullstack/db`
4. Valide com `pnpm typecheck` e `pnpm build`
5. Commit e push

---

## 7. CI/CD

A CI em `.github/workflows/ci.yml` executa:

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
- `pnpm test`

---

## 8. Troubleshooting

### `process is not defined` no pacote `@fullstack/db`

Adicione `@types/node` como devDependency.

### Erro de extensão `vector` não encontrada

Certifique-se de que a imagem Docker é `pgvector/pgvector:pg16` e que a extensão foi criada:

```bash
docker compose exec -T postgres psql -U postgres -d aistudy -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Builds do pnpm ignorados

O `.npmrc` já aprova os builds de `prisma`, `@prisma/engines` e `esbuild`.
