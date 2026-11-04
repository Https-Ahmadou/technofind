'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bookmark, Trash2, Search, FolderOpen } from 'lucide-react';
import { useFeedStore } from '@/store/feed.store';
import { ArticleCard } from '@/components/feed/ArticleCard';

export function SavedPage() {
  const t = useTranslations('saved');
  const { savedArticles, toggleSaved } = useFeedStore();
  const [search, setSearch] = useState('');

  const filtered = savedArticles.filter(a =>
    search === '' ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.source.name.toLowerCase().includes(search.toLowerCase())
  );

  function clearAll() {
    savedArticles.forEach(a => toggleSaved(a.id));
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-accent" />
            {t('title')}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {t('count', { count: savedArticles.length })}
          </p>
        </div>

        {savedArticles.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
              text-[#EF4444] hover:bg-[#FEF2F2] transition-colors shrink-0">
            <Trash2 className="w-4 h-4" />
            {t('deleteAll')}
          </button>
        )}
      </div>

      {/* Recherche */}
      {savedArticles.length > 0 && (
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4
            text-ink-faint pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('filter')}
            className="w-full h-11 ps-10 pe-4 rounded-xl border border-[#E8E5E0] bg-surface
              text-ink text-sm placeholder:text-ink-faint outline-none
              focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>
      )}

      {/* Contenu */}
      {savedArticles.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <NoResults query={search} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((article, i) => (
            <ArticleCard key={article.id} article={article} priority={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const t = useTranslations('saved');
  return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF0EB] flex items-center justify-center">
        <FolderOpen className="w-8 h-8 text-accent" />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-ink mb-2">{t('empty')}</p>
        <p className="text-sm text-ink-muted max-w-xs">{t('emptyHint')}</p>
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  const t = useTranslations('saved');
  return (
    <div className="card flex flex-col items-center gap-3 py-12 text-center">
      <span className="text-3xl">🔍</span>
      <div>
        <p className="font-display font-bold text-ink mb-1">{t('noResult')}</p>
        <p className="text-sm text-ink-muted">
          {t('noResultHint')}{' '}
          <span className="text-accent font-medium">"{query}"</span>
        </p>
      </div>
    </div>
  );
}