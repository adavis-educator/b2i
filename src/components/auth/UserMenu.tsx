'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'text-muted hover:text-ink hover:bg-linen',
          'transition-all duration-200'
        )}
      >
        <div className="w-6 h-6 rounded-full bg-amber/20 flex items-center justify-center">
          <span className="font-mono text-xs text-amber uppercase">
            {user.email?.charAt(0) || '?'}
          </span>
        </div>
        <span className="font-mono text-2xs text-stone hidden sm:inline truncate max-w-[120px]">
          {user.email}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={cn(
            'w-3 h-3 text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[99]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-elevated border border-sand/50 z-[100] animate-fade-in">
            <div className="p-3 border-b border-sand/50">
              <p className="font-mono text-2xs text-muted truncate">{user.email}</p>
            </div>
            <div className="p-1">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left font-mono text-xs',
                  'text-stone hover:text-ink hover:bg-linen rounded',
                  'transition-all duration-200',
                  'flex items-center gap-2'
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A2.75 2.75 0 014.75 2h3a.75.75 0 010 1.5h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3a.75.75 0 010 1.5h-3A2.75 2.75 0 012 11.25v-6.5zm9.47.47a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l.97-.97H5.25a.75.75 0 010-1.5h7.19l-.97-.97a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
