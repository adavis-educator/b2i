'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await signInWithEmail(email.trim());

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for a magic link to sign in!',
      });
      setEmail('');
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-column p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-ink mb-2">B2I</h1>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
              Busy to Intentional
            </p>
            <div className="h-0.5 w-12 bg-amber mx-auto mt-4" />
          </div>

          {/* Description */}
          <p className="text-sm text-stone text-center mb-8 leading-relaxed">
            Your personal productivity workspace for setting goals, managing tasks, and maintaining weekly rituals.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-2xs uppercase tracking-wider text-muted mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={cn(
                  'w-full px-4 py-3 text-sm text-ink bg-snow font-mono',
                  'border border-sand rounded-lg',
                  'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
                  'placeholder:text-muted',
                  'transition-all duration-200'
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className={cn(
                'w-full px-4 py-3 font-mono text-sm uppercase tracking-wider',
                'bg-amber text-white rounded-lg hover:bg-gold',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            >
              {isSubmitting ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={cn(
                'mt-4 p-4 rounded-lg font-mono text-xs',
                message.type === 'success' && 'bg-sage/10 text-sage',
                message.type === 'error' && 'bg-rose/10 text-rose'
              )}
            >
              {message.text}
            </div>
          )}

          {/* Footer */}
          <p className="mt-8 text-center font-mono text-2xs text-muted">
            We&apos;ll send you a secure link to sign in.
            <br />
            No password needed.
          </p>
        </div>
      </div>
    </main>
  );
}
