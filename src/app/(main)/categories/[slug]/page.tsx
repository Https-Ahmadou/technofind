import type { Metadata } from 'next';
import { CategoryFeed } from '@/components/categories/CategoryFeed';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const labels: Record<string, string> = {
    monde: 'Monde', technologie: 'Technologie', economie: 'Économie',
    sport: 'Sport', science: 'Science', sante: 'Santé',
    politique: 'Politique', environnement: 'Environnement', societe: 'Société',
  };
  return { title: labels[params.slug] ?? 'Catégorie' };
}

export default function CategoryPage({ params }: Props) {
  return <CategoryFeed slug={params.slug} />;
}