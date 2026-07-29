# Especificação do Projeto: Logicus

> Plataforma de aprendizado de raciocínio lógico com chat IA e widgets interativos
> Data: 22 de julho de 2026 | Status: Especificação Inicial

---

## 1. Visão Geral

O **Logicus** é uma plataforma inovadora de aprendizado de raciocínio lógico em formato de webapp. Projetado como um "livro didático vivo construído em tempo real", a plataforma utiliza uma interface de chat com Inteligência Artificial para ensinar os usuários no seu próprio ritmo.

O diferencial é a **Generative UI**: a IA não apenas responde com texto, mas renderiza **widgets interativos** (tabelas-verdade, questões múltipla-escolha, gráficos, LaTeX) diretamente no chat — o usuário interage com o conteúdo sem sair da conversa. Tudo aliado a um sistema robusto de **gamificação** (XP, níveis, streaks, badges, ranking).

---

## 2. Público-Alvo

**Autodidatas Gerais** — plataforma aberta para qualquer pessoa interessada em desenvolver ou aprimorar habilidades de raciocínio lógico, desde iniciantes até estudantes avançados, sem restrição de conhecimento técnico ou acadêmico.

---

## 3. Funcionalidades

### 3.1 Core
- **Chat interativo com IA:** Interface conversacional atuando como tutor particular
- **Generative UI (widgets):** Elementos interativos renderizados organicamente no chat
- **Ensino adaptativo:** Sistema ajusta profundidade da explicação e complexidade das perguntas conforme desempenho
- **Gamificação integrada:** Progressão visível que recompensa esforço contínuo

### 3.2 Funcionalidades Planejadas
- **Múltiplos módulos:** Expansão para outras matérias no futuro (matemática, física, etc.)
- **BYOK (Bring Your Own Key):** Usuário fornece própria chave de API para usar modelos ilimitados
- **PWA:** Instalação em dispositivos móveis

---

## 4. Estratégia de Conteúdo & Anti-Alucinação

A garantia de respostas corretas é o maior pilar do Logicus. Adotamos um **Modelo Híbrido**:

### 4.1 Geração Determinística (A Lógica)
Código tradicional gera os parâmetros matemáticos e lógicos corretos:
- Tabelas-verdade processadas deterministicamente
- Silogismos via solvers de constraint satisfaction
- Sequências e padrões via `mathjs`
- A resposta correta **nunca** é gerada pelo LLM — é sempre computada deterministicamente

### 4.2 Camada de Linguagem (A IA)
O LLM **nunca calcula a resposta**. Ele recebe os parâmetros determinísticos e os converte em:
- Prosa e contextualização em linguagem natural
- Storytelling que engaja o usuário
- Explicações pedagógicas do raciocínio

### 4.3 RAG para Conteúdo Teórico
Para explicações não-determinísticas (teoria, conceitos):
- Busca semântica via `pgvector` em banco de conteúdo verificado
- Conteúdo validado serve como contexto para o LLM
- Embeddings de módulos e explicações para recuperação precisa

---

## 5. Arquitetura Técnica

### 5.1 Roteamento de Modelos em Níveis (Cost Optimization)

| Nível | % Uso | Modelos | Casos de Uso |
|-------|-------|---------|-------------|
| Rápido/Barato | 70% | GPT-4o-mini / Claude Haiku | Explicações teóricas, RAG, formatação |
| Intermediário | 20% | GPT-4o / Claude Sonnet | Questões contextualizadas, orquestração |
| Fronteira | 10% | GPT-5 / Claude Opus | Tutoria de alto nível, decisões adaptativas |

### 5.2 Generative UI
- **Vercel AI SDK** (Core + UI packages)
- LLM invoca ferramentas com parâmetros validados via Zod
- Frontend mapeia tool IDs → React components
- Streaming em tempo real de texto + componentes

### 5.3 Caching & Otimização
- Prompt caching para system prompts e definições de ferramentas
- Cache de embeddings para consultas RAG frequentes
- Tier gratuito com cota mensal de tokens

### 5.4 Modularidade
- Arquitetura orientada a tópicos/módulos
- tRPC garante type safety end-to-end (DB → Backend → Frontend)
- Expansão para novas matérias requer apenas novos módulos + determinísticos

