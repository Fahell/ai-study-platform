# ai-study-platform

> Plataforma de estudos agnóstica com IA. O usuário escolhe o que quer aprender, e a plataforma ingere fontes confiáveis (vídeos, PDFs), armazena em banco vetorial e responde via RAG com fontes verificáveis.

---

## 🎯 Visão

A **ai-study-platform** permite que qualquer pessoa aprenda qualquer assunto com a ajuda de um tutor de IA. O diferencial é o **RAG (Retrieval-Augmented Generation)** sobre fontes escolhidas pelo próprio usuário — reduzindo alucinações e garantindo que o conteúdo tenha fontes reais e verificáveis.

O usuário pode:

- Adicionar vídeos do YouTube ou PDFs da web
- Estudar qualquer assunto de forma conversacional
- Receber respostas com citações (timestamp de vídeo ou página de PDF)

---

## 📁 Estrutura

```
fullstack-app/
├── packages/
│   ├── shared/          → Tipos TypeScript compartilhados
│   ├── db/              → Prisma client + schema (PostgreSQL + pgvector)
│   ├── backend/         → API Express + tRPC (porta 3001)
│   └── frontend/        → React + Vite (porta 5173)
├── docs/
│   ├── ARCHITECTURE.md  → Arquitetura, RAG e modelo de dados
│   └── DEVELOPMENT.md   → Guia de desenvolvimento
├── CHANGELOG.md         → Histórico de mudanças
├── agents.md            → Guia de agentes e acesso rápido
├── docker-compose.yml   → PostgreSQL + pgvector
├── turbo.json           → Pipeline do Turborepo
└── pnpm-workspace.yaml  → Workspaces do pnpm
```

---

## ️ Setup

Pré-requisitos: [Node.js 18+](https://nodejs.org), [pnpm](https://pnpm.io), [Docker](https://docker.com).

```bash
# Clonar
git clone https://github.com/Fahell/ai-study-platform.git
cd ai-study-platform

# Instalar dependências
pnpm install

# Criar .env a partir do exemplo
cp .env.example .env

# Subir o banco de dados
pnpm db:up

# Sincronizar schema com o banco
pnpm db:push

# Rodar backend + frontend
pnpm dev
```

---

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia backend + frontend em paralelo |
| `pnpm dev:backend` | Apenas o backend |
| `pnpm dev:frontend` | Apenas o frontend |
| `pnpm build` | Build de todos os pacotes |
| `pnpm typecheck` | Verificação de tipos em todos os pacotes |
| `pnpm db:up` | Sobe o PostgreSQL via Docker |
| `pnpm db:push` | Sincroniza schema Prisma com o banco |
| `pnpm db:studio` | Abre o Prisma Studio |

---

## 🌐 Acessos

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:3001 |
| **Health Check** | http://localhost:3001/api/health |
| **Prisma Studio** | http://localhost:5555 |

---

## 🔧 Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React 18, Vite 5, TypeScript 5 |
| **Backend** | Express 4, TypeScript 5 |
| **Banco de dados** | PostgreSQL + pgvector |
| **ORM** | Prisma |
| **Monorepo** | Turborepo 2, pnpm 11 |
| **CI/CD** | GitHub Actions |

---

## 📚 Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Desenvolvimento](docs/DEVELOPMENT.md)
- [Changelog](CHANGELOG.md)
- [Agentes / Acesso rápido](agents.md)

---

## ⚖️ Licença

Em definição.
