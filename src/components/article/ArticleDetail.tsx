'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Bookmark, Share2, ExternalLink,
  Pause, Volume2, Clock, Calendar,
  Globe, ChevronRight
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { Article } from '@/types';
import { formatDate, estimateReadTime, cn } from '@/lib/utils';
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

interface Props { articleUrl: string }

export function ArticleDetail({ articleUrl }: Props) {
  const { savedIds, toggleSaved, selectedArticle } = useFeedStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [shared,    setShared]    = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { data: fetchedArticle, isLoading, isError } = useQuery({
    queryKey:  ['article', articleUrl],
    queryFn:   () => apiClient.get<Article>(`/articles/${encodeURIComponent(articleUrl)}`),
    enabled:   !!articleUrl && !selectedArticle,
    staleTime: 10 * 60 * 1000,
  });

  const article  = selectedArticle ?? fetchedArticle;
  const isSaved  = article ? savedIds.includes(article.id) : false;
  const readTime = article ? (article.readTime ?? estimateReadTime(article.content)) : 0;
  const image    = article?.media?.[0];
  const cat      = article ? (CAT_STYLES[article.category] ?? CAT_STYLES.monde) : CAT_STYLES.monde;

  function toggleTTS() {
    if (!article) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const text  = `${article.title}. ${article.summary || article.content}`;
    const utt   = new SpeechSynthesisUtterance(text);
    utt.lang    = 'fr-FR';
    utt.rate    = 0.95;
    utt.onend   = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setIsPlaying(true);
  }

  async function handleShare() {
    if (!article) return;
    if (navigator.share) {
      await navigator.share({ title: article.title, url: article.url });
    } else {
      await navigator.clipboard.writeText(article.url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  if (isLoading && !selectedArticle) return <ArticleSkeleton />;
  if ((isError && !selectedArticle) || !article) return <ArticleError />;

  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-3 animate-fade-up">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-ink-faint">
        <Link href="/feed" className="flex items-center gap-1 hover:text-accent transition-colors">
          <ArrowLeft className="w-3 h-3" /> Accueil
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink-muted capitalize">{article.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="truncate max-w-[200px]">{article.source.name}</span>
      </div>

      {/* Hero card */}
      <div className="card overflow-hidden">
        {image ? (
          <div className="relative aspect-video overflow-hidden">
            <Image src={image.url} alt={image.alt || article.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="badge text-[11px] font-semibold shadow-sm"
                style={{ background: cat.bg, color: cat.text }}>{article.category}</span>
            </div>
          </div>
        ) : (
          <div className="dark-hero h-48 relative overflow-hidden">
            <div className="hero-orb-1" /><div className="hero-orb-2" /><div className="hero-grid" />
            <div className="absolute bottom-4 left-4">
              <span className="badge text-[11px] font-semibold"
                style={{ background: cat.bg, color: cat.text }}>{article.category}</span>
            </div>
          </div>
        )}

        <div className="p-6 flex flex-col gap-4">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink leading-tight text-balance">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 flex-wrap text-[12px] text-ink-muted">
            {article.author && <span className="font-medium text-ink">{article.author}</span>}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />{formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{readTime} min de lecture
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />{article.source.name}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#E8E5E0]">
            <button onClick={toggleTTS}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                isPlaying
                  ? 'bg-accent text-white shadow-accent'
                  : 'bg-[#FBF0EB] text-accent hover:bg-accent hover:text-white'
              )}>
              {isPlaying
                ? <><Pause className="w-4 h-4" /> Pause</>
                : <><Volume2 className="w-4 h-4" /> Écouter</>}
            </button>

            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => toggleSaved(article.id)}
                className={cn('w-9 h-9 flex items-center justify-center rounded-xl transition-colors',
                  isSaved ? 'bg-accent/10 text-accent' : 'text-ink-faint hover:bg-[#FBF0EB] hover:text-accent')}>
                <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
              </button>
              <button onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded-xl relative text-ink-faint hover:bg-[#EDEAE5] hover:text-ink transition-colors">
                <Share2 className="w-4 h-4" />
                {shared && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                    Copié !
                  </span>
                )}
              </button>
              <a href={article.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-ink text-white hover:opacity-85 transition-opacity ml-1">
                <ExternalLink className="w-3.5 h-3.5" /> Source
              </a>
            </div>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FBF0EB] border border-accent/20 animate-fade-up">
              <Volume2 className="w-4 h-4 text-accent shrink-0" />
              <div className="flex gap-0.5 items-end h-5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-accent rounded-full animate-pulse"
                    style={{ height: `${(i % 3 + 1) * 5 + 4}px`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-[12px] text-accent font-medium">Lecture en cours…</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      {(article.summary || article.content) && (
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg text-ink mb-4">Résumé</h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {article.summary || article.content}
          </p>
          <a href={article.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-6 py-3 rounded-xl border-2 border-dashed border-[#E8E5E0] text-sm text-ink-muted hover:border-accent hover:text-accent transition-colors group">
            Lire l'article complet sur {article.source.name}
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}

      <Link href="/feed"
        className="flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors mt-2">
        <ArrowLeft className="w-4 h-4" /> Retour aux actualités
      </Link>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-3">
      <div className="card overflow-hidden">
        <div className="skeleton aspect-video" />
        <div className="p-6 flex flex-col gap-4">
          <div className="skeleton h-8 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

function ArticleError() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card flex flex-col items-center gap-4 py-14 text-center">
        <span className="text-4xl">📰</span>
        <div>
          <p className="font-display font-bold text-ink mb-1">Article introuvable</p>
          <p className="text-sm text-ink-muted">Cet article n'est plus disponible.</p>
        </div>
        <Link href="/feed"
          className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 shadow-accent">
          Retour au feed
        </Link>
      </div>
    </div>
  );
}