---

## 6. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Framework** | Next.js 14+ (App Router) | Integração nativa com Vercel AI SDK, SSR, API Routes |
| **Linguagem** | TypeScript 7+ | Type safety em toda a stack |
| **Frontend** | React 19, Tailwind CSS, shadcn/ui | Moderno, minimalista, acessível |
| **API** | tRPC | Typesafe de ponta a ponta, sem geração de cliente |
| **ORM** | Prisma | Migrations, type generation, suporte a pgvector |
| **AI SDK** | Vercel AI SDK (Core + UI) | Streaming, tool calling, Generative UI |
| **Banco** | PostgreSQL + pgvector | Dados relacionais + busca semântica no mesmo DB |
| **Auth** | NextAuth.js v5 | Google OAuth + email/senha, sessões server-side |
| **Estado** | Zustand (client) + React Query (server) | Leve, sem boilerplate |
| **DevOps** | Docker Compose, pnpm, Turborepo | Ambiente local reprodutível |

---

## 7. Sistema de Widgets

### 7.1 Arquitetura
```
Usuário envia mensagem
    → LLM decide se precisa de widget
        → Invoca tool call com parâmetros Zod
            → Backend processa (determinístico ou RAG)
                → Streaming do resultado para frontend
                    → Frontend renderiza React Component correspondente
                        → Usuário interage com widget
                            → Estado atualizado → LLM vê a interação
```

### 7.2 Tipos de Widget (MVP)

| Widget | Tool | Descrição |
|--------|------|-----------|
| Múltipla escolha | `renderQuiz` | Questão com 4-5 alternativas, feedback imediato |
| Tabela verdade | `renderTruthTable` | Tabela interativa para preencher valores lógicos |
| Sequências | `renderSequence` | Completar padrão de sequência lógica/numérica |

### 7.3 Tipos de Widget (Post-MVP)

| Widget | Tool | Descrição |
|--------|------|-----------|
| Grade lógica | `renderLogicGrid` | Einstein puzzles, grid de restrições |
| LaTeX | `renderMath` | Renderização de fórmulas matemáticas |
| Gráficos | `renderChart` | Visualização de dados/estatísticas |
| Preencha lacunas | `renderFillBlanks` | Completar frases com palavras-chave |
| Drag-and-drop | `renderClassify` | Classificar itens em categorias |

---

## 8. Gamificação

### 8.1 Sistema de XP
- Acerto de questão: +10-50 XP (baseado na dificuldade)
- Streak diário mantido: +5 XP bônus
- Completar módulo: +100 XP
- Resposta rápida (< 30s): +5 XP bônus

### 8.2 Níveis (1-50)
- Cada nível exige progressivamente mais XP
- Nível influencia dificuldade sugerida das questões
- Badge especial a cada 5 níveis

### 8.3 Streaks
- Login diário: contador de dias consecutivos
- Quanto maior o streak, maior o multiplicador de XP do dia
- Reset se pular um dia (com grace period de 1 dia?)

### 8.4 Badges
- "10 acertos seguidos"
- "Top 1% em Lógica Proposicional"
- "Speed Demon" (resposta < 10s)
- "Explorador" (completou 3 módulos)
- "Perfeccionista" (100% de acerto em um módulo)

### 8.5 Ranking
- Leaderboard global por total de XP
- Filtro por módulo/tópico
- Ranking semanal e mensal

---

## 9. Modelo de Dados (Conceitual)

```
Users
  id, email, name, passwordHash, image, provider
  xp, level, currentStreak, bestStreak
  availableTokens, totalTokensUsed
  createdAt, updatedAt

Modules
  id, title, description, order, difficulty
  icon, color

Questions
  id, moduleId, type
  deterministicParams (JSON), correctAnswer
  llmPrompt (generated), difficulty
  createdAt

QuestionAttempts
  id, userId, questionId
  userAnswer, isCorrect, timeTaken
  xpEarned, createdAt

Badges
  id, name, description, criteria (JSON)
  iconUrl, rarity

UserBadges
  id, userId, badgeId
  earnedAt

Embeddings (pgvector)
  id, moduleId, contentType
  content, embedding (vector)
  metadata (JSON)
```

