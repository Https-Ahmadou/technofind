import type { Metadata } from 'next';
import { FeedPage } from '@/components/feed/FeedPage';

export const metadata: Metadata = {
  title: 'Actualités',
  description: 'Votre feed d\'actualités personnalisé en temps réel.',
};

export default function Feed() {
  return <FeedPage />;
}
