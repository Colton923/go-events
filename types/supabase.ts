export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      commissions: {
        Row: {
          action_date: string | null
          client: string | null
          created_at: string | null
          employee: number | null
          employee_wage: number | null
          event_date: string | null
          external_id: number | null
          id: number
          next_action: string | null
          organization: number | null
          salesperson: number | null
          status: string | null
          total_fee: number | null
        }
        Insert: {
          action_date?: string | null
          client?: string | null
          created_at?: string | null
          employee?: number | null
          employee_wage?: number | null
          event_date?: string | null
          external_id?: number | null
          id?: number
          next_action?: string | null
          organization?: number | null
          salesperson?: number | null
          status?: string | null
          total_fee?: number | null
        }
        Update: {
          action_date?: string | null
          client?: string | null
          created_at?: string | null
          employee?: number | null
          employee_wage?: number | null
          event_date?: string | null
          external_id?: number | null
          id?: number
          next_action?: string | null
          organization?: number | null
          salesperson?: number | null
          status?: string | null
          total_fee?: number | null
        }
      }
      employees: {
        Row: {
          created_at: string | null
          employee: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          employee?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          employee?: string | null
          id?: number
        }
      }
      managers: {
        Row: {
          created_at: string | null
          id: number
          manager: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          manager?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          manager?: string | null
        }
      }
      organizations: {
        Row: {
          created_at: string | null
          id: number
          organization: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          organization?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          organization?: string | null
        }
      }
      sales: {
        Row: {
          commission_percent: number | null
          created_at: string | null
          from_effective: string | null
          id: number
          manager: number | null
          manager_commission_percent: number | null
          organization: number | null
          salesperson: number | null
          to_effective: string | null
        }
        Insert: {
          commission_percent?: number | null
          created_at?: string | null
          from_effective?: string | null
          id?: number
          manager?: number | null
          manager_commission_percent?: number | null
          organization?: number | null
          salesperson?: number | null
          to_effective?: string | null
        }
        Update: {
          commission_percent?: number | null
          created_at?: string | null
          from_effective?: string | null
          id?: number
          manager?: number | null
          manager_commission_percent?: number | null
          organization?: number | null
          salesperson?: number | null
          to_effective?: string | null
        }
      }
      salespeople: {
        Row: {
          created_at: string | null
          id: number
          salesperson: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          salesperson?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          salesperson?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
