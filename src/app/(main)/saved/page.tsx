import type { Metadata } from 'next';
import { SavedPage } from '@/components/saved/SavedPage';

export const metadata: Metadata = { title: 'Sauvegardés' };

export default function Saved() {
  return <SavedPage />;
}