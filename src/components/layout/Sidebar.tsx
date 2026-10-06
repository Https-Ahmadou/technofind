'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, TrendingUp, LayoutGrid, Bookmark, Settings,
  Globe, Cpu, Briefcase, Heart, FlaskConical, Trophy, Leaf, Users, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainLinks = [
  { href: '/feed',       icon: Home,        label: 'Accueil'     },
  { href: '/trends',     icon: TrendingUp,  label: 'Tendances'   },
  { href: '/categories', icon: LayoutGrid,  label: 'Catégories'  },
  { href: '/saved',      icon: Bookmark,    label: 'Sauvegardés' },
  { href: '/alerts',     icon: Bell,        label: 'Alertes'     },
];

const categories = [
  { slug: 'monde',         icon: Globe,        label: 'Monde'         },
  { slug: 'technologie',   icon: Cpu,          label: 'Technologie'   },
  { slug: 'economie',      icon: Briefcase,    label: 'Économie'      },
  { slug: 'sante',         icon: Heart,        label: 'Santé'         },
  { slug: 'science',       icon: FlaskConical, label: 'Science'       },
  { slug: 'sport',         icon: Trophy,       label: 'Sport'         },
  { slug: 'environnement', icon: Leaf,         label: 'Environnement' },
  { slug: 'societe',       icon: Users,        label: 'Société'       },
];

interface SidebarProps { className?: string }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('flex flex-col gap-6', className)}>

      {/* ── Navigation principale ─────────────────────── */}
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

      {/* ── Catégories ────────────────────────────────── */}
      <div>
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
          Catégories
        </p>
        <nav className="flex flex-col gap-0.5">
          {categories.map(({ slug, icon: Icon, label }) => {
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
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Paramètres ────────────────────────────────── */}
      <div className="mt-auto">
        <Link href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-ink-muted hover:bg-[#EDEAE5] hover:text-ink transition-colors">
          <Settings className="w-4 h-4 shrink-0" />
          Paramètres
        </Link>
      </div>
    </aside>
  );
}