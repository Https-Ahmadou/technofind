import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string().min(1, 'Entrez un terme de recherche').max(200),
  category: z.string().optional(),
  source: z.string().optional(),
  dateRange: z.enum(['hour', 'day', 'week', 'month', 'custom']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'popularity']).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(5).max(50).default(20),
});

export type SearchInput = z.infer<typeof searchSchema>;
