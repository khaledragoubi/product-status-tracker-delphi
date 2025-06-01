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
      product_annotations: {
        Row: {
          additional_notes: string | null
          created_at: string
          created_by: string
          defect_nature: string
          defect_type: string
          diagnostic_date: string
          id: string
          product_key: string
          topographic_reference: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          created_by: string
          defect_nature: string
          defect_type: string
          diagnostic_date?: string
          id?: string
          product_key: string
          topographic_reference: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          created_by?: string
          defect_nature?: string
          defect_type?: string
          diagnostic_date?: string
          id?: string
          product_key?: string
          topographic_reference?: string
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
          hw_version: string | null
          nc_log_bl: string | null
          nc_log_rf: string | null
          nc_log_rf_slide: string | null
          nc_log_uft: string | null
          nc_log_vision: string | null
          num: number | null
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
          hw_version?: string | null
          nc_log_bl?: string | null
          nc_log_rf?: string | null
          nc_log_rf_slide?: string | null
          nc_log_uft?: string | null
          nc_log_vision?: string | null
          num?: number | null
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
          hw_version?: string | null
          nc_log_bl?: string | null
          nc_log_rf?: string | null
          nc_log_rf_slide?: string | null
          nc_log_uft?: string | null
          nc_log_vision?: string | null
          num?: number | null
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
      user_metadata: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_role: {
        Args: { requested_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technicien_diag" | "viewer"
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
      app_role: ["admin", "technicien_diag", "viewer"],
    },
  },
} as const
