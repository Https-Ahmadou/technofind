import type { Metadata } from 'next';
import { ArticleDetail } from '@/components/article/ArticleDetail';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Article' };

export default function ArticlePage({ params }: Props) {
  const url = decodeURIComponent(params.id);
  return <ArticleDetail articleUrl={url} />;
}