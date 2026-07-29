# Changelog

Todas as mudagens notáveis deste projeto serão documentadas aqui.

O formato segue as convenções de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Nenhuma mudança ainda.

---

## [0.1.0] - 2026-07-29

### Added

- Commit inicial do repositório `ai-study-platform`.
- Estrutura base do monorepo com Turborepo, pnpm workspaces, React + Vite e Express.
- Configuração do Prisma com PostgreSQL e pgvector.
- Modelos iniciais: `User`, `Source`, `SourceChunk`, `StudySession`.
- Docker Compose para PostgreSQL com extensão pgvector.
- Índice HNSW na coluna `embedding` de `SourceChunk`.
- Documentação inicial: `README.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md` e `CHANGELOG.md`.
- Guia de agentes (`agents.md`) com arquitetura de dados e recomendações de ferramentas free/open-source.
