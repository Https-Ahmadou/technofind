'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home, TrendingUp, LayoutGrid, Bookmark, Settings,
  Globe, Cpu, Briefcase, Heart, FlaskConical, Trophy, Leaf, Users, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps { className?: string }

export function Sidebar({ className }: SidebarProps) {
  const t  = useTranslations('nav');
  const tc = useTranslations('categories');
  const tp = useTranslations('profile');
  const pathname = usePathname();

  const mainLinks = [
    { href: '/feed',       icon: Home,       label: t('home')       },
    { href: '/trends',     icon: TrendingUp, label: t('trends')     },
    { href: '/categories', icon: LayoutGrid, label: t('categories') },
    { href: '/saved',      icon: Bookmark,   label: t('saved')      },
    { href: '/alerts',     icon: Bell,       label: t('alerts')     },
  ];

  const categories = [
    { slug: 'monde',         icon: Globe        },
    { slug: 'technologie',   icon: Cpu          },
    { slug: 'economie',      icon: Briefcase    },
    { slug: 'sante',         icon: Heart        },
    { slug: 'science',       icon: FlaskConical },
    { slug: 'sport',         icon: Trophy       },
    { slug: 'environnement', icon: Leaf         },
    { slug: 'societe',       icon: Users        },
  ];

  return (
    <aside className={cn('flex flex-col gap-6', className)}>

      {/* Navigation principale */}
      <nav className="flex flex-col gap-0.5">
        {mainLinks.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-ink-muted hover:bg-[#EDEAE5] hover:text-ink'
              )}>
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'stroke-accent' : '')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Catégories */}
      <div>
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
          {t('categories')}
        </p>
        <nav className="flex flex-col gap-0.5">
          {categories.map(({ slug, icon: Icon }) => {
            const active = pathname?.startsWith(`/categories/${slug}`);
            return (
              <Link key={slug} href={`/categories/${slug}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors',
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-ink-muted hover:bg-[#EDEAE5] hover:text-ink'
                )}>
                <Icon className="w-4 h-4 shrink-0" />
                {tc(slug)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil */}
      <div className="mt-auto">
        <Link href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-ink-muted hover:bg-[#EDEAE5] hover:text-ink transition-colors">
          <Settings className="w-4 h-4 shrink-0" />
          {tp('title')}
        </Link>
      </div>
    </aside>
  );
}