---

## 10. Autenticação & Segurança

### 10.1 Provedores
- **Google OAuth:** Principal, menor fricção para onboarding
- **Email/Senha:** Alternativa para quem não tem/não quer usar Google
- NextAuth.js v5 com sessões server-side

### 10.2 Modelo Freemium
- Conta gratuita: cota mensal de tokens (ex: 50k tokens/mês)
- Upgrade para tier pago (futuro) remove limite
- BYOK (futuro): usuário fornece própria chave → sem limite

### 10.3 Segurança
- Senhas hasheadas com bcrypt
- Rate limiting nas API routes
- CORS configurado para domínio próprio
- Sanitização de input do chat

---

## 11. Deploy & Infraestrutura

### 11.1 Desenvolvimento
- **Docker Compose:** PostgreSQL + pgvector + app
- **pnpm + Turborepo:** Monorepo gerenciado
- Hot reload com `tsx watch` (backend) e Vite HMR (frontend)

### 11.2 Produção (a decidir)
- **Vercel (provável):** Integração nativa com Next.js, AI SDK, edge functions
- **Banco:** Supabase (PostgreSQL + pgvector nativo, tier gratuito generoso)
- **Cron Jobs:** Vercel Cron ou Upstash QStash para streaks/cotas

---

## 12. Roadmap

### FASE 1 — MVP
- [ ] Autenticação (Google OAuth + email/senha)
- [ ] Chat IA com streaming de texto
- [ ] 3 widgets GenUI: múltipla escolha, tabela verdade, sequências
- [ ] 3 módulos de raciocínio lógico
- [ ] Geração determinística de questões
- [ ] Gamificação básica: XP, níveis, streak
- [ ] PostgreSQL + pgvector funcional
- [ ] Tier gratuito com cota de tokens

### FASE 2 — Post-MVP
- [ ] Gamificação completa (badges, ranking, leaderboard)
- [ ] Widgets avançados (grade lógica, LaTeX, gráficos)
- [ ] Caminho de aprendizado adaptativo
- [ ] BYOK (Bring Your Own Key)
- [ ] Mais módulos de raciocínio lógico

### FASE 3 — Escala
- [ ] PWA para mobile
- [ ] Suporte multilíngue (i18n)
- [ ] Expansão para outras matérias (matemática, física)
- [ ] Tier pago (assinatura)

---

## 13. Questões em Aberto

1. **Arquitetura de cron jobs:** Como gerenciar streaks diários e reset de cotas? Vercel Cron? Upstash QStash?
2. **Latência vs custo:** Como balancear o uso de modelos baratos sem degradar a experiência?
3. **Grace period de streak:** Permitir 1 dia de folga antes de resetar o streak?
4. **Conteúdo inicial:** Quem vai criar/curar os exemplos de questões para alimentar o RAG?
5. **Moderação de chat:** Como prevenir uso indevido do chat (spam, conteúdo inapropriado)?
6. **Licenciamento:** Open source? Proprietário? Código aberto com SaaS pago?
7. **Medição de eficácia:** Como saber se o usuário está realmente aprendendo? Pré-teste/pós-teste?

---

## 14. Referências

- [Vercel AI SDK — Generative UI](https://sdk.vercel.ai/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma ORM + pgvector](https://www.prisma.io/docs)
- [NextAuth.js (Auth.js) v5](https://authjs.dev/)
- [free-for-dev — Free SaaS tiers](https://github.com/ripienaar/free-for-dev)
- [Mastra vs LangGraph vs Vercel AI SDK (2026)](https://particula.tech/blog/mastra-vs-langgraph-vs-vercel-ai-sdk-typescript-agents)
- [AI Cost Optimization Strategies 2026](https://www.aipricingmaster.com/blog/10-AI-Cost-Optimization-Strategies-for-2026)

---

> **Status:** Especificação inicial — sujeita a revisões conforme desenvolvimento avança.
> **Próximo passo:** Validar questões em aberto e iniciar implementação do MVP.
