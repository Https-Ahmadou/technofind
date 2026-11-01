import { NavBar } from './NavBar';
import { Sidebar } from './Sidebar';
import { CookieBanner } from '@/components/legal/CookieBanner';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <NavBar />
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 pt-20 pb-8 flex gap-6 flex-1">
        <Sidebar className="hidden lg:flex w-56 shrink-0 flex-col gap-2
          sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide" />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer légal */}
      <footer className="border-t border-[#E8E5E0] bg-surface py-4 mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-wrap items-center
          justify-between gap-3 text-[11px] text-ink-faint">
          <span>© 2026 TechnoFind — Tous droits réservés</span>
          <div className="flex items-center gap-4">
            <a href="/legal/cgu"
              className="hover:text-accent transition-colors">
              CGU
            </a>
            <a href="/legal/confidentialite"
              className="hover:text-accent transition-colors">
              Confidentialité
            </a>
            <a href="/legal/cookies"
              className="hover:text-accent transition-colors">
              Cookies
            </a>
            <a href="mailto:fayepapeahmadou63@gmail.com"
              className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Bannière cookies */}
      <CookieBanner />
    </div>
  );
}