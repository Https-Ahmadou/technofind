'use client';

import { useState } from 'react';
import { X, Link2, Check, MessageCircle, Mail } from 'lucide-react';
import { Article } from '@/types';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  article: Article;
  onClose: () => void;
}

const PLATFORMS = [
  {
    name:   'Twitter / X',
    color:  '#000000',
    bg:     '#F0F0F0',
    icon:   (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (a: Article) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(a.url)}`,
  },
  {
    name:   'Facebook',
    color:  '#1877F2',
    bg:     '#E7F3FF',
    icon:   (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (a: Article) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(a.url)}`,
  },
  {
    name:   'LinkedIn',
    color:  '#0A66C2',
    bg:     '#E8F0F9',
    icon:   (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    getUrl: (a: Article) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(a.url)}`,
  },
  {
    name:   'WhatsApp',
    color:  '#25D366',
    bg:     '#E8F8EE',
    icon:   <MessageCircle className="w-5 h-5" />,
    getUrl: (a: Article) =>
      `https://wa.me/?text=${encodeURIComponent(`${a.title} — ${a.url}`)}`,
  },
  {
    name:   'Email',
    color:  '#D4541A',
    bg:     '#FBF0EB',
    icon:   <Mail className="w-5 h-5" />,
    getUrl: (a: Article) =>
      `mailto:?subject=${encodeURIComponent(a.title)}&body=${encodeURIComponent(`Je t'envoie cet article : ${a.url}`)}`,
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:inset-auto sm:top-1/2 sm:left-1/2
        sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md
        bg-surface rounded-t-2xl sm:rounded-2xl shadow-card-lg p-5 animate-fade-up">

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
          {PLATFORMS.map(({ name, color, bg, icon, getUrl }) => (
            <button key={name}
              onClick={() => handlePlatform(getUrl(article))}
              className="flex flex-col items-center gap-1.5 group">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center
                  transition-transform group-hover:scale-110"
                style={{ background: bg, color }}>
                {icon}
              </div>
              <span className="text-[10px] text-ink-faint text-center leading-tight">
                {name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Partage natif */}
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