'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, SlidersHorizontal, Clock, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, Article, ArticleCategory } from '@/types';
import { ArticleCard } from '@/components/feed/ArticleCard';
import { FeedSkeleton } from '@/components/feed/ArticleSkeleton';
import { cn } from '@/lib/utils';

const CATEGORY_VALUES: (ArticleCategory | '')[] = [
  '', 'monde', 'technologie', 'economie', 'sport', 'science', 'sante', 'politique',
];

export function SearchPage() {
  const t  = useTranslations('search');
  const tc = useTranslations('categories');
  const searchParams = useSearchParams();
  const qParam       = searchParams.get('q') || '';

  const [query,       setQuery]       = useState(qParam);
  const [submitted,   setSubmitted]   = useState(qParam);
  const [category,    setCategory]    = useState<ArticleCategory | ''>('');
  const [sortBy,      setSortBy]      = useState('publishedAt');
  const [showFilters, setShowFilters] = useState(false);
  const [history,     setHistory]     = useState<string[]>([]);

  const SORT_OPTIONS = [
    { value: 'publishedAt', label: t('sortRecent')     },
    { value: 'relevancy',   label: t('sortRelevancy')  },
    { value: 'popularity',  label: t('sortPopularity') },
  ];

  const suggestions = t.raw('suggestions') as string[];

  useEffect(() => {
    if (qParam) {
      setQuery(qParam);
      setSubmitted(qParam);
    }
  }, [qParam]);

  const { data, isLoading, isError } = useQuery({
    queryKey:  ['search', submitted, category, sortBy],
    queryFn:   () => apiClient.get<PaginatedResponse<Article>>(
      `/articles/search?q=${encodeURIComponent(submitted)}&category=${category}&sortBy=${sortBy}&pageSize=20`
    ),
    enabled:   submitted.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const articles = data?.data ?? [];

  function handleSubmit(q = query) {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSubmitted(trimmed);
    setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)].slice(0, 5));
  }

  function handleClear() {
    setQuery('');
    setSubmitted('');
  }

  function handleSuggestion(s: string) {
    setQuery(s);
    handleSubmit(s);
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl text-ink mb-1">{t('title')}</h1>
        <p className="text-sm text-ink-muted">{t('hint')}</p>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4
            text-ink-faint pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder={t('placeholder')}
            autoFocus
            className="w-full h-12 ps-10 pe-10 rounded-xl border border-[#E8E5E0] bg-surface
              text-ink text-sm placeholder:text-ink-faint outline-none
              focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          {query && (
            <button onClick={handleClear}
              className="absolute end-3.5 top-1/2 -translate-y-1/2
                text-ink-faint hover:text-ink transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button onClick={() => handleSubmit()}
          className="px-5 h-12 rounded-xl bg-accent text-white text-sm font-medium
            hover:opacity-90 transition-opacity shadow-accent shrink-0">
          {t('button')}
        </button>

        <button onClick={() => setShowFilters(s => !s)}
          className={cn(
            'w-12 h-12 flex items-center justify-center rounded-xl border transition-colors shrink-0',
            showFilters
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'border-[#E8E5E0] text-ink-faint hover:text-ink hover:bg-[#EDEAE5]'
          )}>
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="card p-4 flex flex-col gap-4 animate-fade-up">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
              {t('category')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_VALUES.map((value) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    category === value
                      ? 'bg-ink text-white'
                      : 'bg-[#EDEAE5] text-ink-muted hover:bg-[#E8E5E0] hover:text-ink'
                  )}>
                  {tc(value === '' ? 'all' : value)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
              {t('sortBy')}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button key={value} onClick={() => setSortBy(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    sortBy === value
                      ? 'bg-ink text-white'
                      : 'bg-[#EDEAE5] text-ink-muted hover:bg-[#E8E5E0] hover:text-ink'
                  )}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* État initial */}
      {!submitted && (
        <div className="flex flex-col gap-5">
          {history.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold
                uppercase tracking-widest text-ink-faint mb-3">
                <Clock className="w-3 h-3" /> {t('recent')}
              </p>
              <div className="flex flex-wrap gap-2">
                {history.map(h => (
                  <button key={h} onClick={() => handleSuggestion(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                      bg-surface border border-[#E8E5E0] text-ink-muted
                      hover:border-accent hover:text-accent transition-colors">
                    <Clock className="w-3 h-3" /> {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold
              uppercase tracking-widest text-ink-faint mb-3">
              <TrendingUp className="w-3 h-3" /> {t('trending')}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => handleSuggestion(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium
                    bg-[#FBF0EB] text-accent hover:bg-accent hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résultats */}
      {submitted && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">
            {isLoading ? t('searching') : (
              <>
                <span className="font-semibold text-ink">
                  {data?.total ?? articles.length}
                </span>
                {' '}{t('results')}{' '}
                <span className="font-semibold text-accent">"{submitted}"</span>
              </>
            )}
          </p>

          {isLoading ? (
            <FeedSkeleton count={5} />
          ) : isError ? (
            <ErrorState />
          ) : articles.length === 0 ? (
            <EmptyState query={submitted} />
          ) : (
            <div className="flex flex-col gap-3">
              {articles.map((article, i) => (
                <ArticleCard key={article.id} article={article} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  const t = useTranslations('search');
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">🔍</span>
      <div>
        <p className="font-display font-bold text-ink mb-1">{t('noResults')}</p>
        <p className="text-sm text-ink-muted">
          {t('noResultsHint')}{' '}
          <span className="text-accent font-medium">"{query}"</span>
        </p>
      </div>
    </div>
  );
}

function ErrorState() {
  const t = useTranslations('search');
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">📡</span>
      <p className="font-display font-bold text-ink">{t('error')}</p>
      <p className="text-sm text-ink-muted">{t('errorHint')}</p>
    </div>
  );
}