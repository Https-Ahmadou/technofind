import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPage } from '@/components/search/SearchPage';
import { FeedSkeleton } from '@/components/feed/ArticleSkeleton';

export const metadata: Metadata = { title: 'Recherche' };

export default function Search() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <SearchPage />
    </Suspense>
  );
}