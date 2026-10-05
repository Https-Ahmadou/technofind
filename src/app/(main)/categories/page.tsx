import type { Metadata } from 'next';
import { CategoriesPage } from '@/components/categories/CategoriesPage';

export const metadata: Metadata = { title: 'Catégories' };

export default function Categories() {
  return <CategoriesPage />;
}