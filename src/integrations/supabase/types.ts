export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          date: string | null
          end_time: string
          ground_id: string
          id: string
          notes: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          time_slot: string | null
          total_price: number
          updated_at: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          booking_date?: string
          created_at?: string
          date?: string | null
          end_time: string
          ground_id: string
          id?: string
          notes?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          time_slot?: string | null
          total_price: number
          updated_at?: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          date?: string | null
          end_time?: string
          ground_id?: string
          id?: string
          notes?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          time_slot?: string | null
          total_price?: number
          updated_at?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ground_amenities: {
        Row: {
          created_at: string
          ground_id: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          ground_id: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          ground_id?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ground_amenities_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      ground_images: {
        Row: {
          created_at: string
          ground_id: string
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          created_at?: string
          ground_id: string
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          created_at?: string
          ground_id?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ground_images_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      grounds: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          owner_id: string | null
          price_per_hour: number
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          owner_id?: string | null
          price_per_hour: number
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          owner_id?: string | null
          price_per_hour?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grounds_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          ground_id: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          ground_id: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          ground_id?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_ground_id_fkey"
            columns: ["ground_id"]
            isOneToOne: false
            referencedRelation: "grounds"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
        }
        Relationships: []
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
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "user" | "admin" | "ground_owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["user", "admin", "ground_owner"],
    },
  },
} as const
