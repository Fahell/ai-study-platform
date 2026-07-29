# 🤖 Agents Configuration

> Guia de configuração de agentes de IA e acesso rápido ao ambiente do projeto **ai-study-platform**.

Este documento descreve como usar agentes (Freebuff, GitHub Copilot, Gemini CLI, etc.) com este monorepo de forma produtiva e segura.

---

## 🚀 Ambiente e Acesso Rápido

### Repositório

| Item | Valor |
|------|-------|
| Nome | `ai-study-platform` |
| Repositório | `https://github.com/Fahell/ai-study-platform` |
| Branch padrão | `master` |
| Git user.name | `Rafael Tavares` |
| Git user.email | `rafaeltavares237@gmail.com` |

### Comandos para começar

```bash
# Acessar o projeto
cd ~/fullstack-app

# Verificar o estado do Git
git status

# Verificar o gerenciador de pacotes
pnpm --version   # projeto usa pnpm

# Instalar dependências
pnpm install

# Rodar o ambiente de desenvolvimento
pnpm dev
```

---

## 🛠️ Configuração do Git

```bash
# Configuração local do repositório
git config user.name "Rafael Tavares"
git config user.email "rafaeltavares237@gmail.com"

# Verificar configuração
git config --list --local
```

## 🐙 GitHub CLI (gh)

```bash
# Verificar autenticação
gh auth status

# Criar novo repositório (comando único — só executar uma vez)
gh repo create ai-study-platform --public --source=. --remote=origin --push

# Abrir o repositório no navegador
gh repo view --web
```

---

---

## 🔷 Freebuff (`freebuff`)

**Freebuff** é o agente principal de codificação. Ele opera diretamente no terminal com acesso total ao código.

### Configuração no Cloud Shell

```bash
# Freebuff já está instalado persistentemente em $HOME/.npm-global/
freebuff --version   # → 0.0.127
```

### Comandos úteis no contexto do monorepo

```bash
# Iniciar sessão de código no diretório do projeto
cd ~/fullstack-app && freebuff

# Passar contexto de um pacote específico
freebuff --context packages/backend

# Modo de revisão (review apenas, sem edição)
freebuff --review "revisar PR #42"
```

### Boas práticas com Freebuff

| Prática | Detalhe |
|---------|---------|
| **Sempre validar** | Após alterações, rodar `pnpm typecheck` e `pnpm build` |
| **CI é o juiz final** | O agente pode errar — a CI captura type errors e build failures |
| **Commits atômicos** | Um commit por feature/bug fix, com mensagem descritiva |
| **Não commitar segredos** | `.env` está no `.gitignore`; use `.env.example` como template |

---

## 🔶 Gemini CLI (`@google/gemini-cli`)

Disponível no Cloud Shell, mas **não persistente** (perdido após reset da VM).

```bash
# Reinstalar se necessário
npm install -g @google/gemini-cli

# Autenticar
gemini auth login
```

> ⚠️ Gemini CLI é efêmero no Cloud Shell. Para uso contínuo, reinstale após cada reset.

---

## 🐙 GitHub Copilot (VS Code)

Ao usar o editor web do Cloud Shell, o Copilot pode ser habilitado:

1. Abrir o Cloud Shell Editor (ícone de lápis no canto superior direito)
2. Instalar extensão: `GitHub Copilot`
3. Autenticar com conta GitHub

---

## 🕹️ GitHub Actions (CI Agent)

A CI em `.github/workflows/ci.yml` age como um **agente de validação**:

```yaml
# Toda alteração passa por:
# 1. Typecheck — TS estrito, sem erros
# 2. Build — compilação limpa com Turbo cache
# 3. Lint — estilo consistente
# 4. Test — cobertura de testes
```

A CI é executada automaticamente em pushes e PRs para `main`/`master`.

---

## 📋 Prompt Engineering Tips

Para obter melhores resultados com agentes neste monorepo:

```text
# Exemplo de prompt eficaz:

"No pacote @fullstack/backend, adicione uma rota POST /api/users
que valida o body com zod e usa os tipos de @fullstack/shared.
Mantenha o padrão de erro global do index.ts."
```

### Dicas

- Sempre mencione qual **pacote** você está alterando (`@fullstack/backend`, etc.)
- Peça para **validar com `pnpm typecheck`** após mudanças
- Use a CI como verificador final — "roda a CI depois dessa alteração"
- Para mudanças no `shared`, lembre que `backend` e `frontend` dependem dele

---

## 🧠 Arquitetura de Dados e RAG

