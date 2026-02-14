export interface Database {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          is_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          is_completed?: boolean;
          created_at?: string;
        };
      };
      kanban_cards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          column_id: string;
          priority: string | null;
          due_date: string | null;
          is_archived: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          column_id: string;
          priority?: string | null;
          due_date?: string | null;
          is_archived?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          column_id?: string;
          priority?: string | null;
          due_date?: string | null;
          is_archived?: boolean;
          position?: number;
          created_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          is_checked: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          is_checked?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          is_checked?: boolean;
          position?: number;
          created_at?: string;
        };
      };
      weekly_checkins: {
        Row: {
          id: string;
          user_id: string;
          week_of: string;
          score_body: number | null;
          score_mind: number | null;
          score_work: number | null;
          score_energy: number | null;
          equanimity_note: string;
          flag_note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_of: string;
          score_body?: number | null;
          score_mind?: number | null;
          score_work?: number | null;
          score_energy?: number | null;
          equanimity_note?: string;
          flag_note?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_of?: string;
          score_body?: number | null;
          score_mind?: number | null;
          score_work?: number | null;
          score_energy?: number | null;
          equanimity_note?: string;
          flag_note?: string;
          created_at?: string;
        };
      };
      monthly_reviews: {
        Row: {
          id: string;
          user_id: string;
          month_of: string;
          trends_note: string;
          keystone_note: string;
          next_why_note: string;
          adjust_note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month_of: string;
          trends_note?: string;
          keystone_note?: string;
          next_why_note?: string;
          adjust_note?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month_of?: string;
          trends_note?: string;
          keystone_note?: string;
          next_why_note?: string;
          adjust_note?: string;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          footer_message: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          footer_message?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          footer_message?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
