'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validators/auth';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api/client';
import { User as UserType, AuthTokens } from '@/types';
import { cn } from '@/lib/utils';

// Critères de validation du mot de passe
const PASSWORD_RULES = [
  { label: '8 caractères minimum',  test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule',          test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre',             test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [serverError,   setServerError]   = useState('');
  const { setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch('password', '');

  async function onSubmit(data: RegisterInput) {
  setServerError('');
  try {
    const res = await apiClient.post<{ user: UserType; tokens: AuthTokens }>(
      '/auth/register',
      { 
        name: data.name, 
        email: data.email, 
        password: data.password,
        confirmPassword: data.confirmPassword  // ← ajoute cette ligne
      }
    );
   try { localStorage.setItem('access_token', res.tokens.accessToken); } catch {}
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
      <div className="dark-hero flex-shrink-0 h-52 flex flex-col items-center justify-center px-8">
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-grid" />
        <div className="hero-overlay" />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-[#f08040]
            flex items-center justify-center shadow-accent animate-pop">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            Techno<span className="text-accent">Find</span>
          </h1>
        </div>
      </div>

      {/* ── Formulaire ────────────────────────────────────── */}
      <div className="flex-1 bg-bg px-6 py-6 flex flex-col gap-5">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink">Créer un compte ✨</h2>
          <p className="text-sm text-ink-muted mt-1">Rejoignez TechnoFind gratuitement</p>
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

          {/* Nom */}
          <Field label="Nom complet" error={errors.name?.message}>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('name')}
                type="text"
                placeholder="Jean Dupont"
                autoComplete="name"
                className={inputClass(!!errors.name)}
              />
            </div>
          </Field>

          {/* Email */}
          <Field label="Adresse email" error={errors.email?.message}>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('email')}
                type="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                className={inputClass(!!errors.email)}
              />
            </div>
          </Field>

          {/* Mot de passe */}
          <Field label="Mot de passe" error={errors.password?.message}>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className={cn(inputClass(!!errors.password), 'pr-10')}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute right-3.5 text-ink-faint hover:text-ink-muted transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Critères du mot de passe */}
            {passwordValue && (
              <div className="flex flex-col gap-1 mt-2">
                {PASSWORD_RULES.map(rule => {
                  const ok = rule.test(passwordValue);
                  return (
                    <div key={rule.label}
                      className={cn(
                        'flex items-center gap-2 text-[11px] transition-colors',
                        ok ? 'text-[#16A34A]' : 'text-ink-faint'
                      )}>
                      <div className={cn(
                        'w-3.5 h-3.5 rounded-full flex items-center justify-center',
                        ok ? 'bg-[#16A34A]' : 'bg-[#E8E5E0]'
                      )}>
                        {ok && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                      </div>
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            )}
          </Field>

          {/* Confirmation */}
          <Field label="Confirmer le mot de passe" error={errors.confirmPassword?.message}>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-ink-faint pointer-events-none" />
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className={cn(inputClass(!!errors.confirmPassword), 'pr-10')}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3.5 text-ink-faint hover:text-ink-muted transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="btn-accent mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner /> Création du compte…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Lien login */}
        <p className="text-center text-sm text-ink-muted">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function Field({ label, error, children }: {
  label:    string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full h-12 pl-10 pr-4 rounded-xl border bg-surface text-ink text-sm',
    'placeholder:text-ink-faint outline-none transition-colors',
    'focus:border-accent focus:bg-white',
    hasError ? 'border-[#EF4444]' : 'border-[#E8E5E0]'
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}
