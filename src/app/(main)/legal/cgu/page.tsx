import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Conditions Générales d\'Utilisation' };

export default function CGU() {
  return <LegalPage type="cgu" />;
}