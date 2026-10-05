'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Minus, Globe, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { ArticleCard } from '@/components/feed/ArticleCard';
import { FeedSkeleton } from '@/components/feed/ArticleSkeleton';
import { Article } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TrendTopic {
  id:           string;
  topic:        string;
  articleCount: number;
  change:       number;
  category:     string;
  region:       'local' | 'world';
}

interface TrendsData {
  topics:   TrendTopic[];
  articles: Article[];
}

const CAT_STYLES: Record<string, { bg: string; text: string }> = {
  technologie:   { bg: '#EFF6FF', text: '#2563EB' },
  economie:      { bg: '#FEF9EC', text: '#B45309' },
  sport:         { bg: '#F0FDF4', text: '#16A34A' },
  sante:         { bg: '#FFF1F2', text: '#BE123C' },
  science:       { bg: '#F5F3FF', text: '#7C3AED' },
  politique:     { bg: '#F1F5F9', text: '#475569' },
  monde:         { bg: '#FBF0EB', text: '#D4541A' },
  environnement: { bg: '#F0FDF4', text: '#15803D' },
};

export function TrendsPage() {
  const [region, setRegion] = useState<'world' | 'local'>('world');

  const { data, isLoading, isError } = useQuery({
    queryKey:  ['trends', region],
    queryFn:   () => apiClient.get<TrendsData>(`/trends?region=${region}`),
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  const topics   = data?.topics   ?? MOCK_TOPICS;
  const articles = data?.articles ?? [];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">Tendances</h1>
          <p className="text-sm text-ink-muted mt-1">Les sujets qui font l'actualité en ce moment</p>
        </div>

        {/* Toggle région */}
        <div className="flex items-center gap-1 p-1 bg-[#EDEAE5] rounded-xl shrink-0">
          <button onClick={() => setRegion('world')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              region === 'world'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            )}>
            <Globe className="w-3 h-3" /> Monde
          </button>
          <button onClick={() => setRegion('local')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              region === 'local'
                ? 'bg-white text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            )}>
            <MapPin className="w-3 h-3" /> Local
          </button>
        </div>
      </div>

      {/* ── Top tendances ────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-lg text-ink mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Top 10 des sujets
        </h2>

        <div className="flex flex-col gap-1">
          {topics.map((topic, i) => {
            const cat = CAT_STYLES[topic.category] ?? CAT_STYLES.monde;
            return (
              <div key={topic.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F3EF] transition-colors cursor-pointer group">

                {/* Rang */}
                <span className={cn(
                  'w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold shrink-0',
                  i === 0 ? 'bg-accent text-white' :
                  i === 1 ? 'bg-ink text-white' :
                  i === 2 ? 'bg-[#B45309] text-white' :
                  'bg-[#EDEAE5] text-ink-muted'
                )}>
                  {i + 1}
                </span>

                {/* Sujet */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors truncate">
                    {topic.topic}
                  </p>
                  <p className="text-[11px] text-ink-faint">
                    {topic.articleCount} articles
                  </p>
                </div>

                {/* Catégorie */}
                <span className="badge text-[10px] shrink-0 hidden sm:flex"
                  style={{ background: cat.bg, color: cat.text }}>
                  {topic.category}
                </span>

                {/* Variation */}
                <div className={cn(
                  'flex items-center gap-0.5 text-[11px] font-medium shrink-0',
                  topic.change > 0 ? 'text-[#16A34A]' :
                  topic.change < 0 ? 'text-[#EF4444]' : 'text-ink-faint'
                )}>
                  {topic.change > 0
                    ? <TrendingUp className="w-3 h-3" />
                    : topic.change < 0
                    ? <TrendingDown className="w-3 h-3" />
                    : <Minus className="w-3 h-3" />}
                  {Math.abs(topic.change)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Articles tendance ────────────────────────────── */}
      <div>
        <h2 className="font-display font-bold text-lg text-ink mb-4">
          Articles populaires
        </h2>

        {isLoading ? (
          <FeedSkeleton count={5} />
        ) : isError || articles.length === 0 ? (
          <PopularFromFeed />
        ) : (
          <div className="flex flex-col gap-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback — charge les articles populaires depuis le feed
function PopularFromFeed() {
  const { data, isLoading } = useQuery({
    queryKey:  ['feed', 'monde'],
    queryFn:   () => apiClient.get<{ data: Article[] }>('/feed?category=monde&page=1&pageSize=10'),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <FeedSkeleton count={5} />;

  const articles = data?.data ?? [];
  return (
    <div className="flex flex-col gap-3">
      {articles.slice(0, 8).map((article, i) => (
        <ArticleCard key={article.id} article={article} priority={i < 2} />
      ))}
    </div>
  );
}

// Données mock pour les tendances (en attendant un vrai service)
const MOCK_TOPICS: TrendTopic[] = [
  { id: '1',  topic: 'Intelligence Artificielle', articleCount: 342, change: 28,  category: 'technologie',  region: 'world' },
  { id: '2',  topic: 'Élections mondiales',        articleCount: 289, change: 15,  category: 'politique',    region: 'world' },
  { id: '3',  topic: 'Changement climatique',      articleCount: 256, change: 8,   category: 'environnement',region: 'world' },
  { id: '4',  topic: 'Économie mondiale',           articleCount: 234, change: -5,  category: 'economie',     region: 'world' },
  { id: '5',  topic: 'Conflit au Moyen-Orient',    articleCount: 198, change: 42,  category: 'monde',        region: 'world' },
  { id: '6',  topic: 'Santé publique',             articleCount: 167, change: 3,   category: 'sante',        region: 'world' },
  { id: '7',  topic: 'Exploration spatiale',       articleCount: 143, change: 19,  category: 'science',      region: 'world' },
  { id: '8',  topic: 'Crypto-monnaies',            articleCount: 128, change: -12, category: 'economie',     region: 'world' },
  { id: '9',  topic: 'Coupe du Monde 2026',        articleCount: 115, change: 67,  category: 'sport',        region: 'world' },
  { id: '10', topic: 'Énergie renouvelable',       articleCount: 98,  change: 11,  category: 'environnement',region: 'world' },
];