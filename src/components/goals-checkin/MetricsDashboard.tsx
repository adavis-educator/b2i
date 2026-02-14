'use client';

import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useWeeklyMetrics } from '@/hooks/useWeeklyMetrics';
import { cn } from '@/lib/utils';

const SCORE_LABELS = ['Body', 'Mind', 'Work', 'Energy'] as const;
const SCORE_KEYS = ['scoreBody', 'scoreMind', 'scoreWork', 'scoreEnergy'] as const;
const AVG_KEYS = ['body', 'mind', 'work', 'energy'] as const;

function ScoreDot({ value }: { value: number | null }) {
  if (value === null) return <div className="w-4 h-4 rounded-full bg-sand/40" title="No data" />;
  return (
    <div
      className={cn(
        'w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono text-white',
        value >= 4 ? 'bg-sage' : value >= 3 ? 'bg-amber' : 'bg-rose'
      )}
      title={`${value}/5`}
    >
      {value}
    </div>
  );
}

function AvgBadge({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="text-center">
      <div
        className={cn(
          'text-2xl font-display',
          value === null
            ? 'text-muted'
            : value >= 4
            ? 'text-sage'
            : value >= 3
            ? 'text-amber'
            : 'text-rose'
        )}
      >
        {value !== null ? value.toFixed(1) : '—'}
      </div>
      <div className="font-mono text-2xs uppercase tracking-wider text-stone">{label}</div>
    </div>
  );
}

export function MetricsDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { checkins, streak, averages, isLoading } = useWeeklyMetrics(12);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl text-ink mb-2">B2I</h1>
          <p className="font-mono text-xs text-muted uppercase tracking-wider">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (user.email !== 'adavis@mttam.org') {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-ink mb-2">Not Available</h1>
          <p className="text-sm text-muted">This page is not available for your account.</p>
          <a href="/" className="inline-block mt-4 font-mono text-xs text-amber hover:text-gold uppercase tracking-wider">
            Back to B2I
          </a>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-6 py-8 animate-pulse">
          <div className="h-8 w-48 bg-linen rounded mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-linen/50 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Reverse to show oldest → newest (left to right)
  const timeline = [...checkins].reverse();

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-6 lg:px-10 lg:py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink tracking-tight">Goals Dashboard</h1>
            <p className="font-mono text-2xs uppercase tracking-[0.15em] text-muted mt-1">
              Week-over-week tracking
            </p>
          </div>
          <a
            href="/"
            className="font-mono text-xs text-amber hover:text-gold uppercase tracking-wider transition-colors"
          >
            Back to B2I
          </a>
        </header>

        <div className="space-y-6">
          {/* Streak + Averages */}
          <div className="bg-white rounded-lg shadow-column p-5 animate-fade-in-up">
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-display text-amber">{streak}</div>
                <div className="font-mono text-2xs uppercase tracking-wider text-stone">
                  Week Streak
                </div>
              </div>
              {SCORE_LABELS.map((label, i) => (
                <AvgBadge key={label} label={label} value={averages[AVG_KEYS[i]]} />
              ))}
            </div>
          </div>

          {/* Score Trends */}
          <div className="bg-white rounded-lg shadow-column p-5 animate-fade-in-up opacity-0 stagger-1">
            <h2 className="font-mono text-2xs uppercase tracking-wider text-stone mb-4">
              Score Trends ({timeline.length} weeks)
            </h2>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">
                No check-ins yet. Complete your first weekly check-in to see trends.
              </p>
            ) : (
              <div className="space-y-3">
                {SCORE_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="font-mono text-2xs text-muted w-14 shrink-0">{label}</span>
                    <div className="flex gap-2 flex-1">
                      {timeline.map((week, j) => (
                        <div key={j} className="flex flex-col items-center gap-1">
                          <ScoreDot value={week[SCORE_KEYS[i]] as number | null} />
                          {i === 0 && (
                            <span className="font-mono text-[7px] text-muted">
                              {new Date(week.weekOf).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equanimity Notes */}
          {timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow-column p-5 animate-fade-in-up opacity-0 stagger-2">
              <h2 className="font-mono text-2xs uppercase tracking-wider text-stone mb-4">
                Equanimity Notes
              </h2>
              <div className="space-y-3">
                {timeline
                  .filter((w) => w.equanimityNote)
                  .map((week) => (
                    <div key={week.id} className="flex gap-3 text-sm">
                      <span className="font-mono text-2xs text-muted shrink-0 pt-0.5">
                        {new Date(week.weekOf).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <p className="text-charcoal">{week.equanimityNote}</p>
                    </div>
                  ))}
                {timeline.filter((w) => w.equanimityNote).length === 0 && (
                  <p className="text-sm text-muted text-center py-2">No equanimity notes yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Flags */}
          {timeline.length > 0 && timeline.some((w) => w.flagNote) && (
            <div className="bg-white rounded-lg shadow-column p-5 animate-fade-in-up opacity-0 stagger-3">
              <h2 className="font-mono text-2xs uppercase tracking-wider text-stone mb-4">
                Flags
              </h2>
              <div className="space-y-3">
                {timeline
                  .filter((w) => w.flagNote)
                  .map((week) => (
                    <div key={week.id} className="flex gap-3 text-sm">
                      <span className="font-mono text-2xs text-muted shrink-0 pt-0.5">
                        {new Date(week.weekOf).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <p className="text-charcoal">{week.flagNote}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
