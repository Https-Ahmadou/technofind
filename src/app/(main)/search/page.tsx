import type { Metadata } from 'next';
import { SearchPage } from '@/components/search/SearchPage';

export const metadata: Metadata = { title: 'Recherche' };

export default function Search() {
  return <SearchPage />;
}