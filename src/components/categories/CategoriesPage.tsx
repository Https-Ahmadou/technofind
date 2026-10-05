'use client';

import Link from 'next/link';
import {
  Globe, Cpu, Briefcase, Heart, FlaskConical,
  Trophy, Leaf, Users, Flag, ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  {
    slug:        'monde',
    label:       'Monde',
    description: 'Actualités internationales et géopolitique',
    icon:        Globe,
    bg:          '#FBF0EB',
    color:       '#D4541A',
    emoji:       '🌍',
  },
  {
    slug:        'technologie',
    label:       'Technologie',
    description: 'IA, startups, gadgets et innovation',
    icon:        Cpu,
    bg:          '#EFF6FF',
    color:       '#2563EB',
    emoji:       '💻',
  },
  {
    slug:        'economie',
    label:       'Économie',
    description: 'Marchés, finance et business mondial',
    icon:        Briefcase,
    bg:          '#FEF9EC',
    color:       '#B45309',
    emoji:       '📈',
  },
  {
    slug:        'sante',
    label:       'Santé',
    description: 'Médecine, bien-être et santé publique',
    icon:        Heart,
    bg:          '#FFF1F2',
    color:       '#BE123C',
    emoji:       '🏥',
  },
  {
    slug:        'science',
    label:       'Science',
    description: 'Découvertes, recherche et espace',
    icon:        FlaskConical,
    bg:          '#F5F3FF',
    color:       '#7C3AED',
    emoji:       '🔬',
  },
  {
    slug:        'sport',
    label:       'Sport',
    description: 'Football, tennis, basket et plus',
    icon:        Trophy,
    bg:          '#F0FDF4',
    color:       '#16A34A',
    emoji:       '⚽',
  },
  {
    slug:        'environnement',
    label:       'Environnement',
    description: 'Climat, écologie et développement durable',
    icon:        Leaf,
    bg:          '#F0FDF4',
    color:       '#15803D',
    emoji:       '🌱',
  },
  {
    slug:        'societe',
    label:       'Société',
    description: 'Culture, éducation et vie sociale',
    icon:        Users,
    bg:          '#F5F3FF',
    color:       '#6D28D9',
    emoji:       '👥',
  },
  {
    slug:        'politique',
    label:       'Politique',
    description: 'Élections, gouvernements et diplomatie',
    icon:        Flag,
    bg:          '#F1F5F9',
    color:       '#475569',
    emoji:       '🏛️',
  },
];

export function CategoriesPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="font-display font-black text-2xl text-ink">Catégories</h1>
        <p className="text-sm text-ink-muted mt-1">
          Explorez les actualités par thème
        </p>
      </div>

      {/* ── Grille des catégories ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map(({ slug, label, description, icon: Icon, bg, color, emoji }) => (
          <Link key={slug} href={`/categories/${slug}`}
            className="card p-5 flex items-center gap-4 group
              hover:shadow-card-md transition-all duration-300 hover:-translate-y-0.5">

            {/* Icône */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center
              text-2xl shrink-0 transition-transform group-hover:scale-110"
              style={{ background: bg }}>
              {emoji}
            </div>

            {/* Texte */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-base text-ink
                group-hover:text-accent transition-colors">
                {label}
              </h2>
              <p className="text-[12px] text-ink-muted mt-0.5 line-clamp-1">
                {description}
              </p>
            </div>

            {/* Flèche */}
            <ArrowRight className="w-4 h-4 text-ink-faint shrink-0
              group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}