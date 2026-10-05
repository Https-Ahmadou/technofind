import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Article, ArticleCategory, SearchFilters } from '@/types';

interface FeedState {
  articles:        Article[];
  savedArticles:   Article[];
  savedIds:        string[];
  activeCategory:  ArticleCategory | 'all';
  filters:         Partial<SearchFilters>;
  layout:          'list' | 'grid' | 'magazine';
  selectedArticle: Article | null;

  setArticles:        (articles: Article[]) => void;
  appendArticles:     (articles: Article[]) => void;
  toggleSaved:        (id: string, article?: Article) => void;
  setCategory:        (cat: ArticleCategory | 'all') => void;
  setFilters:         (filters: Partial<SearchFilters>) => void;
  setLayout:          (layout: 'list' | 'grid' | 'magazine') => void;
  setSelectedArticle: (article: Article | null) => void;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      articles:        [],
      savedArticles:   [],
      savedIds:        [],
      activeCategory:  'all',
      filters:         {},
      layout:          'list',
      selectedArticle: null,

      setArticles:    (articles) => set({ articles }),
      appendArticles: (articles) =>
        set((s) => ({ articles: [...s.articles, ...articles] })),

      toggleSaved: (id, article) =>
        set((s) => {
          const isSaved = s.savedIds.includes(id);
          if (isSaved) {
            return {
              savedIds:      s.savedIds.filter(sid => sid !== id),
              savedArticles: s.savedArticles.filter(a => a.id !== id),
            };
          } else {
            return {
              savedIds:      [...s.savedIds, id],
              savedArticles: article
                ? [...s.savedArticles, article]
                : s.savedArticles,
            };
          }
        }),

      setCategory:        (activeCategory) => set({ activeCategory }),
      setFilters:         (filters) => set({ filters }),
      setLayout:          (layout) => set({ layout }),
      setSelectedArticle: (selectedArticle) => set({ selectedArticle }),
    }),
    {
      name:        'technofind-feed',
      partialize:  (s) => ({
        savedIds:      s.savedIds,
        savedArticles: s.savedArticles,
        layout:        s.layout,
      }),
    }
  )
);