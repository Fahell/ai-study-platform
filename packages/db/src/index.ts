export { prisma } from './client.js';

// Re-export Prisma types for convenience
export type { PrismaClient } from './client.js';
export type {
  User,
  Source,
  SourceChunk,
  StudySession,
  SourceType,
} from '@prisma/client';
