'use client';

import { useEffect, useRef } from 'react';
import { LayoutList, LayoutGrid, RefreshCw } from 'lucide-react';
import { useFeed } from '@/lib/hooks';
import { useFeedStore } from '@/store/feed.store';
import { ArticleCard } from './ArticleCard';
import { FeedSkeleton } from './ArticleSkeleton';
import { CategoryTabs } from './CategoryTabs';
import { ArticleCategory } from '@/types';
import { cn } from '@/lib/utils';

export function FeedPage() {
  const { activeCategory, layout, setLayout } = useFeedStore();
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data, isLoading, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage, refetch,
  } = useFeed(activeCategory === 'all' ? undefined : activeCategory as ArticleCategory);

  const articles = data?.pages.flatMap((p) => p.data) ?? [];

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage(); },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <h1 className="font-display font-black text-2xl text-ink tracking-tight">
            Actualités
          </h1>
          <CategoryTabs />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 mt-1">
          <button onClick={() => refetch()} aria-label="Actualiser"
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-ink-faint hover:bg-[#EDEAE5] hover:text-ink transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('list')} aria-label="Liste"
            className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
              layout === 'list'
                ? 'bg-accent/10 text-accent'
                : 'text-ink-faint hover:bg-[#EDEAE5] hover:text-ink')}>
            <LayoutList className="w-4 h-4" />
          </button>
          <button onClick={() => setLayout('grid')} aria-label="Grille"
            className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
              layout === 'grid'
                ? 'bg-accent/10 text-accent'
                : 'text-ink-faint hover:bg-[#EDEAE5] hover:text-ink')}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={cn(
          layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
            : 'flex flex-col gap-3'
        )}>
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article}
              layout={layout} priority={i < 3} />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="h-4" />
      {isFetchingNextPage && <FeedSkeleton count={3} />}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 py-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#FBF0EB] flex items-center justify-center">
        <span className="text-2xl">📡</span>
      </div>
      <div>
        <p className="font-display font-bold text-ink mb-1">Connexion impossible</p>
        <p className="text-sm text-ink-muted">Impossible de charger les actualités.</p>
      </div>
      <button onClick={onRetry}
        className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium
          hover:opacity-90 transition-opacity shadow-accent">
        Réessayer
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#EDEAE5] flex items-center justify-center">
        <span className="text-2xl">🗞️</span>
      </div>
      <div>
        <p className="font-display font-bold text-ink mb-1">Aucun article trouvé</p>
        <p className="text-sm text-ink-muted">Essayez une autre catégorie.</p>
      </div>
    </div>
  );
}
