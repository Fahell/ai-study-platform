# 🤖 Agents Configuration

> Guia de configuração de agentes de IA para o repositório **fullstack-app**.

Este documento descreve como usar agentes (Freebuff, GitHub Copilot, Gemini CLI, etc.) com este monorepo de forma produtiva e segura.

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

## 🔒 Segurança

| Regra | Motivo |
|-------|--------|
| Nunca colocar tokens/keys no prompt | O contexto pode ser logado |
| `.env` nunca no git | Usar `.env.example` como template |
| `--frozen-lockfile` no CI | Garante reprodutibilidade |
| Revisar diffs antes de push | Agentes podem alucinar dependências |
