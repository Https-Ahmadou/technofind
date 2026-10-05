'use client';

import { ArticleCategory } from '@/types';
import { useFeedStore } from '@/store/feed.store';
import { cn } from '@/lib/utils';

const TABS: { value: ArticleCategory | 'all'; label: string }[] = [
  { value: 'all',         label: 'Tout'        },
  { value: 'monde',       label: 'Monde'       },
  { value: 'technologie', label: 'Tech'        },
  { value: 'economie',    label: 'Économie'    },
  { value: 'sport',       label: 'Sport'       },
  { value: 'science',     label: 'Science'     },
  { value: 'sante',       label: 'Santé'       },
  { value: 'politique',   label: 'Politique'   },
];

export function CategoryTabs() {
  const { activeCategory, setCategory } = useFeedStore();

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
      {TABS.map(({ value, label }) => (
        <button key={value} onClick={() => setCategory(value)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0',
            activeCategory === value
              ? 'bg-ink text-white shadow-sm'
              : 'bg-surface text-ink-muted border border-[#E8E5E0] hover:border-ink-muted hover:text-ink'
          )}>
          {label}
        </button>
      ))}
    </div>
  );
}
