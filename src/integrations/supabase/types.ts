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
      products: {
        Row: {
          adress_io: string | null
          cle_io: string | null
          code_2d: string
          created_at: string | null
          id: string
          num_ligne: string
          num_po: string
          position: number
          ref_pcba_actia: string
          ref_pcba_somfy: string
          sfc: string
          status: number
          updated_at: string | null
        }
        Insert: {
          adress_io?: string | null
          cle_io?: string | null
          code_2d: string
          created_at?: string | null
          id?: string
          num_ligne: string
          num_po: string
          position: number
          ref_pcba_actia: string
          ref_pcba_somfy: string
          sfc: string
          status?: number
          updated_at?: string | null
        }
        Update: {
          adress_io?: string | null
          cle_io?: string | null
          code_2d?: string
          created_at?: string | null
          id?: string
          num_ligne?: string
          num_po?: string
          position?: number
          ref_pcba_actia?: string
          ref_pcba_somfy?: string
          sfc?: string
          status?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      test_passages: {
        Row: {
          details: string | null
          id: string
          nc_code: string | null
          product_id: string
          station: string
          station_number: number | null
          status: number
          test_date: string | null
          test_duration: unknown | null
        }
        Insert: {
          details?: string | null
          id?: string
          nc_code?: string | null
          product_id: string
          station: string
          station_number?: number | null
          status: number
          test_date?: string | null
          test_duration?: unknown | null
        }
        Update: {
          details?: string | null
          id?: string
          nc_code?: string | null
          product_id?: string
          station?: string
          station_number?: number | null
          status?: number
          test_date?: string | null
          test_duration?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "test_passages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_status_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_passages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      trace_view: {
        Row: {
          int4: string | null
          num: string | null
        }
        Insert: {
          int4?: string | null
          num?: string | null
        }
        Update: {
          int4?: string | null
          num?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      product_status_view: {
        Row: {
          cle_io: string | null
          code_2d: string | null
          failed_station: string | null
          failed_station_number: number | null
          failure_date: string | null
          id: string | null
          nbre_passage: number | null
          nc_code: string | null
          num_ligne: string | null
          num_po: string | null
          position: number | null
          ref_pcba_actia: string | null
          ref_pcba_somfy: string | null
          sfc: string | null
          status: number | null
        }
        Insert: {
          cle_io?: string | null
          code_2d?: string | null
          failed_station?: never
          failed_station_number?: never
          failure_date?: never
          id?: string | null
          nbre_passage?: never
          nc_code?: never
          num_ligne?: string | null
          num_po?: string | null
          position?: number | null
          ref_pcba_actia?: string | null
          ref_pcba_somfy?: string | null
          sfc?: string | null
          status?: number | null
        }
        Update: {
          cle_io?: string | null
          code_2d?: string | null
          failed_station?: never
          failed_station_number?: never
          failure_date?: never
          id?: string | null
          nbre_passage?: never
          nc_code?: never
          num_ligne?: string | null
          num_po?: string | null
          position?: number | null
          ref_pcba_actia?: string | null
          ref_pcba_somfy?: string | null
          sfc?: string | null
          status?: number | null
        }
        Relationships: []
      }
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
    Enums: {},
  },
} as const
