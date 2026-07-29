// ── API Response Types ────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
}

// ── Health Check ──────────────────────────────────────────────────────

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  version: string;
  timestamp: string;
}

// ── User Types (placeholder) ──────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserPayload = Pick<User, 'email' | 'name'>;

// ── Environment ───────────────────────────────────────────────────────

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  apiVersion: string;
}
