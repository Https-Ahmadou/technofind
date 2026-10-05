'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Share2, ExternalLink, Clock } from 'lucide-react';
import { Article } from '@/types';
import { timeAgo, estimateReadTime, cn } from '@/lib/utils';
import { useFeedStore } from '@/store/feed.store';

const CAT_STYLES: Record<string, { bg: string; text: string }> = {
  technologie:   { bg: '#EFF6FF', text: '#2563EB' },
  economie:      { bg: '#FEF9EC', text: '#B45309' },
  sport:         { bg: '#F0FDF4', text: '#16A34A' },
  sante:         { bg: '#FFF1F2', text: '#BE123C' },
  science:       { bg: '#F5F3FF', text: '#7C3AED' },
  politique:     { bg: '#F1F5F9', text: '#475569' },
  monde:         { bg: '#FBF0EB', text: '#D4541A' },
  environnement: { bg: '#F0FDF4', text: '#15803D' },
  culture:       { bg: '#FFF7ED', text: '#C2410C' },
  societe:       { bg: '#F5F3FF', text: '#6D28D9' },
};

interface ArticleCardProps {
  article:   Article;
  layout?:   'list' | 'grid' | 'magazine';
  priority?: boolean;
}

export function ArticleCard({ article, layout = 'list', priority = false }: ArticleCardProps) {
  const { savedIds, toggleSaved, setSelectedArticle } = useFeedStore();
  const isSaved  = savedIds.includes(article.id);
  const image    = article.media?.[0];
  const readTime = article.readTime ?? estimateReadTime(article.content);
  const cat      = CAT_STYLES[article.category] ?? CAT_STYLES.monde;

  if (layout === 'grid') {
    return (
      <article className="card flex flex-col overflow-hidden group animate-fade-up
        hover:shadow-card-md transition-shadow duration-300">
        {image ? (
          <div className="relative aspect-video overflow-hidden">
            <Image src={image.url} alt={image.alt || article.title}
              fill className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority} />
          </div>
        ) : (
          <div className="aspect-video dark-hero overflow-hidden">
            <div className="hero-orb-1" /><div className="hero-orb-2" /><div className="hero-grid" />
          </div>
        )}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          <span className="badge text-[10px]" style={{ background: cat.bg, color: cat.text }}>
            {article.category}
          </span>
          <Link href={`/article/${encodeURIComponent(article.id)}`}
            onClick={() => setSelectedArticle(article)}>
            <h2 className="font-display font-bold text-sm leading-snug line-clamp-3
              text-ink hover:text-accent transition-colors text-balance">
              {article.title}
            </h2>
          </Link>
          <div className="flex items-center justify-between mt-auto pt-1">
            <Meta article={article} readTime={readTime} />
            <Actions article={article} isSaved={isSaved} onToggle={toggleSaved} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card flex gap-4 p-4 group animate-fade-up
      hover:shadow-card-md transition-shadow duration-300">
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge text-[10px]" style={{ background: cat.bg, color: cat.text }}>
            {article.category}
          </span>
          <span className="text-[11px] text-ink-faint font-medium">{article.source.name}</span>
        </div>
        <Link href={`/article/${encodeURIComponent(article.id)}`}
          onClick={() => setSelectedArticle(article)}>
          <h2 className="font-display font-bold text-[14px] leading-snug line-clamp-2
            text-ink hover:text-accent transition-colors text-balance">
            {article.title}
          </h2>
        </Link>
        <p className="text-[12px] text-ink-muted line-clamp-2 leading-relaxed hidden sm:block">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-auto pt-0.5">
          <Meta article={article} readTime={readTime} />
          <Actions article={article} isSaved={isSaved} onToggle={toggleSaved} />
        </div>
      </div>
      {image ? (
        <div className="relative w-28 h-[88px] sm:w-32 sm:h-24 shrink-0 rounded-xl overflow-hidden">
          <Image src={image.url} alt={image.alt || article.title}
            fill className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority} />
        </div>
      ) : (
        <div className="w-28 h-[88px] sm:w-32 sm:h-24 shrink-0 rounded-xl dark-hero overflow-hidden">
          <div className="hero-orb-1 !w-32 !h-32" /><div className="hero-grid" />
        </div>
      )}
    </article>
  );
}

function Meta({ article, readTime }: { article: Article; readTime: number }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-ink-faint">
      <span>{timeAgo(article.publishedAt)}</span>
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />{readTime} min
      </span>
    </div>
  );
}

function Actions({ article, isSaved, onToggle }: {
  article:  Article;
  isSaved:  boolean;
  onToggle: (id: string, article?: Article) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <button onClick={() => onToggle(article.id, article)}
        aria-label={isSaved ? 'Retirer' : 'Sauvegarder'}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
          isSaved ? 'text-accent bg-accent/10' : 'text-ink-faint hover:text-accent hover:bg-[#FBF0EB]'
        )}>
        <Bookmark className={cn('w-3.5 h-3.5', isSaved && 'fill-current')} />
      </button>
      <button aria-label="Partager"
        className="w-7 h-7 flex items-center justify-center rounded-lg
          text-ink-faint hover:text-ink hover:bg-[#EDEAE5] transition-colors">
        <Share2 className="w-3.5 h-3.5" />
      </button>
      <a href={article.url} target="_blank" rel="noopener noreferrer"
        aria-label="Source"
        className="w-7 h-7 flex items-center justify-center rounded-lg
          text-ink-faint hover:text-ink hover:bg-[#EDEAE5] transition-colors">
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}