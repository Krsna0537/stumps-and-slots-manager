
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
      bookings: {
        Row: {
          id: string
          user_id: string
          ground_id: string
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected'
          total_price: number
          created_at: string
          updated_at: string
          user_email?: string
          time_slot?: string
          date?: string
          notes?: string
        }
        Insert: {
          id?: string
          user_id: string
          ground_id: string
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected'
          total_price: number
          created_at?: string
          updated_at?: string
          user_email?: string
          time_slot?: string
          date?: string
          notes?: string
        }
        Update: {
          id?: string
          user_id?: string
          ground_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected'
          total_price?: number
          created_at?: string
          updated_at?: string
          user_email?: string
          time_slot?: string
          date?: string
          notes?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ground_id_fkey"
            columns: ["ground_id"]
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      grounds: {
        Row: {
          id: string
          name: string
          description: string | null
          location: string
          address: string
          price_per_hour: number
          image_url: string | null
          owner_id: string | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          location: string
          address: string
          price_per_hour: number
          image_url?: string | null
          owner_id?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          location?: string
          address?: string
          price_per_hour?: number
          image_url?: string | null
          owner_id?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grounds_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: 'success' | 'error' | 'warning' | 'info'
          is_read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type: 'success' | 'error' | 'warning' | 'info'
          is_read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'success' | 'error' | 'warning' | 'info'
          is_read?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          payment_method: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          payment_method?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          ground_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ground_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ground_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_ground_id_fkey"
            columns: ["ground_id"]
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          is_admin: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
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
      is_admin_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      user_role: 'user' | 'admin' | 'ground_owner'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
