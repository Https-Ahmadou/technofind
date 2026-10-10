'use client';

import { useState } from 'react';
import {
  X, Link2, Check, Twitter, Facebook,
  Linkedin, MessageCircle, Mail
} from 'lucide-react';
import { Article } from '@/types';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  article:  Article;
  onClose:  () => void;
}

const PLATFORMS = [
  {
    name:    'Twitter / X',
    icon:    Twitter,
    color:   '#000000',
    bg:      '#F0F0F0',
    getUrl:  (article: Article) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`,
  },
  {
    name:    'Facebook',
    icon:    Facebook,
    color:   '#1877F2',
    bg:      '#E7F3FF',
    getUrl:  (article: Article) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`,
  },
  {
    name:    'LinkedIn',
    icon:    Linkedin,
    color:   '#0A66C2',
    bg:      '#E8F0F9',
    getUrl:  (article: Article) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`,
  },
  {
    name:    'WhatsApp',
    icon:    MessageCircle,
    color:   '#25D366',
    bg:      '#E8F8EE',
    getUrl:  (article: Article) =>
      `https://wa.me/?text=${encodeURIComponent(`${article.title} — ${article.url}`)}`,
  },
  {
    name:    'Email',
    icon:    Mail,
    color:   '#D4541A',
    bg:      '#FBF0EB',
    getUrl:  (article: Article) =>
      `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Je t'envoie cet article : ${article.url}`)}`,
  },
];

export function ShareModal({ article, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(article.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = article.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handlePlatform(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  }

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text:  article.summary,
        url:   article.url,
      });
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-up"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:inset-auto sm:top-1/2 sm:left-1/2
        sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md
        bg-surface rounded-t-2xl sm:rounded-2xl shadow-card-lg animate-slide-up p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-base text-ink">
              Partager l'article
            </h2>
            <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-2">
              {article.title}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-ink-faint hover:bg-[#EDEAE5] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plateformes */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {PLATFORMS.map(({ name, icon: Icon, color, bg, getUrl }) => (
            <button key={name}
              onClick={() => handlePlatform(getUrl(article))}
              className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center
                transition-transform group-hover:scale-110"
                style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-[10px] text-ink-faint text-center leading-tight">
                {name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Partage natif (mobile) */}
        {'share' in navigator && (
          <button onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-[#E8E5E0] text-sm
              text-ink-muted hover:border-accent hover:text-accent transition-colors mb-3">
            📱 Partager via...
          </button>
        )}

        {/* Copier le lien */}
        <div className="flex gap-2">
          <div className="flex-1 h-11 px-3 rounded-xl border border-[#E8E5E0] bg-[#F5F3EF]
            flex items-center overflow-hidden">
            <span className="text-[11px] text-ink-faint truncate">{article.url}</span>
          </div>
          <button onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-4 h-11 rounded-xl text-sm font-medium transition-all shrink-0',
              copied
                ? 'bg-[#16A34A] text-white'
                : 'bg-accent text-white hover:opacity-90 shadow-accent'
            )}>
            {copied
              ? <><Check className="w-4 h-4" /> Copié !</>
              : <><Link2 className="w-4 h-4" /> Copier</>}
          </button>
        </div>
      </div>
    </>
  );
}