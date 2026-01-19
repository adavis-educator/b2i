'use client';

import { Draggable } from '@hello-pangea/dnd';
import { ChecklistItem as ChecklistItemType } from '@/types';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  item: ChecklistItemType;
  index: number;
  onToggle: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function ChecklistItem({ item, index, onToggle, onRemove }: ChecklistItemProps) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'group flex items-start gap-2 py-2.5 px-3 -mx-3 rounded-lg',
            'hover:bg-linen/50 transition-all duration-200',
            snapshot.isDragging && 'bg-white shadow-elevated border border-sand/50'
          )}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className={cn(
              'mt-0.5 p-1 -ml-1 rounded cursor-grab',
              'text-sand hover:text-stone',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              snapshot.isDragging && 'opacity-100 cursor-grabbing'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path fillRule="evenodd" d="M5 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM11 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM11 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
            </svg>
          </div>

          <input
            type="checkbox"
            id={item.id}
            checked={item.isChecked}
            onChange={() => onToggle(item.id)}
            className={cn(
              'mt-0.5 h-4 w-4 rounded-sm',
              'cursor-pointer transition-all duration-200'
            )}
          />
          <label
            htmlFor={item.id}
            className={cn(
              'flex-1 text-sm cursor-pointer select-none transition-all duration-200 leading-relaxed',
              item.isChecked
                ? 'text-muted line-through'
                : 'text-charcoal'
            )}
          >
            {item.label}
          </label>
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className={cn(
                'opacity-0 group-hover:opacity-100 p-1.5 rounded',
                'text-muted hover:text-rose hover:bg-rose/10',
                'transition-all duration-200',
                snapshot.isDragging && 'opacity-0'
              )}
              aria-label="Remove item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
              </svg>
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
