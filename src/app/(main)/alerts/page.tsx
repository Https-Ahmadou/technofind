import type { Metadata } from 'next';
import { AlertsPage } from '@/components/alerts/AlertsPage';

export const metadata: Metadata = { title: 'Alertes' };

export default function Alerts() {
  return <AlertsPage />;
}