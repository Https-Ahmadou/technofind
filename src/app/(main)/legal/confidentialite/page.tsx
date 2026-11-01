import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Politique de Confidentialité' };

export default function Confidentialite() {
  return <LegalPage type="confidentialite" />;
}