'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
          'text-muted hover:text-ink hover:bg-linen',
          'transition-all duration-200'
        )}
        title="About B2I"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M15 8A7 7 0 111 8a7 7 0 0114 0zM9 5a1 1 0 11-2 0 1 1 0 012 0zM6.75 8a.75.75 0 000 1.5h.75v1.75a.75.75 0 001.5 0v-2.5A.75.75 0 008.25 8h-1.5z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-mono text-2xs uppercase tracking-wider hidden sm:inline">About</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-elevated animate-fade-in-up">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-sand/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-ink">About B2I</h2>
                <p className="font-mono text-xs text-muted uppercase tracking-wider mt-1">
                  Busy to Intentional Framework
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  'p-2 rounded-lg',
                  'text-muted hover:text-ink hover:bg-linen',
                  'transition-all duration-200'
                )}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <section>
                <p className="text-sm text-charcoal leading-relaxed">
                  B2I (Busy to Intentional) is a productivity framework designed to help you move from reactive busyness to purposeful action. It combines annual goal-setting, visual task management, and weekly review rituals to keep you focused on what matters most.
                </p>
              </section>

              {/* Annual Goals */}
              <section>
                <h3 className="font-display text-lg text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-amber flex items-center justify-center font-mono text-xs">1</span>
                  Annual Goals
                </h3>
                <p className="text-sm text-charcoal leading-relaxed ml-8">
                  Set 3-5 meaningful goals for the year. These are your north stars—the outcomes that will make this year successful. Keep them visible at the top of your workspace as a constant reminder of what you&apos;re working toward. Check them off as you achieve them throughout the year.
                </p>
              </section>

              {/* Kanban Board */}
              <section>
                <h3 className="font-display text-lg text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-amber flex items-center justify-center font-mono text-xs">2</span>
                  Task Board
                </h3>
                <p className="text-sm text-charcoal leading-relaxed ml-8 mb-3">
                  Organize your work across three columns:
                </p>
                <ul className="text-sm text-charcoal leading-relaxed ml-8 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-stone mt-1.5 flex-shrink-0" />
                    <span><strong>To Do</strong> — Tasks waiting to be started. Your backlog of committed work.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-azure mt-1.5 flex-shrink-0" />
                    <span><strong>In Progress</strong> — What you&apos;re actively working on. Limit this to 3-5 items to maintain focus.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-sage mt-1.5 flex-shrink-0" />
                    <span><strong>Complete</strong> — Finished tasks. Celebrate your progress, then archive or clear periodically.</span>
                  </li>
                </ul>
                <p className="text-sm text-charcoal leading-relaxed ml-8 mt-3">
                  Use priorities (colored dots) and due dates to highlight urgent work. Drag cards between columns as work progresses.
                </p>
              </section>

              {/* Friday Shutdown */}
              <section>
                <h3 className="font-display text-lg text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-amber flex items-center justify-center font-mono text-xs">3</span>
                  Friday Shutdown
                </h3>
                <p className="text-sm text-charcoal leading-relaxed ml-8 mb-3">
                  The weekly review ritual is the engine of the B2I system. Every Friday, work through your personalized checklist to:
                </p>
                <ul className="text-sm text-charcoal leading-relaxed ml-8 space-y-1">
                  <li>• Clear your inboxes and capture loose ends</li>
                  <li>• Review what happened last week</li>
                  <li>• Move tasks appropriately between columns</li>
                  <li>• Plan your &quot;big rocks&quot; for next week</li>
                  <li>• Enter the weekend with a clear mind</li>
                </ul>
                <p className="text-sm text-charcoal leading-relaxed ml-8 mt-3">
                  Customize the checklist to match your workflow. Add items, remove ones that don&apos;t serve you, and reorder by dragging.
                </p>
              </section>

              {/* Personal Mantra */}
              <section>
                <h3 className="font-display text-lg text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-amber flex items-center justify-center font-mono text-xs">4</span>
                  Personal Mantra
                </h3>
                <p className="text-sm text-charcoal leading-relaxed ml-8">
                  The footer message is your personal intention—a reminder of who you want to be this year. Click it to customize with your own mantra, values statement, or guiding principle.
                </p>
              </section>

              {/* Tips */}
              <section className="bg-linen/50 rounded-lg p-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-stone mb-3">Tips for Success</h3>
                <ul className="text-sm text-charcoal leading-relaxed space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber">→</span>
                    <span>Review your annual goals weekly during Friday Shutdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber">→</span>
                    <span>Keep &quot;In Progress&quot; limited—too many active tasks kills focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber">→</span>
                    <span>Archive completed tasks regularly to keep your board clean</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber">→</span>
                    <span>Never skip Friday Shutdown—it&apos;s where intention happens</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-sand/50 p-6 text-center">
              <p className="font-mono text-2xs text-muted">
                B2I Framework • Built for intentional leaders
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
