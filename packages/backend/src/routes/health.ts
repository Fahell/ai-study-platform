import { Router, type Request, type Response } from 'express';
import type { ApiResponse, HealthStatus } from '@fullstack/shared';

export const healthRouter: Router = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  const status: HealthStatus = {
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };

  const response: ApiResponse<HealthStatus> = {
    success: true,
    data: status,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});
