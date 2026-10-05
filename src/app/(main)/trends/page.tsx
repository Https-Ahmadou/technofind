import type { Metadata } from 'next';
import { TrendsPage } from '@/components/trends/TrendsPage';

export const metadata: Metadata = { title: 'Tendances' };

export default function Trends() {
  return <TrendsPage />;
}