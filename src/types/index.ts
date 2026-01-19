export type ColumnId = 'todo' | 'in-progress' | 'complete';

export type Priority = 'low' | 'medium' | 'high';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  createdAt: string;
  dueDate?: string;
  priority?: Priority;
  isArchived?: boolean;
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  isChecked: boolean;
  isDefault: boolean;
}

export interface Goal {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface BoardState {
  cards: KanbanCard[];
}
