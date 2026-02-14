'use client';

import { useState, useEffect } from 'react';
import { useWeeklyCheckinSupabase } from '@/hooks/useWeeklyCheckinSupabase';
import { ScoreInput } from './ScoreInput';
import { cn } from '@/lib/utils';

export function WeeklyCheckin() {
  const { checkin, isLoading, isSaving, saveCheckin } = useWeeklyCheckinSupabase();

  const [scoreBody, setScoreBody] = useState<number | null>(null);
  const [scoreMind, setScoreMind] = useState<number | null>(null);
  const [scoreWork, setScoreWork] = useState<number | null>(null);
  const [scoreEnergy, setScoreEnergy] = useState<number | null>(null);
  const [equanimityNote, setEquanimityNote] = useState('');
  const [flagNote, setFlagNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (checkin) {
      setScoreBody(checkin.scoreBody);
      setScoreMind(checkin.scoreMind);
      setScoreWork(checkin.scoreWork);
      setScoreEnergy(checkin.scoreEnergy);
      setEquanimityNote(checkin.equanimityNote);
      setFlagNote(checkin.flagNote);
    }
  }, [checkin]);

  const handleSave = async () => {
    await saveCheckin({
      scoreBody,
      scoreMind,
      scoreWork,
      scoreEnergy,
      equanimityNote,
      flagNote,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-column p-5 animate-pulse">
        <div className="h-6 w-40 bg-linen rounded mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-linen/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-column">
      {/* Header */}
      <div className="p-5 border-b border-sand/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-ink">Weekly Check-In</h2>
            <p className="font-mono text-2xs text-muted uppercase tracking-wider mt-0.5">
              5 min gut check — no overthinking
            </p>
          </div>
          {checkin && (
            <span className="font-mono text-2xs text-sage uppercase tracking-wider">
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <ScoreInput
            label="Body"
            question="Did I train consistently without injury?"
            value={scoreBody}
            onChange={setScoreBody}
          />
          <ScoreInput
            label="Mind"
            question="Did I read morning/evening most days?"
            value={scoreMind}
            onChange={setScoreMind}
          />
          <ScoreInput
            label="Work"
            question="Did I coach/delegate vs. do?"
            value={scoreWork}
            onChange={setScoreWork}
          />
          <ScoreInput
            label="Energy"
            question="Did I feel strong and measured vs. rushed?"
            value={scoreEnergy}
            onChange={setScoreEnergy}
          />
        </div>

        {/* Text fields */}
        <div className="pt-3 border-t border-sand/20 space-y-3">
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              What felt equanimous this week?
            </label>
            <input
              type="text"
              value={equanimityNote}
              onChange={(e) => setEquanimityNote(e.target.value)}
              placeholder="One sentence..."
              className="w-full px-3 py-2 text-sm text-ink bg-snow border border-sand rounded-lg focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30 placeholder:text-muted"
            />
          </div>
          <div>
            <label className="block font-mono text-2xs uppercase tracking-wider text-stone mb-1.5">
              What am I doing that a more equanimous me wouldn&apos;t?
            </label>
            <input
              type="text"
              value={flagNote}
              onChange={(e) => setFlagNote(e.target.value)}
              placeholder="Flag it..."
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
            {isSaving ? 'Saving...' : 'Save Check-In'}
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
