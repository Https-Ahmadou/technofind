'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell, Plus, Trash2, ToggleLeft, ToggleRight,
  Search, Clock, Zap, AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

interface Alert {
  id:        string;
  keyword:   string;
  category?: string;
  frequency: 'immediate' | 'daily' | 'weekly';
  active:    boolean;
  createdAt: string;
}

const FREQUENCIES = [
  { value: 'immediate', label: 'Immédiate', icon: Zap   },
  { value: 'daily',     label: 'Quotidienne', icon: Clock },
  { value: 'weekly',    label: 'Hebdomadaire', icon: Bell },
];

const CATEGORIES = [
  { value: '',             label: 'Toutes'       },
  { value: 'monde',       label: 'Monde'         },
  { value: 'technologie', label: 'Technologie'   },
  { value: 'economie',    label: 'Économie'      },
  { value: 'sport',       label: 'Sport'         },
  { value: 'science',     label: 'Science'       },
  { value: 'sante',       label: 'Santé'         },
  { value: 'politique',   label: 'Politique'     },
];

export function AlertsPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [keyword,   setKeyword]   = useState('');
  const [category,  setCategory]  = useState('');
  const [frequency, setFrequency] = useState<'immediate' | 'daily' | 'weekly'>('daily');
  const [showForm,  setShowForm]  = useState(false);

  // Fetch alertes
  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn:  () => apiClient.get<{ data: Alert[] }>('/alerts'),
    enabled:  isAuthenticated,
  });

  const alerts = data?.data ?? [];

  // Créer une alerte
  const createMutation = useMutation({
    mutationFn: (body: object) => apiClient.post('/alerts', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setKeyword('');
      setCategory('');
      setFrequency('daily');
      setShowForm(false);
    },
  });

  // Supprimer une alerte
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/alerts/${id}`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  // Toggle actif/inactif
  const toggleMutation = useMutation({
  mutationFn: ({ id, active }: { id: string; active: boolean }) =>
    apiClient.put(`/alerts/${id}`, { active }),
  onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
});

  function handleCreate() {
    if (!keyword.trim()) return;
    createMutation.mutate({ keyword, category, frequency });
  }

  if (!isAuthenticated) {
    return (
      <div className="card flex flex-col items-center gap-4 py-16 text-center max-w-sm mx-auto">
        <Bell className="w-10 h-10 text-ink-faint" />
        <div>
          <p className="font-display font-bold text-xl text-ink mb-2">Connectez-vous</p>
          <p className="text-sm text-ink-muted">
            Les alertes nécessitent un compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent" /> Alertes
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {alerts.length === 0
              ? 'Aucune alerte configurée'
              : `${alerts.length} alerte${alerts.length > 1 ? 's' : ''} active${alerts.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white
            text-sm font-medium hover:opacity-90 transition-opacity shadow-accent">
          <Plus className="w-4 h-4" />
          Nouvelle alerte
        </button>
      </div>

      {/* ── Formulaire de création ───────────────────────── */}
      {showForm && (
        <div className="card p-5 flex flex-col gap-4 animate-fade-up">
          <h2 className="font-display font-bold text-base text-ink">
            Créer une alerte
          </h2>

          {/* Mot-clé */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              Mot-clé
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
                text-ink-faint pointer-events-none" />
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="Ex: Intelligence artificielle, Sénégal..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E5E0] bg-surface
                  text-ink text-sm placeholder:text-ink-faint outline-none
                  focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              Catégorie (optionnel)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(({ value, label }) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    category === value
                      ? 'bg-ink text-white'
                      : 'bg-[#EDEAE5] text-ink-muted hover:bg-[#E8E5E0] hover:text-ink'
                  )}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fréquence */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              Fréquence
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map(({ value, label, icon: Icon }) => (
                <button key={value}
                  onClick={() => setFrequency(value as 'immediate' | 'daily' | 'weekly')}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium',
                    frequency === value
                      ? 'border-accent bg-[#FBF0EB] text-accent'
                      : 'border-[#E8E5E0] text-ink-muted hover:border-ink-muted'
                  )}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {createMutation.isError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Erreur lors de la création</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E5E0] text-sm
                text-ink-muted hover:bg-[#EDEAE5] transition-colors">
              Annuler
            </button>
            <button onClick={handleCreate}
              disabled={!keyword.trim() || createMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                hover:opacity-90 transition-opacity shadow-accent
                disabled:opacity-50 disabled:cursor-not-allowed">
              {createMutation.isPending ? 'Création...' : 'Créer l\'alerte'}
            </button>
          </div>
        </div>
      )}

      {/* ── Liste des alertes ────────────────────────────── */}
      {isLoading ? (
        <AlertsSkeleton />
      ) : alerts.length === 0 ? (
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDelete={() => deleteMutation.mutate(alert.id)}
              onToggle={() => toggleMutation.mutate({ id: alert.id, active: !alert.active })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, onDelete, onToggle }: {
  alert:    Alert;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const freq = FREQUENCIES.find(f => f.value === alert.frequency);

  return (
    <div className={cn(
      'card p-4 flex items-center gap-3 transition-opacity',
      !alert.active && 'opacity-60'
    )}>
      {/* Icône */}
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        alert.active ? 'bg-[#FBF0EB]' : 'bg-[#EDEAE5]'
      )}>
        <Bell className={cn('w-5 h-5', alert.active ? 'text-accent' : 'text-ink-faint')} />
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink truncate">{alert.keyword}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {alert.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDEAE5] text-ink-muted">
              {alert.category}
            </span>
          )}
          {freq && (
            <span className="flex items-center gap-1 text-[10px] text-ink-faint">
              <freq.icon className="w-3 h-3" />
              {freq.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onToggle} aria-label="Activer/désactiver"
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-ink-faint hover:text-ink transition-colors">
          {alert.active
            ? <ToggleRight className="w-5 h-5 text-accent" />
            : <ToggleLeft className="w-5 h-5" />}
        </button>
        <button onClick={onDelete} aria-label="Supprimer"
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-ink-faint hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF0EB] flex items-center justify-center">
        <Bell className="w-8 h-8 text-accent" />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-ink mb-2">
          Aucune alerte
        </p>
        <p className="text-sm text-ink-muted max-w-xs">
          Créez des alertes pour être notifié dès qu'un article correspond à vos centres d'intérêt.
        </p>
      </div>
      <button onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white
          text-sm font-medium hover:opacity-90 shadow-accent">
        <Plus className="w-4 h-4" />
        Créer ma première alerte
      </button>
    </div>
  );
}

function AlertsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-4 flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}