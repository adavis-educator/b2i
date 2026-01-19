'use client';

import { useState, useRef, useEffect } from 'react';
import { useSettingsSupabase } from '@/hooks/useSettingsSupabase';
import { cn } from '@/lib/utils';

export function EditableFooter() {
  const { settings, isLoading, updateFooterMessage } = useSettingsSupabase();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(settings.footerMessage);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      updateFooterMessage(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  if (isLoading) {
    return (
      <footer className="mt-12 pt-6 border-t border-sand/50">
        <div className="h-4 w-3/4 mx-auto bg-linen rounded animate-pulse" />
      </footer>
    );
  }

  return (
    <footer className="mt-12 pt-6 border-t border-sand/50">
      {isEditing ? (
        <div className="max-w-2xl mx-auto space-y-3">
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className={cn(
              'w-full px-4 py-3 text-sm text-ink bg-white font-mono',
              'border border-sand rounded-lg',
              'focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/30',
              'placeholder:text-muted resize-none',
              'transition-all duration-200'
            )}
            placeholder="Enter your personal mantra or intention..."
          />
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleSave}
              className={cn(
                'px-4 py-2 font-mono text-xs uppercase tracking-wider',
                'bg-amber text-white rounded-lg hover:bg-gold',
                'transition-all duration-200'
              )}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className={cn(
                'px-4 py-2 font-mono text-xs uppercase tracking-wider',
                'text-stone hover:text-ink hover:bg-linen',
                'border border-sand rounded-lg',
                'transition-all duration-200'
              )}
            >
              Cancel
            </button>
            <span className="font-mono text-2xs text-muted ml-2">
              Cmd+Enter to save
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartEdit}
          className={cn(
            'block w-full group cursor-pointer',
            'transition-all duration-200'
          )}
          title="Click to edit your personal mantra"
        >
          <p className={cn(
            'font-mono text-2xs tracking-wide text-muted text-center max-w-2xl mx-auto leading-relaxed',
            'group-hover:text-stone transition-colors duration-200'
          )}>
            {settings.footerMessage}
          </p>
          <div className={cn(
            'flex items-center justify-center gap-1.5 mt-2',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 text-muted"
            >
              <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.848 2.047a.75.75 0 00.98.98l2.047-.848a2.75 2.75 0 00.892-.596l4.261-4.262a1.75 1.75 0 000-2.474z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0114 9v2.25A2.75 2.75 0 0111.25 14h-6.5A2.75 2.75 0 012 11.25v-6.5A2.75 2.75 0 014.75 2H7a.75.75 0 010 1.5H4.75z" />
            </svg>
            <span className="font-mono text-2xs text-muted">Click to edit</span>
          </div>
        </button>
      )}
    </footer>
  );
}
