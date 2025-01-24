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
      ai_assess_complaints: {
        Row: {
          complaints_flag: boolean
          complaints_reasoning: string | null
          contact_id: string
          created_at: string | null
          id: string
          physical_disability_flag: boolean
          physical_disability_reasoning: string | null
          updated_at: string | null
        }
        Insert: {
          complaints_flag?: boolean
          complaints_reasoning?: string | null
          contact_id: string
          created_at?: string | null
          id?: string
          physical_disability_flag?: boolean
          physical_disability_reasoning?: string | null
          updated_at?: string | null
        }
        Update: {
          complaints_flag?: boolean
          complaints_reasoning?: string | null
          contact_id?: string
          created_at?: string | null
          id?: string
          physical_disability_flag?: boolean
          physical_disability_reasoning?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_assess_complaints_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "upload_details"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      ai_assess_vulnerability: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          vulnerability_flag: boolean
          vulnerability_reasoning: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          vulnerability_flag?: boolean
          vulnerability_reasoning?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          vulnerability_flag?: boolean
          vulnerability_reasoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_assess_vulnerability_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "upload_details"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      contact_assessments: {
        Row: {
          complaints: string[] | null
          complaints_rationale: string | null
          contact_id: string
          created_at: string | null
          has_physical_disability: boolean | null
          id: string
          updated_at: string | null
          vulnerabilities: string[] | null
          vulnerability_rationale: string | null
        }
        Insert: {
          complaints?: string[] | null
          complaints_rationale?: string | null
          contact_id: string
          created_at?: string | null
          has_physical_disability?: boolean | null
          id?: string
          updated_at?: string | null
          vulnerabilities?: string[] | null
          vulnerability_rationale?: string | null
        }
        Update: {
          complaints?: string[] | null
          complaints_rationale?: string | null
          contact_id?: string
          created_at?: string | null
          has_physical_disability?: boolean | null
          id?: string
          updated_at?: string | null
          vulnerabilities?: string[] | null
          vulnerability_rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contact_assessment_id"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "upload_details"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      contact_conversations: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          transcript: string
          updated_at: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          transcript: string
          updated_at?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          transcript?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contact_id"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "upload_details"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      upload_details: {
        Row: {
          admin_id: string | null
          contact_id: string
          evaluator: string
          id: string
          upload_timestamp: string
        }
        Insert: {
          admin_id?: string | null
          contact_id: string
          evaluator: string
          id?: string
          upload_timestamp?: string
        }
        Update: {
          admin_id?: string | null
          contact_id?: string
          evaluator?: string
          id?: string
          upload_timestamp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
      evaluator_role: "primary" | "secondary" | "tertiary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
