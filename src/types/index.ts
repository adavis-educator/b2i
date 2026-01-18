export type ColumnId = 'todo' | 'in-progress' | 'complete';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  createdAt: string;
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
