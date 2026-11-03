'use client';

import { useState } from 'react';
import { X, Flag, AlertCircle, Check } from 'lucide-react';
import { Article } from '@/types';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';

interface ReportModalProps {
  article: Article;
  onClose: () => void;
}

const REASONS = [
  { value: 'inexact',        label: '❌ Information inexacte ou trompeuse'    },
  { value: 'inapproprie',    label: '⚠️ Contenu inapproprié ou offensant'      },
  { value: 'droits_auteur',  label: '©️ Violation des droits d\'auteur'        },
  { value: 'spam',           label: '🚫 Spam ou contenu publicitaire'          },
  { value: 'autre',          label: '📝 Autre raison'                          },
];

export function ReportModal({ article, onClose }: ReportModalProps) {
  const [reason,    setReason]    = useState('');
  const [details,   setDetails]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit() {
    if (!reason) {
      setError('Veuillez sélectionner une raison.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await apiClient.post('/reports', {
        articleId:    article.id,
        articleUrl:   article.url,
        articleTitle: article.title,
        reason,
        details:      details.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose} />

      {/* Modal */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:inset-auto sm:top-1/2 sm:left-1/2
        sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md
        bg-surface rounded-t-2xl sm:rounded-2xl shadow-card-lg p-5 animate-fade-up">

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] flex items-center justify-center">
              <Check className="w-7 h-7 text-[#16A34A]" />
            </div>
            <p className="font-display font-bold text-ink">Signalement envoyé</p>
            <p className="text-sm text-ink-muted">
              Merci pour votre contribution. Nous examinerons ce contenu dans les 72 heures.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-[#EF4444]" />
                <h2 className="font-display font-bold text-base text-ink">
                  Signaler un contenu
                </h2>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full
                  text-ink-faint hover:bg-[#EDEAE5] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article concerné */}
            <div className="px-3 py-2.5 rounded-xl bg-[#F5F3EF] mb-4">
              <p className="text-[11px] text-ink-faint mb-0.5">Article signalé</p>
              <p className="text-xs text-ink font-medium line-clamp-2">{article.title}</p>
            </div>

            {/* Raisons */}
            <div className="flex flex-col gap-1.5 mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint mb-1">
                Raison du signalement
              </p>
              {REASONS.map(({ value, label }) => (
                <button key={value} onClick={() => setReason(value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all border',
                    reason === value
                      ? 'border-[#EF4444] bg-[#FEF2F2] text-[#EF4444]'
                      : 'border-[#E8E5E0] text-ink-muted hover:border-[#EF4444]/50 hover:text-ink'
                  )}>
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                    reason === value ? 'border-[#EF4444]' : 'border-[#E8E5E0]'
                  )}>
                    {reason === value && (
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    )}
                  </div>
                  {label}
                </button>
              ))}
            </div>

            {/* Détails optionnels */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest
                text-ink-faint mb-1.5">
                Détails (optionnel)
              </p>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Décrivez le problème en quelques mots..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5E0] bg-surface
                  text-ink text-sm placeholder:text-ink-faint outline-none resize-none
                  focus:border-[#EF4444]/50 focus:ring-2 focus:ring-[#EF4444]/10 transition-all"
              />
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#E8E5E0] text-sm
                  text-ink-muted hover:bg-[#EDEAE5] transition-colors">
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={isLoading || !reason}
                className="flex-1 py-2.5 rounded-xl bg-[#EF4444] text-white text-sm
                  font-medium hover:opacity-90 transition-opacity
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                {isLoading ? 'Envoi...' : 'Signaler'}
              </button>
            </div>

            <p className="text-[10px] text-ink-faint text-center mt-3">
              Les signalements abusifs peuvent entraîner la suspension du compte.
            </p>
          </>
        )}
      </div>
    </>
  );
}