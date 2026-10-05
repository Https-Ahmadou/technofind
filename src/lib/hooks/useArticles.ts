import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, Article, ArticleCategory } from '@/types';

export function useFeed(category: ArticleCategory | 'all' = 'all') {
  return useInfiniteQuery({
    queryKey: ['feed', category],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get<PaginatedResponse<Article>>(
        `/feed?category=${category}&page=${pageParam}&pageSize=20`
      ),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => apiClient.get<Article>(`/articles/${id}`),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTrends() {
  return useQuery({
    queryKey: ['trends'],
    queryFn: () => apiClient.get('/trends'),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}
