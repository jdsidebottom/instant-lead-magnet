export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          subscription_tier: 'free' | 'pro' | 'enterprise'
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      lead_magnets: {
        Row: {
          id: string
          user_id: string
          title: string
          topic: string
          type: 'ebook' | 'checklist' | 'template' | 'guide' | 'worksheet'
          status: 'draft' | 'generating' | 'completed' | 'failed'
          content: Json | null
          pdf_url: string | null
          landing_page_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          topic: string
          type: 'ebook' | 'checklist' | 'template' | 'guide' | 'worksheet'
          status?: 'draft' | 'generating' | 'completed' | 'failed'
          content?: Json | null
          pdf_url?: string | null
          landing_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          topic?: string
          type?: 'ebook' | 'checklist' | 'template' | 'guide' | 'worksheet'
          status?: 'draft' | 'generating' | 'completed' | 'failed'
          content?: Json | null
          pdf_url?: string | null
          landing_page_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_magnets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'pro' | 'enterprise'
      lead_magnet_type: 'ebook' | 'checklist' | 'template' | 'guide' | 'worksheet'
      lead_magnet_status: 'draft' | 'generating' | 'completed' | 'failed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
