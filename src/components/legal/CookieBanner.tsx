'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, Check } from 'lucide-react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem('cookie_consent', 'accepted'); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem('cookie_consent', 'declined'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-sm animate-fade-up">
      <div className="card p-4 shadow-card-lg border border-[#E8E5E0]">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#FBF0EB] flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink mb-1">
              🍪 Nous utilisons des cookies
            </p>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Des cookies essentiels sont utilisés pour votre connexion et vos préférences.{' '}
              <Link href="/legal/cookies" className="text-accent hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
          <button onClick={decline}
            className="text-ink-faint hover:text-ink transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={decline}
            className="flex-1 py-2 rounded-xl border border-[#E8E5E0] text-xs
              text-ink-muted hover:bg-[#EDEAE5] transition-colors">
            Refuser
          </button>
          <button onClick={accept}
            className="flex-1 py-2 rounded-xl bg-accent text-white text-xs font-medium
              hover:opacity-90 transition-opacity shadow-accent flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}