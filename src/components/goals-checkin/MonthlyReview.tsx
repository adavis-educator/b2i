'use client';

import { useState, useEffect } from 'react';
import { useMonthlyReviewSupabase } from '@/hooks/useMonthlyReviewSupabase';
import { useWeeklyCheckinSupabase } from '@/hooks/useWeeklyCheckinSupabase';
import { cn } from '@/lib/utils';

const SCORE_LABELS = ['Body', 'Mind', 'Work', 'Energy'] as const;
const SCORE_KEYS = ['scoreBody', 'scoreMind', 'scoreWork', 'scoreEnergy'] as const;

function ScoreDot({ value }: { value: number | null }) {
  if (value === null) return <div className="w-3 h-3 rounded-full bg-sand/50" />;
  return (
    <div
      className={cn(
        'w-3 h-3 rounded-full',
        value >= 4 ? 'bg-sage' : value >= 3 ? 'bg-amber' : 'bg-rose'
      )}
      title={`${value}/5`}
    />
  );
}

export function MonthlyReview() {
  const { review, isLoading: reviewLoading, isSaving, saveReview } = useMonthlyReviewSupabase();
  const { recentCheckins, isLoading: checkinsLoading } = useWeeklyCheckinSupabase();

  const [trendsNote, setTrendsNote] = useState('');
  const [keystoneNote, setKeystoneNote] = useState('');
  const [nextWhyNote, setNextWhyNote] = useState('');
  const [adjustNote, setAdjustNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (review) {
      setTrendsNote(review.trendsNote);
      setKeystoneNote(review.keystoneNote);
      setNextWhyNote(review.nextWhyNote);
      setAdjustNote(review.adjustNote);
    }
  }, [review]);

  const handleSave = async () => {
    await saveReview({ trendsNote, keystoneNote, nextWhyNote, adjustNote });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isLoading = reviewLoading || checkinsLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-column p-5 animate-pulse">
        <div className="h-6 w-40 bg-linen rounded mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-linen/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Show last 4 weekly scores as trend dots
  const weeklyData = [...recentCheckins].reverse(); // oldest first

  return (
    <div className="bg-white rounded-lg shadow-column">
      {/* Header */}
      <div className="p-5 border-b border-sand/30">
        <h2 className="font-display text-xl text-ink">Monthly Review</h2>
        <p className="font-mono text-2xs text-muted uppercase tracking-wider mt-0.5">
          15 min — last Friday of the month
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Trends visualization */}
        {weeklyData.length > 0 && (
          <div className="bg-snow rounded-lg p-4 border border-sand/30">
            <h3 className="font-mono text-2xs uppercase tracking-wider text-stone mb-3">
              This Month&apos;s Scores
            </h3>
            <div className="space-y-2">
              {SCORE_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="font-mono text-2xs text-muted w-12">{label}</span>
                  <div className="flex gap-2">
                    {weeklyData.map((week, j) => (
                      <ScoreDot
                        key={j}
                        value={week[SCORE_KEYS[i]] as number | null}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-2xs text-muted mt-2">
              {weeklyData.length} week{weeklyData.length !== 1 ? 's' : ''} of data
            </p>
          </div>
        )}

        {/* Reflection prompts */}
        <div className="space-y-3">
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              Trends — what&apos;s the pattern?
            </label>
            <textarea
              value={trendsNote}
              onChange={(e) => setTrendsNote(e.target.value)}
              placeholder="Review your 4 weekly scores..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-ink bg-snow border border-sand rounded-lg focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30 placeholder:text-muted resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              Keystone — when did I feel physically strong + emotionally measured? When didn&apos;t I?
            </label>
            <textarea
              value={keystoneNote}
              onChange={(e) => setKeystoneNote(e.target.value)}
              placeholder="Reflect on your keystone goal..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-ink bg-snow border border-sand rounded-lg focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30 placeholder:text-muted resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              Next Why — any emerging clarity on what fires me up?
            </label>
            <textarea
              value={nextWhyNote}
              onChange={(e) => setNextWhyNote(e.target.value)}
              placeholder="Post-expansion, what's next..."
              rows={2}
              className="w-full px-3 py-2 text-sm text-ink bg-snow border border-sand rounded-lg focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30 placeholder:text-muted resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              One small tweak for next month
            </label>
            <input
              type="text"
              value={adjustNote}
              onChange={(e) => setAdjustNote(e.target.value)}
              placeholder="One adjustment..."
              className="w-full px-3 py-2 text-sm text-ink bg-snow border border-sand rounded-lg focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30 placeholder:text-muted"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all',
              isSaving
                ? 'bg-sand text-muted cursor-not-allowed'
                : 'bg-amber text-white hover:bg-gold'
            )}
          >
            {isSaving ? 'Saving...' : 'Save Review'}
          </button>
          {saved && (
            <span className="font-mono text-2xs text-sage animate-fade-in">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
