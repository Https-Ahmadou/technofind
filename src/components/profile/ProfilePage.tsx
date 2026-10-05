'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Bell, Palette, LayoutList,
  LogOut, ChevronRight, Check, Moon, Sun,
  Globe, Bookmark, Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useFeedStore } from '@/store/feed.store';
import { useLogout } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';

const THEMES = [
  { value: 'light',  label: 'Clair',   icon: Sun  },
  { value: 'dark',   label: 'Sombre',  icon: Moon },
  { value: 'system', label: 'Système', icon: Globe },
];

const LAYOUTS = [
  { value: 'list',     label: 'Liste'    },
  { value: 'grid',     label: 'Grille'   },
  { value: 'magazine', label: 'Magazine' },
];

export function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { savedArticles, layout, setLayout } = useFeedStore();
  const logout = useLogout();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isAuthenticated || !user) {
    return <NotConnected />;
  }

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto">

      {/* ── Avatar + infos ──────────────────────────────── */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center
          text-white font-display font-bold text-2xl shrink-0">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-xl text-ink truncate">{user.name}</h1>
          <p className="text-sm text-ink-muted truncate">{user.email}</p>
          <span className={cn(
            'inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium',
            user.plan === 'premium'
              ? 'bg-[#FEF9EC] text-[#B45309]'
              : 'bg-[#EDEAE5] text-ink-muted'
          )}>
            {user.plan === 'premium' ? '⭐ Premium' : '🆓 Gratuit'}
          </span>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-[#FBF0EB] flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">{savedArticles.length}</p>
          <p className="text-[11px] text-ink-muted">Articles sauvegardés</p>
        </div>
        <div className="card p-4 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">FR</p>
          <p className="text-[11px] text-ink-muted">Langue préférée</p>
        </div>
      </div>

      {/* ── Apparence ───────────────────────────────────── */}
      <Section title="Apparence" icon={<Palette className="w-4 h-4" />}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            Thème
          </p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setTheme(value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm',
                  theme === value
                    ? 'border-accent bg-[#FBF0EB] text-accent'
                    : 'border-[#E8E5E0] text-ink-muted hover:border-ink-muted'
                )}>
                <Icon className="w-5 h-5" />
                {label}
                {theme === value && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            Disposition du feed
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LAYOUTS.map(({ value, label }) => (
              <button key={value} onClick={() => setLayout(value as 'list' | 'grid' | 'magazine')}
                className={cn(
                  'flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-sm',
                  layout === value
                    ? 'border-accent bg-[#FBF0EB] text-accent'
                    : 'border-[#E8E5E0] text-ink-muted hover:border-ink-muted'
                )}>
                <LayoutList className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Notifications ───────────────────────────────── */}
      <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
        <ToggleRow
          label="Notifications push"
          description="Recevoir les breaking news"
          value={notifications}
          onChange={setNotifications}
        />
      </Section>

      {/* ── Compte ──────────────────────────────────────── */}
      <Section title="Compte" icon={<User className="w-4 h-4" />}>
        <MenuRow icon={<Mail className="w-4 h-4" />} label="Modifier l'email" />
        <MenuRow icon={<Shield className="w-4 h-4" />} label="Changer le mot de passe" />
        <MenuRow icon={<Globe className="w-4 h-4" />} label="Langue de l'interface" value="Français" />
      </Section>

      {/* ── Déconnexion ─────────────────────────────────── */}
      {!showLogoutConfirm ? (
        <button onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
            border-2 border-[#FECACA] text-[#EF4444] text-sm font-medium
            hover:bg-[#FEF2F2] transition-colors">
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      ) : (
        <div className="card p-4 flex flex-col gap-3">
          <p className="text-sm text-ink text-center font-medium">
            Confirmer la déconnexion ?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E5E0] text-sm
                text-ink-muted hover:bg-[#EDEAE5] transition-colors">
              Annuler
            </button>
            <button onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-white text-sm
                font-medium hover:opacity-90 transition-opacity">
              Confirmer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composants helper ─────────────────────────────────────────────────────────
function Section({ title, icon, children }: {
  title:    string;
  icon:     React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <h2 className="flex items-center gap-2 font-display font-bold text-base text-ink">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: {
  label:       string;
  description: string;
  value:       boolean;
  onChange:    (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-[11px] text-ink-faint">{description}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={cn(
          'w-11 h-6 rounded-full transition-colors relative shrink-0',
          value ? 'bg-accent' : 'bg-[#EDEAE5]'
        )}>
        <span className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
          value ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  );
}

function MenuRow({ icon, label, value }: {
  icon:   React.ReactNode;
  label:  string;
  value?: string;
}) {
  return (
    <button className="flex items-center gap-3 w-full py-2 hover:text-accent transition-colors group">
      <span className="text-ink-faint group-hover:text-accent transition-colors">{icon}</span>
      <span className="flex-1 text-sm text-ink text-left">{label}</span>
      {value && <span className="text-[11px] text-ink-faint">{value}</span>}
      <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-accent transition-colors" />
    </button>
  );
}

function NotConnected() {
  const router = useRouter();
  return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#EDEAE5] flex items-center justify-center">
        <User className="w-8 h-8 text-ink-muted" />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-ink mb-2">Non connecté</p>
        <p className="text-sm text-ink-muted">Connectez-vous pour accéder à votre profil.</p>
      </div>
      <button onClick={() => router.push('/login')}
        className="btn-accent w-auto px-8">
        Se connecter
      </button>
    </div>
  );
}