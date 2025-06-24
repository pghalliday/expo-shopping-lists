export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      changesets: {
        Row: {
          changes: Json
          last_pulled_at: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          changes: Json
          last_pulled_at: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          changes?: Json
          last_pulled_at?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      list_users: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          list_id: string
          user_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          id: string
          list_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          list_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_users_created_at_fkey"
            columns: ["created_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
          {
            foreignKeyName: "list_users_deleted_at_fkey"
            columns: ["deleted_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
          {
            foreignKeyName: "list_users_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          deleted_at: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          deleted_at?: string | null
          id: string
          name: string
          updated_at: string
        }
        Update: {
          deleted_at?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_deleted_at_fkey"
            columns: ["deleted_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
          {
            foreignKeyName: "lists_updated_at_fkey"
            columns: ["updated_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          deleted_at: string | null
          display_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          deleted_at?: string | null
          display_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_created_at_fkey"
            columns: ["created_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
          {
            foreignKeyName: "profiles_deleted_at_fkey"
            columns: ["deleted_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
          {
            foreignKeyName: "profiles_updated_at_fkey"
            columns: ["updated_at"]
            isOneToOne: false
            referencedRelation: "changesets"
            referencedColumns: ["timestamp"]
          },
        ]
      }
      state: {
        Row: {
          bigint_v: number | null
          k: string
          text_v: string | null
          timestamp_v: string | null
        }
        Insert: {
          bigint_v?: number | null
          k: string
          text_v?: string | null
          timestamp_v?: string | null
        }
        Update: {
          bigint_v?: number | null
          k?: string
          text_v?: string | null
          timestamp_v?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_update_profile: {
        Args: {
          p_id: string
          p_user_id: string
          p_display_name: string
          p_timestamp: unknown
          p_last_pulled_at: unknown
        }
        Returns: undefined
      }
      delete_profile: {
        Args: { p_id: string; p_timestamp: unknown; p_last_pulled_at: unknown }
        Returns: undefined
      }
      epoch_to_timestamp: {
        Args: { p_epoch: number }
        Returns: unknown
      }
      get_bigint_state: {
        Args: { p_k: string }
        Returns: number
      }
      get_text_state: {
        Args: { p_k: string }
        Returns: string
      }
      get_timestamp_state: {
        Args: { p_k: string }
        Returns: unknown
      }
      pull: {
        Args: { p_last_pulled_at?: number }
        Returns: Json
      }
      pull_profiles: {
        Args: { p_last_pulled_at: unknown }
        Returns: Json
      }
      push: {
        Args: { p_last_pulled_at: number; p_changes: Json }
        Returns: undefined
      }
      push_internal: {
        Args: { p_user_id: string; p_last_pulled_at: number; p_changes: Json }
        Returns: undefined
      }
      push_profiles: {
        Args: {
          p_timestamp: unknown
          p_last_pulled_at: unknown
          p_changes: Json
        }
        Returns: undefined
      }
      set_bigint_state: {
        Args: { p_k: string; p_v: number }
        Returns: undefined
      }
      set_text_state: {
        Args: { p_k: string; p_v: string }
        Returns: undefined
      }
      set_timestamp_state: {
        Args: { p_k: string; p_v: unknown }
        Returns: undefined
      }
      timestamp_to_epoch: {
        Args: { p_timestamp: unknown }
        Returns: number
      }
      user_lists: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

