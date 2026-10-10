'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Article } from '@/types';
import { ShareModal } from './ShareModal';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  article:   Article;
  className?: string;
  size?:     'sm' | 'md';
}

export function ShareButton({ article, className, size = 'sm' }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        aria-label="Partager"
        className={cn(
          'flex items-center justify-center rounded-lg transition-colors',
          size === 'sm'
            ? 'w-7 h-7 text-ink-faint hover:text-ink hover:bg-[#EDEAE5]'
            : 'w-9 h-9 text-ink-faint hover:text-ink hover:bg-[#EDEAE5]',
          className
        )}>
        <Share2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      {open && (
        <ShareModal article={article} onClose={() => setOpen(false)} />
      )}
    </>
  );
}