import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { fr, enUS, ar, es, ptBR } from 'date-fns/locale';
import type { Locale } from 'date-fns';

const LOCALES: Record<string, Locale> = {
  fr: fr,
  en: enUS,
  ar: ar,
  es: es,
  pt: ptBR,
  wo: fr, // pas de locale wolof dans date-fns, repli sur le français
};

export function timeAgo(dateStr: string, locale = 'fr'): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), {
      addSuffix: true,
      locale: LOCALES[locale] ?? fr,
    });
  } catch {
    return '';
  }
}

export function formatDate(dateStr: string, locale = 'fr', pattern = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), pattern, { locale: LOCALES[locale] ?? fr });
  } catch {
    return '';
  }
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}