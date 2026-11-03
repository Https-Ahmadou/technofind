'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Article } from '@/types';
import { ReportModal } from './ReportModal';
import { cn } from '@/lib/utils';

interface ReportButtonProps {
  article:    Article;
  className?: string;
  size?:      'sm' | 'md';
}

export function ReportButton({ article, className, size = 'sm' }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        aria-label="Signaler"
        className={cn(
          'flex items-center justify-center rounded-lg transition-colors',
          size === 'sm'
            ? 'w-7 h-7 text-ink-faint hover:text-[#EF4444] hover:bg-[#FEF2F2]'
            : 'w-9 h-9 text-ink-faint hover:text-[#EF4444] hover:bg-[#FEF2F2]',
          className
        )}>
        <Flag className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      {open && (
        <ReportModal article={article} onClose={() => setOpen(false)} />
      )}
    </>
  );
}