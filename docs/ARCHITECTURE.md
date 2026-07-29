# Arquitetura

> Visão geral da arquitetura da **ai-study-platform**.

---

## 1. Visão Geral

A plataforma é **agnóstica de matéria**: o usuário define o que quer aprender, e o sistema ingere fontes confiáveis (YouTube, PDFs), fragmenta, gera embeddings e armazena em banco vetorial. Um LLM responde com base nesses dados, citando as fontes originais.

```
Usuário
  → escolhe assunto / fontes
    → ingestão (YouTube, PDF)
      → chunking + embeddings
        → banco vetorial (pgvector)
          → retrieval por similaridade
            → LLM gera resposta com citações
```

---

## 2. Camadas

### 2.1 Frontend (React + Vite)

- Interface de chat para o usuário estudar
- Upload/envio de links de fontes
- Visualização de citações e links diretos

### 2.2 Backend (Express + tRPC)

- API REST/tRPC para ingestão e chat
- Integração com APIs de transcrição e parse de PDFs
- Geração de embeddings via modelos externos (OpenAI, Cohere)
- Queries vetoriais no PostgreSQL

### 2.3 Banco de Dados (PostgreSQL + pgvector)

- Dados relacionais e vetores no mesmo banco
- Prisma como ORM
- Índice HNSW para busca vetorial eficiente

---

## 3. Modelo de Dados

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  sources       Source[]
  studySessions StudySession[]
}

model Source {
  id          String    @id @default(cuid())
  url         String
  type        SourceType
  title       String
  author      String?
  publishedAt DateTime?
  userId      String?
  chunks      SourceChunk[]
}

model SourceChunk {
  id        String   @id @default(cuid())
  sourceId  String
  content   String
  metadata  Json
  embedding Unsupported("vector(1536)")?
}

model StudySession {
  id        String   @id @default(cuid())
  userId    String
  topic     String
  history   Json
}
```

---

## 4. Fluxo RAG

1. **Ingestão**: usuário fornece URL de vídeo ou PDF.
2. **Extração**: transcrição de vídeo ou parse de PDF.
3. **Chunking**: divisão em blocos de ~500–800 tokens com overlap.
4. **Embedding**: cada chunk é convertido em vetor de 1536 dimensões.
5. **Armazenamento**: chunks e vetores são salvos no PostgreSQL.
6. **Consulta**: pergunta do usuário é convertida em embedding.
7. **Retrieval**: buscam-se os top-k chunks mais similares.
8. **Geração**: LLM recebe chunks + pergunta e responde com citações.

---

## 5. Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| PostgreSQL + pgvector | Evita adicionar outro banco, ACID, integração com Prisma |
| Prisma | Type safety, migrations, DX |
| Monorepo pnpm/Turborepo | Cache de build, workspaces, escala |
| Express + tRPC | API type-safe e leve |
| Vite + React | DX e HMR rápidos |

---

## 6. Escalabilidade

- Banco: vertical até ~50M de vetores; depois considere sharding ou Qdrant/Pinecone.
- Embeddings: fila de jobs (ex: BullMQ) para ingestão assíncrona.
- Cache de embeddings e consultas frequentes.

---

## 7. Segurança & Compliance

- `.env` nunca commitado
- Rate limiting nas rotas
- Dados de fontes privadas excluídos em cascata com o usuário
- Respeitar TOS do YouTube e direitos autorais de PDFs
