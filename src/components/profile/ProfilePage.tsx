'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  User, Mail, Bell, Palette, LayoutList,
  LogOut, ChevronRight, Check, Moon, Sun,
  Globe, Bookmark, Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useFeedStore } from '@/store/feed.store';
import { useLogout } from '@/lib/hooks/useAuth';
import { usePushNotifications } from '@/lib/hooks/usePushNotifications';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const t      = useTranslations('profile');
  const locale = useLocale();
  const { user, isAuthenticated } = useAuthStore();
  const { savedArticles, layout, setLayout } = useFeedStore();
  const logout = useLogout();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    sendTestNotification,
  } = usePushNotifications();

  const THEMES = [
    { value: 'light',  label: t('light'),  icon: Sun   },
    { value: 'dark',   label: t('dark'),   icon: Moon  },
    { value: 'system', label: t('system'), icon: Globe },
  ];

  const LAYOUTS = [
    { value: 'list',     label: t('list')     },
    { value: 'grid',     label: t('grid')     },
    { value: 'magazine', label: t('magazine') },
  ];

  if (!isAuthenticated || !user) {
    return <NotConnected />;
  }

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  const pushActive = isSubscribed || permission === 'granted';

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto">

      {/* Avatar + infos */}
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
            {user.plan === 'premium' ? `⭐ ${t('premium')}` : `🆓 ${t('free')}`}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-[#FBF0EB] flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-accent" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">{savedArticles.length}</p>
          <p className="text-[11px] text-ink-muted text-center">{t('savedCount')}</p>
        </div>
        <div className="card p-4 flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="font-display font-bold text-2xl text-ink">{locale.toUpperCase()}</p>
          <p className="text-[11px] text-ink-muted text-center">{t('preferredLanguage')}</p>
        </div>
      </div>

      {/* Apparence */}
      <Section title={t('appearance')} icon={<Palette className="w-4 h-4" />}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-2">
            {t('theme')}
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
            {t('layout')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LAYOUTS.map(({ value, label }) => (
              <button key={value}
                onClick={() => setLayout(value as 'list' | 'grid' | 'magazine')}
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

      {/* Notifications */}
      <Section title={t('notifications')} icon={<Bell className="w-4 h-4" />}>
        {!isSupported ? (
          <p className="text-sm text-ink-muted">{t('notSupported')}</p>
        ) : permission === 'denied' ? (
          <p className="text-sm text-[#EF4444]">{t('blocked')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{t('pushNotif')}</p>
                <p className="text-[11px] text-ink-faint">{t('pushDesc')}</p>
              </div>
              <button
                onClick={subscribe}
                disabled={isLoading}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative shrink-0 disabled:opacity-50',
                  pushActive ? 'bg-accent' : 'bg-[#EDEAE5]'
                )}>
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all',
                  pushActive ? 'end-0.5' : 'start-0.5'
                )} />
              </button>
            </div>

            {pushActive && (
              <button onClick={sendTestNotification}
                className="flex items-center justify-center gap-2 py-2 rounded-xl
                  border border-[#E8E5E0] text-sm text-ink-muted
                  hover:border-accent hover:text-accent transition-colors">
                🔔 {t('testNotif')}
              </button>
            )}
          </div>
        )}
      </Section>

      {/* Compte */}
      <Section title={t('account')} icon={<User className="w-4 h-4" />}>
        <MenuRow icon={<Mail className="w-4 h-4" />}   label={t('editEmail')} />
        <MenuRow icon={<Shield className="w-4 h-4" />} label={t('changePassword')} />
        <MenuRow icon={<Globe className="w-4 h-4" />}  label={t('interfaceLanguage')} value={locale.toUpperCase()} />
      </Section>

      {/* Déconnexion */}
      {!showLogoutConfirm ? (
        <button onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
            border-2 border-[#FECACA] text-[#EF4444] text-sm font-medium
            hover:bg-[#FEF2F2] transition-colors">
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      ) : (
        <div className="card p-4 flex flex-col gap-3">
          <p className="text-sm text-ink text-center font-medium">{t('confirm')}</p>
          <div className="flex gap-2">
            <button onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E5E0] text-sm
                text-ink-muted hover:bg-[#EDEAE5] transition-colors">
              {t('cancel')}
            </button>
            <button onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-white text-sm
                font-medium hover:opacity-90 transition-opacity">
              {t('confirmBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

function MenuRow({ icon, label, value }: {
  icon:   React.ReactNode;
  label:  string;
  value?: string;
}) {
  return (
    <button className="flex items-center gap-3 w-full py-2
      hover:text-accent transition-colors group">
      <span className="text-ink-faint group-hover:text-accent transition-colors">{icon}</span>
      <span className="flex-1 text-sm text-ink text-start">{label}</span>
      {value && <span className="text-[11px] text-ink-faint">{value}</span>}
      <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-accent transition-colors rtl:rotate-180" />
    </button>
  );
}

function NotConnected() {
  const t      = useTranslations('profile');
  const router = useRouter();
  return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-[#EDEAE5] flex items-center justify-center">
        <User className="w-8 h-8 text-ink-muted" />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-ink mb-2">{t('notConnected')}</p>
        <p className="text-sm text-ink-muted">{t('notConnectedHint')}</p>
      </div>
      <button onClick={() => router.push('/login')}
        className="btn-accent w-auto px-8">
        {t('loginBtn')}
      </button>
    </div>
  );
}