> Princípio geral: **sempre que possível, priorizar soluções gratuitas, open-source ou com generoso free tier listadas em [free-for-dev](https://github.com/ripienaar/free-for-dev).**

A plataforma é **agnóstica de matéria**: o usuário escolhe o que quer aprender, e o sistema ingere fontes confiáveis (vídeos e PDFs), fragmenta, gera embeddings e armazena em banco vetorial para consulta pelos LLMs. Isso reduz alucinações e permite que o LLM ensine com base em fontes verificáveis.

### 1. Ingestão de Fontes

#### YouTube (transcrições)

| Opção | Custo | Quando usar |
|-------|-------|-------------|
| `youtube-transcript` (npm) | Grátis, sem API key | MVP/local — extrai legendas oficiais em Node.js |
| YouTube Data API v3 | Free tier (10.000 unidades/dia) | Metadados + legendas manuais |
| `yt-dlp` + Groq Whisper | `yt-dlp` é OSS; Groq tem free tier generoso | Fallback quando não há legendas oficiais |
| `youtube-transcript-api` (Python) | Grátis | Scripts Python/protótipos locais |

> ⚠️ Extração em massa a partir de servidores em nuvem pode gerar bloqueios de IP. Para produção, considere proxies residenciais ou serviços gerenciados.

#### PDFs (fontes acadêmicas e abertas)

| Opção | Custo | Quando usar |
|-------|-------|-------------|
| arXiv API | Grátis | Papers de STEM |
| Unpaywall API | Grátis (100k req/dia) | Resolver PDFs open-access a partir de DOIs |
| Semantic Scholar API | Grátis com API key | Metadados e links de PDFs abertos |
| OpenAlex API | Grátis | Catálogo aberto de pesquisa |

#### Parsing de PDFs

- **LlamaParse:** free tier generoso, ótimo para PDFs acadêmicos com tabelas/fórmulas
- **`pdf-parse` (npm):** fallback open-source para extração básica de texto

### 2. Banco Vetorial

A stack base escolhida é **PostgreSQL + pgvector** (via Prisma).

- **Por quê:** integração nativa com os dados da aplicação, sem adicionar outro banco, ACID, escalável até dezenas de milhões de vetores
- **Hospedagem gratuita:** Supabase ou Neon (ambos listados em free-for-dev e com suporte a pgvector)
- Alternativas prod: Pinecone, Qdrant, Weaviate, Chroma, Milvus

### 3. Chunking e Embeddings

- **Chunking:** `RecursiveCharacterTextSplitter` ou similar
  - Tamanho: 500–800 tokens
  - Overlap: 100 tokens
  - YouTube: chunking baseado em timestamps
  - PDF: chunking por página/seção
- **Embeddings:**
  - **Cohere `embed-english-v3.0`:** excelente free tier
  - **OpenAI `text-embedding-3-small`:** muito barato, vetores 1536D
  - **Open-source:** `sentence-transformers`/`bge-large-en-v1.5` para ambientes locais/privados

### 4. RAG, Citações e Metadados

Cada chunk deve carregar metadados ricos:

```json
{
  "sourceType": "YOUTUBE" | "PDF",
  "title": "...",
  "url": "...",
  "authorOrChannel": "...",
  "timestamp": "03:14",
  "pageNumber": 12,
  "publishDate": "2026-01-15"
}
```

- **Retrieval:** busca por similaridade com pgvector (`<=>`) + filtros de metadados
- **Reranking:** cross-encoder (Cohere Rerank/BGE-Reranker) para ordenar os top-k chunks
- **Citação forçada:** prompt instrui o LLM a citar fontes no formato `[Título, Página X]` ou `[Vídeo, MM:SS]`

### 5. Modelo de Dados (Prisma) — Rascunho

```prisma
model Source {
  id        String    @id @default(cuid())
  url       String    @unique
  type      String    // "YOUTUBE" | "PDF"
  title     String
  userId    String?   // null = global/public
  createdAt DateTime  @default(now())
  chunks    SourceChunk[]
}

model SourceChunk {
  id        String   @id @default(cuid())
  sourceId  String
  source    Source   @relation(fields: [sourceId], references: [id])
  content   String
  metadata  Json
  embedding Unsupported("vector(1536)")
  // Adicionar índice HNSW/IVFFlat no embedding
}

model StudySession {
  id        String   @id @default(cuid())
  userId    String
  topic     String
  history   Json     // Vercel AI SDK Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 6. Roteiro de Implementação sugerido

1. Criar schema Prisma com `Source`, `SourceChunk` e `StudySession`
2. Implementar ingestão de YouTube via `youtube-transcript`
3. Implementar ingestão de PDF via URL + `pdf-parse`/`LlamaParse`
4. Implementar chunking e geração de embeddings
5. Implementar busca vetorial e chat com RAG (Vercel AI SDK)
6. Adicionar citações e links diretos (timestamp/página)

### 7. ⚖️ Caveats Legais e Éticos

- **YouTube TOS:** scraping em massa viola os termos. Legendas oficiais são mais seguras; uso comercial requer cautela.
- **Copyright de PDFs:** vetores de uso pessoal geralmente são OK; distribuir o PDF ou exibir trechos longos pode violar direitos autorais.
- **Privacidade:** deletar vetores de fontes privadas quando o usuário excluir a sessão/estudo.

---

## Documentação do Projeto

- [README](../README.md) — visão geral, setup e stack
- [Arquitetura](../docs/ARCHITECTURE.md) — fluxo de dados e RAG
- [Desenvolvimento](../docs/DEVELOPMENT.md) — guia de desenvolvimento
- [Changelog](../CHANGELOG.md) — histórico de mudanças

---

## 🔒 Segurança

| Regra | Motivo |
|-------|--------|
| Nunca colocar tokens/keys no prompt | O contexto pode ser logado |
| `.env` nunca no git | Usar `.env.example` como template |
| `--frozen-lockfile` no CI | Garante reprodutibilidade |
| Revisar diffs antes de push | Agentes podem alucinar dependências |
