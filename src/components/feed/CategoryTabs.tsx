'use client';

import { useTranslations } from 'next-intl';
import { ArticleCategory } from '@/types';
import { useFeedStore } from '@/store/feed.store';
import { cn } from '@/lib/utils';

const TAB_VALUES: (ArticleCategory | 'all')[] = [
  'all', 'monde', 'technologie', 'economie',
  'sport', 'science', 'sante', 'politique',
];

export function CategoryTabs() {
  const t = useTranslations('categories');
  const { activeCategory, setCategory } = useFeedStore();

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
      {TAB_VALUES.map((value) => (
        <button key={value} onClick={() => setCategory(value)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0',
            activeCategory === value
              ? 'bg-ink text-white shadow-sm'
              : 'bg-surface text-ink-muted border border-[#E8E5E0] hover:border-ink-muted hover:text-ink'
          )}>
          {t(value)}
        </button>
      ))}
    </div>
  );
}