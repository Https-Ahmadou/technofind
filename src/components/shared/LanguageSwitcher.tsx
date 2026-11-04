'use client';

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'fr', label: 'Français',  flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', label: 'English',   flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية',   flag: '🇸🇦', dir: 'rtl' },
  { code: 'wo', label: 'Wolof',     flag: '🇸🇳', dir: 'ltr' },
  { code: 'es', label: 'Español',   flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
];

export function LanguageSwitcher() {
  const [open, setOpen]       = useState(false);
  const [current, setCurrent] = useState(() => {
    try {
      return document.cookie
        .split('; ')
        .find(r => r.startsWith('locale='))
        ?.split('=')[1] || 'fr';
    } catch {
      return 'fr';
    }
  });

  function changeLanguage(code: string, dir: string) {
    document.cookie = `locale=${code}; path=/; max-age=31536000`;
    document.documentElement.lang = code;
    document.documentElement.dir  = dir;
    setCurrent(code);
    setOpen(false);
    window.location.reload();
  }

  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  return (
    <div className="relative">
      <button onClick={() => setOpen(s => !s)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E5E0]
          text-sm text-ink-muted hover:border-accent hover:text-accent transition-colors bg-surface">
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag} {currentLang.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-48
            bg-surface border border-[#E8E5E0] rounded-xl shadow-card-md
            overflow-hidden animate-fade-up">
            {LANGUAGES.map(({ code, label, flag, dir }) => (
              <button key={code}
                onClick={() => changeLanguage(code, dir)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                  current === code
                    ? 'bg-accent/10 text-accent'
                    : 'text-ink-muted hover:bg-[#EDEAE5] hover:text-ink'
                )}>
                <span className="text-base">{flag}</span>
                <span className="flex-1">{label}</span>
                {current === code && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}