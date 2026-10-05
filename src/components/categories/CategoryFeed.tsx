'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, Article, ArticleCategory } from '@/types';
import { ArticleCard } from '@/components/feed/ArticleCard';
import { FeedSkeleton } from '@/components/feed/ArticleSkeleton';

const LABELS: Record<string, { label: string; emoji: string }> = {
  monde:        { label: 'Monde',         emoji: '🌍' },
  technologie:  { label: 'Technologie',   emoji: '💻' },
  economie:     { label: 'Économie',      emoji: '📈' },
  sante:        { label: 'Santé',         emoji: '🏥' },
  science:      { label: 'Science',       emoji: '🔬' },
  sport:        { label: 'Sport',         emoji: '⚽' },
  environnement:{ label: 'Environnement', emoji: '🌱' },
  societe:      { label: 'Société',       emoji: '👥' },
  politique:    { label: 'Politique',     emoji: '🏛️' },
};

interface Props { slug: string }

export function CategoryFeed({ slug }: Props) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const meta = LABELS[slug] ?? { label: slug, emoji: '📰' };

  const {
    data, isLoading, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey:  ['category', slug],
    queryFn:   ({ pageParam = 1 }) =>
      apiClient.get<PaginatedResponse<Article>>(
        `/feed?category=${slug}&page=${pageParam}&pageSize=20`
      ),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });

  const articles = data?.pages.flatMap(p => p.data) ?? [];

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
      <div className="flex items-center gap-3">
        <Link href="/categories"
          className="w-9 h-9 flex items-center justify-center rounded-xl
            text-ink-faint hover:bg-[#EDEAE5] hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.emoji}</span>
          <div>
            <h1 className="font-display font-black text-2xl text-ink">{meta.label}</h1>
            <p className="text-sm text-ink-muted">
              {articles.length > 0 ? `${articles.length} articles` : 'Chargement…'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Articles ────────────────────────────────────── */}
      {isLoading ? (
        <FeedSkeleton />
      ) : isError ? (
        <ErrorState />
      ) : articles.length === 0 ? (
        <EmptyState label={meta.label} />
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} priority={i < 3} />
          ))}
        </div>
      )}

      <div ref={loaderRef} className="h-4" />
      {isFetchingNextPage && <FeedSkeleton count={3} />}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">📡</span>
      <p className="font-display font-bold text-ink">Erreur de chargement</p>
      <p className="text-sm text-ink-muted">Veuillez réessayer.</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">🗞️</span>
      <p className="font-display font-bold text-ink">Aucun article</p>
      <p className="text-sm text-ink-muted">
        Aucun article disponible en <span className="font-medium">{label}</span> pour le moment.
      </p>
    </div>
  );
}