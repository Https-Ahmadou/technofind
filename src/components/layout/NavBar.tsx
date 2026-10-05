'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Bookmark, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

const navLinks = [
  { href: '/feed',       label: 'Accueil'    },
  { href: '/trends',     label: 'Tendances'  },
  { href: '/categories', label: 'Catégories' },
];

export function NavBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16
      bg-[#F5F3EF]/95 backdrop-blur-md border-b border-[#E8E5E0]">
      <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center gap-4">

        {/* ── Logo ─────────────────────────────────────── */}
        <Link href="/feed" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-accent to-[#f08040]
            flex items-center justify-center shadow-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="font-display font-black text-[20px] tracking-tight text-ink hidden sm:block">
            Techno<span className="text-accent">Find</span>
          </span>
        </Link>

        {/* ── Nav links desktop ─────────────────────────── */}
        <nav className="hidden md:flex items-center gap-0.5 ml-4">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname?.startsWith(href)
                  ? 'text-accent bg-accent/8'
                  : 'text-ink-muted hover:text-ink hover:bg-[#EDEAE5]'
              )}>
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Search ────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-ink-faint pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher des actualités…"
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface border border-[#E8E5E0]
                text-ink text-sm placeholder:text-ink-faint outline-none
                focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-card"
            />
          </div>
        </form>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {isAuthenticated ? (
            <>
              <Link href="/saved" aria-label="Sauvegardés"
                className="w-9 h-9 flex items-center justify-center rounded-full
                  text-ink-muted hover:bg-[#EDEAE5] transition-colors">
                <Bookmark className="w-[18px] h-[18px]" />
              </Link>

              <button aria-label="Notifications"
                className="w-9 h-9 flex items-center justify-center rounded-full
                  text-ink-muted hover:bg-[#EDEAE5] transition-colors relative">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent
                  rounded-full border-2 border-[#F5F3EF] animate-pulse-dot" />
              </button>

              <Link href="/profile"
                className="w-9 h-9 ml-1 flex items-center justify-center rounded-full
                  bg-ink text-white text-sm font-semibold hover:opacity-85 transition-opacity">
                {user?.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
              </Link>
            </>
          ) : (
            <Link href="/login"
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium
                hover:opacity-90 transition-opacity shadow-accent">
              Connexion
            </Link>
          )}

          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full
            text-ink-muted hover:bg-[#EDEAE5] ml-1" aria-label="Menu">
            <Menu className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}