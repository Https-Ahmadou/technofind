'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal, Clock, TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, Article, ArticleCategory } from '@/types';
import { ArticleCard } from '@/components/feed/ArticleCard';
import { FeedSkeleton } from '@/components/feed/ArticleSkeleton';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: ArticleCategory | ''; label: string }[] = [
  { value: '',             label: 'Toutes'       },
  { value: 'monde',       label: 'Monde'         },
  { value: 'technologie', label: 'Technologie'   },
  { value: 'economie',    label: 'Économie'      },
  { value: 'sport',       label: 'Sport'         },
  { value: 'science',     label: 'Science'       },
  { value: 'sante',       label: 'Santé'         },
  { value: 'politique',   label: 'Politique'     },
];

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Plus récents' },
  { value: 'relevancy',   label: 'Pertinence'   },
  { value: 'popularity',  label: 'Popularité'   },
];

const SUGGESTIONS = [
  'Intelligence artificielle', 'Climat', 'Économie mondiale',
  'Technologie', 'Sport', 'Santé', 'Politique',
];

export function SearchPage() {
  const searchParams = useSearchParams();
  const qParam       = searchParams.get('q') || '';

  const [query,       setQuery]       = useState(qParam);
  const [submitted,   setSubmitted]   = useState(qParam);
  const [category,    setCategory]    = useState<ArticleCategory | ''>('');
  const [sortBy,      setSortBy]      = useState('publishedAt');
  const [showFilters, setShowFilters] = useState(false);
  const [history,     setHistory]     = useState<string[]>([]);

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

      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="font-display font-black text-2xl text-ink mb-1">Recherche</h1>
        <p className="text-sm text-ink-muted">Explorez des milliers d'articles en temps réel</p>
      </div>

      {/* ── Barre de recherche ──────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
            text-ink-faint pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Rechercher des actualités…"
            autoFocus
            className="w-full h-12 pl-10 pr-10 rounded-xl border border-[#E8E5E0] bg-surface
              text-ink text-sm placeholder:text-ink-faint outline-none
              focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          {query && (
            <button onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2
                text-ink-faint hover:text-ink transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button onClick={() => handleSubmit()}
          className="px-5 h-12 rounded-xl bg-accent text-white text-sm font-medium
            hover:opacity-90 transition-opacity shadow-accent shrink-0">
          Chercher
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

      {/* ── Filtres ─────────────────────────────────────── */}
      {showFilters && (
        <div className="card p-4 flex flex-col gap-4 animate-fade-up">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
              Catégorie
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(({ value, label }) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    category === value
                      ? 'bg-ink text-white'
                      : 'bg-[#EDEAE5] text-ink-muted hover:bg-[#E8E5E0] hover:text-ink'
                  )}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
              Trier par
            </p>
            <div className="flex gap-1.5">
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

      {/* ── État initial — suggestions ───────────────────── */}
      {!submitted && (
        <div className="flex flex-col gap-5">
          {history.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold
                uppercase tracking-widest text-ink-faint mb-3">
                <Clock className="w-3 h-3" /> Recherches récentes
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
              <TrendingUp className="w-3 h-3" /> Tendances du moment
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
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

      {/* ── Résultats ────────────────────────────────────── */}
      {submitted && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              {isLoading ? 'Recherche en cours…' : (
                <>
                  <span className="font-semibold text-ink">
                    {data?.total ?? articles.length}
                  </span>
                  {' '}résultats pour{' '}
                  <span className="font-semibold text-accent">"{submitted}"</span>
                </>
              )}
            </p>
          </div>

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
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">🔍</span>
      <div>
        <p className="font-display font-bold text-ink mb-1">Aucun résultat</p>
        <p className="text-sm text-ink-muted">
          Aucun article trouvé pour{' '}
          <span className="text-accent font-medium">"{query}"</span>
        </p>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="card flex flex-col items-center gap-3 py-14 text-center">
      <span className="text-4xl">📡</span>
      <p className="font-display font-bold text-ink">Erreur de recherche</p>
      <p className="text-sm text-ink-muted">Veuillez réessayer.</p>
    </div>
  );
}