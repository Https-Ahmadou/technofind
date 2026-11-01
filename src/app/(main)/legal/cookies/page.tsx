import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Politique de Cookies' };

export default function Cookies() {
  return <LegalPage type="cookies" />;
}