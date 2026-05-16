export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      product_tests: {
        Row: {
          created_at: string
          details: string | null
          id: string
          product_id: string
          station: string
          status: string
          test_timestamp: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          product_id: string
          station: string
          status: string
          test_timestamp?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          product_id?: string
          station?: string
          status?: string
          test_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          code_2d: string | null
          created_at: string
          failed_station: string | null
          failure_date: string | null
          final_status: string | null
          id: string
          operator_notes: string | null
          passage_count: number | null
          product_key: string | null
          sfc: string
          updated_at: string
        }
        Insert: {
          code_2d?: string | null
          created_at?: string
          failed_station?: string | null
          failure_date?: string | null
          final_status?: string | null
          id?: string
          operator_notes?: string | null
          passage_count?: number | null
          product_key?: string | null
          sfc: string
          updated_at?: string
        }
        Update: {
          code_2d?: string | null
          created_at?: string
          failed_station?: string | null
          failure_date?: string | null
          final_status?: string | null
          id?: string
          operator_notes?: string | null
          passage_count?: number | null
          product_key?: string | null
          sfc?: string
          updated_at?: string
        }
        Relationships: []
      }
      trace_view: {
        Row: {
          adress_io: string | null
          blt_date_heure: string | null
          calibration_data: string | null
          code_2d: string | null
          config_ligne: string | null
          created_at: string
          hw_version: string | null
          nc_log_bl: string | null
          nc_log_rf: string | null
          nc_log_rf_slide: string | null
          nc_log_uft: string | null
          nc_log_vision: string | null
          num: number
          num_porte_outil: number | null
          num_poste_blt: number | null
          num_poste_rf: number | null
          num_poste_rf_slider: number | null
          num_poste_uft: number | null
          param_test: string | null
          position: number | null
          product_key: string | null
          ref_pcba_actia: string | null
          ref_pcba_somfy: string | null
          rf_date_heure: string | null
          rf_slider_date_heure: string | null
          sfc: string | null
          status: number | null
          status_blt_sfc: number | null
          status_rf_sfc: number | null
          status_rf_slider_sfc: number | null
          status_uft_sfc: number | null
          status_vision_sfc: number | null
          sw_produit: string | null
          uft_date_heure: string | null
          vision_date_heure: string | null
        }
        Insert: {
          adress_io?: string | null
          blt_date_heure?: string | null
          calibration_data?: string | null
          code_2d?: string | null
          config_ligne?: string | null
          created_at?: string
          hw_version?: string | null
          nc_log_bl?: string | null
          nc_log_rf?: string | null
          nc_log_rf_slide?: string | null
          nc_log_uft?: string | null
          nc_log_vision?: string | null
          num?: number
          num_porte_outil?: number | null
          num_poste_blt?: number | null
          num_poste_rf?: number | null
          num_poste_rf_slider?: number | null
          num_poste_uft?: number | null
          param_test?: string | null
          position?: number | null
          product_key?: string | null
          ref_pcba_actia?: string | null
          ref_pcba_somfy?: string | null
          rf_date_heure?: string | null
          rf_slider_date_heure?: string | null
          sfc?: string | null
          status?: number | null
          status_blt_sfc?: number | null
          status_rf_sfc?: number | null
          status_rf_slider_sfc?: number | null
          status_uft_sfc?: number | null
          status_vision_sfc?: number | null
          sw_produit?: string | null
          uft_date_heure?: string | null
          vision_date_heure?: string | null
        }
        Update: {
          adress_io?: string | null
          blt_date_heure?: string | null
          calibration_data?: string | null
          code_2d?: string | null
          config_ligne?: string | null
          created_at?: string
          hw_version?: string | null
          nc_log_bl?: string | null
          nc_log_rf?: string | null
          nc_log_rf_slide?: string | null
          nc_log_uft?: string | null
          nc_log_vision?: string | null
          num?: number
          num_porte_outil?: number | null
          num_poste_blt?: number | null
          num_poste_rf?: number | null
          num_poste_rf_slider?: number | null
          num_poste_uft?: number | null
          param_test?: string | null
          position?: number | null
          product_key?: string | null
          ref_pcba_actia?: string | null
          ref_pcba_somfy?: string | null
          rf_date_heure?: string | null
          rf_slider_date_heure?: string | null
          sfc?: string | null
          status?: number | null
          status_blt_sfc?: number | null
          status_rf_sfc?: number | null
          status_rf_slider_sfc?: number | null
          status_uft_sfc?: number | null
          status_vision_sfc?: number | null
          sw_produit?: string | null
          uft_date_heure?: string | null
          vision_date_heure?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
