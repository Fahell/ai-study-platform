import { useState, useEffect } from 'react';
import type { ApiResponse, HealthStatus } from '@fullstack/shared';

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: ApiResponse<HealthStatus>) => {
        if (data.success && data.data) {
          setHealth(data.data);
        } else {
          setError(data.error || 'Unknown error');
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <h1>🚀 Fullstack App</h1>
        <p className="subtitle">Monorepo — React + Express + TypeScript</p>
      </header>

      <main>
        <section className="card">
          <h2>Backend Status</h2>
          {loading && <p className="status-loading">⏳ Conectando ao backend...</p>}
          {error && (
            <div className="status-error">
              <p>❌ Erro: {error}</p>
              <p className="hint">O backend está rodando? Execute <code>pnpm dev:backend</code></p>
            </div>
          )}
          {health && (
            <div className="status-ok">
              <p>✅ Status: <strong>{health.status}</strong></p>
              <p>⏱️ Uptime: <strong>{Math.floor(health.uptime)}s</strong></p>
              <p>📦 Versão: <strong>{health.version}</strong></p>
              <p>🕐 Timestamp: <strong>{new Date(health.timestamp).toLocaleString('pt-BR')}</strong></p>
            </div>
          )}
        </section>

        <section className="card">
          <h2>📁 Estrutura do Projeto</h2>
          <pre className="tree">{`fullstack-app/
├── packages/
│   ├── shared/      → Tipos compartilhados
│   ├── backend/     → Express + TypeScript
│   └── frontend/    → React + Vite + TypeScript
├── package.json     → pnpm + turborepo
├── tsconfig.base.json
└── .gitignore`}</pre>
        </section>
      </main>

      <footer>
        <p>Feito com ❤️ usando React + Express + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
