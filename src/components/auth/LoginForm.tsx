'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validators/auth';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api/client';
import { User, AuthTokens } from '@/types';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState('');
  const { setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError('');
    try {
      const res = await apiClient.post<{ user: User; tokens: AuthTokens }>(
        '/auth/login', data
      );
      localStorage.setItem('access_token', res.tokens.accessToken);
      setUser(res.user, res.tokens.accessToken);
      router.push('/feed');
    } catch (err: unknown) {
      const e = err as { message?: string };
      setServerError(e?.message || 'Une erreur est survenue.');
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col min-h-screen">

      {/* ── Dark Hero ─────────────────────────────────────── */}
      <div className="dark-hero flex-shrink-0 h-64 flex flex-col items-center justify-center gap-4 px-8">
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-grid" />
        <div className="hero-overlay" />

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-[#f08040]
            flex items-center justify-center shadow-accent animate-pop">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div className="text-center">
            <h1 className="font-display font-black text-3xl text-white tracking-tight">
              Techno<span className="text-accent">Find</span>
            </h1>
            <p className="text-[13px] text-white/50 font-light mt-1">
              L'actualité, à votre rythme
            </p>
          </div>
        </div>
      </div>

      {/* ── Formulaire ────────────────────────────────────── */}
      <div className="flex-1 bg-bg px-6 py-8 flex flex-col gap-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink">Bon retour 👋</h2>
          <p className="text-sm text-ink-muted mt-1">Connectez-vous à votre compte</p>
        </div>

        {/* Erreur serveur */}
        {serverError && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl
            bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Adresse email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('email')}
                type="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                className={cn(
                  'w-full h-12 pl-10 pr-4 rounded-xl border bg-surface text-ink text-sm',
                  'placeholder:text-ink-faint outline-none transition-colors',
                  'focus:border-accent focus:bg-white',
                  errors.email ? 'border-[#EF4444]' : 'border-[#E8E5E0]'
                )}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-[#EF4444]">{errors.email.message}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
                Mot de passe
              </label>
              <Link href="/forgot-password"
                className="text-[11px] text-accent hover:underline">
                Oublié ?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn(
                  'w-full h-12 pl-10 pr-10 rounded-xl border bg-surface text-ink text-sm',
                  'placeholder:text-ink-faint outline-none transition-colors',
                  'focus:border-accent focus:bg-white',
                  errors.password ? 'border-[#EF4444]' : 'border-[#E8E5E0]'
                )}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute right-3.5 text-ink-faint hover:text-ink-muted transition-colors">
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-[#EF4444]">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="btn-accent mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner /> Connexion…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Se connecter <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E8E5E0]" />
          <span className="text-[11px] text-ink-faint uppercase tracking-wider">ou</span>
          <div className="flex-1 h-px bg-[#E8E5E0]" />
        </div>

        {/* Lien register */}
        <p className="text-center text-sm text-ink-muted">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-accent font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}
