# 🚀 Fullstack App

> Monorepo full-stack com **Turborepo + pnpm + Vite + TypeScript**

---

## 📁 Estrutura

```
fullstack-app/
├── packages/
│   ├── shared/          → Tipos TypeScript compartilhados
│   ├── backend/         → API Express + TypeScript (porta 3001)
│   └── frontend/        → React + Vite + TypeScript (porta 5173)
├── .github/workflows/
│   └── ci.yml           → CI/CD — typecheck, build, lint, test
├── turbo.json           → Pipeline do Turborepo
├── pnpm-workspace.yaml  → Workspaces do pnpm
├── tsconfig.base.json   → Config TypeScript base
├── package.json         → Scripts orquestrados via Turbo
└── agents.md            → Configuração de agentes (Freebuff, etc.)
```

## 🛠️ Setup

```bash
# Instalar pnpm (via corepack)
corepack enable pnpm

# Instalar dependências
pnpm install
```

## 📜 Scripts

Todos os scripts passam pelo **Turborepo** com cache incremental:

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia backend + frontend em paralelo |
| `pnpm dev:backend` | Apenas o backend |
| `pnpm dev:frontend` | Apenas o frontend |
| `pnpm build` | Build de todos os pacotes (com cache) |
| `pnpm typecheck` | Verificação de tipos em todos os pacotes |
| `pnpm lint` | Lint em todos os pacotes |
| `pnpm test` | Testes em todos os pacotes |
| `pnpm clean` | Remove dist/, node_modules/, .turbo/ |

## 🌐 Acessos

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:3001 |
| **Health Check** | http://localhost:3001/api/health |

## ⚙️ CI/CD

CI configurada via **GitHub Actions** — `.github/workflows/ci.yml`. Roda em todo push/PR nas branches `main`/`master`:

1. Typecheck
2. Build (com cache do Turborepo)
3. Lint
4. Test

Tarefas pesadas delegadas ao CI — desenvolvimento local fica rápido com cache.

## 🔧 Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18, Vite 5, TypeScript 5 |
| **Backend** | Express 4, Helmet, CORS, Morgan |
| **Monorepo** | Turborepo 2, pnpm 11 |
| **CI/CD** | GitHub Actions |
| **Formatter** | Prettier |

## 📦 pnpm

Usamos `workspace:*` para dependências internas. O `pnpm install` linka automaticamente os pacotes locais.

```bash
# Adicionar dependência a um pacote:
pnpm add <pkg> --filter @fullstack/backend

# Build apenas do que mudou:
pnpm build --filter=@fullstack/backend
```
