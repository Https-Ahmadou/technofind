'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
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

type Frequency = 'immediate' | 'daily' | 'weekly';

const FREQUENCY_ICONS: Record<Frequency, React.ElementType> = {
  immediate: Zap,
  daily:     Clock,
  weekly:    Bell,
};

const CATEGORY_VALUES = [
  '', 'monde', 'technologie', 'economie', 'sport', 'science', 'sante', 'politique',
];

export function AlertsPage() {
  const t  = useTranslations('alerts');
  const tc = useTranslations('categories');
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [keyword,   setKeyword]   = useState('');
  const [category,  setCategory]  = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [showForm,  setShowForm]  = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn:  () => apiClient.get<{ data: Alert[] }>('/alerts'),
    enabled:  isAuthenticated,
  });

  const alerts = data?.data ?? [];

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/alerts/${id}`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      apiClient.put(`/alerts/${id}`, { active }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  function handleCreate() {
    if (!keyword.trim()) return;
    createMutation.mutate({ keyword, category, frequency });
  }

  const FREQUENCIES: { value: Frequency; label: string }[] = [
    { value: 'immediate', label: t('immediate') },
    { value: 'daily',     label: t('daily')     },
    { value: 'weekly',    label: t('weekly')    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="card flex flex-col items-center gap-4 py-16 text-center max-w-sm mx-auto">
        <Bell className="w-10 h-10 text-ink-faint" />
        <div>
          <p className="font-display font-bold text-xl text-ink mb-2">{t('mustLogin')}</p>
          <p className="text-sm text-ink-muted">{t('mustLoginHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-ink flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent" /> {t('title')}
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {t('count', { count: alerts.length })}
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white
            text-sm font-medium hover:opacity-90 transition-opacity shadow-accent">
          <Plus className="w-4 h-4" />
          {t('new')}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card p-5 flex flex-col gap-4 animate-fade-up">
          <h2 className="font-display font-bold text-base text-ink">{t('createTitle')}</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              {t('keyword')}
            </label>
            <div className="relative">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4
                text-ink-faint pointer-events-none" />
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder={t('keywordPlaceholder')}
                className="w-full h-11 ps-10 pe-4 rounded-xl border border-[#E8E5E0] bg-surface
                  text-ink text-sm placeholder:text-ink-faint outline-none
                  focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              {t('categoryOptional')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_VALUES.map((value) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    category === value
                      ? 'bg-ink text-white'
                      : 'bg-[#EDEAE5] text-ink-muted hover:bg-[#E8E5E0] hover:text-ink'
                  )}>
                  {tc(value === '' ? 'all' : value)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              {t('frequency')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map(({ value, label }) => {
                const Icon = FREQUENCY_ICONS[value];
                return (
                  <button key={value} onClick={() => setFrequency(value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium',
                      frequency === value
                        ? 'border-accent bg-[#FBF0EB] text-accent'
                        : 'border-[#E8E5E0] text-ink-muted hover:border-ink-muted'
                    )}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {createMutation.isError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t('createError')}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E8E5E0] text-sm
                text-ink-muted hover:bg-[#EDEAE5] transition-colors">
              {t('cancel')}
            </button>
            <button onClick={handleCreate}
              disabled={!keyword.trim() || createMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium
                hover:opacity-90 transition-opacity shadow-accent
                disabled:opacity-50 disabled:cursor-not-allowed">
              {createMutation.isPending ? t('creating') : t('create')}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
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
              frequencyLabel={FREQUENCIES.find(f => f.value === alert.frequency)?.label}
              onDelete={() => deleteMutation.mutate(alert.id)}
              onToggle={() => toggleMutation.mutate({ id: alert.id, active: !alert.active })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, frequencyLabel, onDelete, onToggle }: {
  alert:           Alert;
  frequencyLabel?: string;
  onDelete:        () => void;
  onToggle:        () => void;
}) {
  const t  = useTranslations('alerts');
  const tc = useTranslations('categories');
  const FreqIcon = FREQUENCY_ICONS[alert.frequency];
  const catLabel = alert.category
    ? (CATEGORY_VALUES.includes(alert.category) ? tc(alert.category) : alert.category)
    : null;

  return (
    <div className={cn(
      'card p-4 flex items-center gap-3 transition-opacity',
      !alert.active && 'opacity-60'
    )}>
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        alert.active ? 'bg-[#FBF0EB]' : 'bg-[#EDEAE5]'
      )}>
        <Bell className={cn('w-5 h-5', alert.active ? 'text-accent' : 'text-ink-faint')} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink truncate">{alert.keyword}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {catLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDEAE5] text-ink-muted">
              {catLabel}
            </span>
          )}
          {frequencyLabel && (
            <span className="flex items-center gap-1 text-[10px] text-ink-faint">
              <FreqIcon className="w-3 h-3" />
              {frequencyLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onToggle} aria-label={t('toggle')}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-ink-faint hover:text-ink transition-colors">
          {alert.active
            ? <ToggleRight className="w-5 h-5 text-accent" />
            : <ToggleLeft className="w-5 h-5" />}
        </button>
        <button onClick={onDelete} aria-label={t('delete')}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-ink-faint hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations('alerts');
  return (
    <div className="card flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF0EB] flex items-center justify-center">
        <Bell className="w-8 h-8 text-accent" />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-ink mb-2">{t('empty')}</p>
        <p className="text-sm text-ink-muted max-w-xs">{t('emptyHint')}</p>
      </div>
      <button onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white
          text-sm font-medium hover:opacity-90 shadow-accent">
        <Plus className="w-4 h-4" />
        {t('firstAlert')}
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