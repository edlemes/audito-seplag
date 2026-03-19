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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cms_content: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string
          ordem: number
          subtitulo: string | null
          tipo: string
          titulo: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url: string
          ordem?: number
          subtitulo?: string | null
          tipo: string
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          ordem?: number
          subtitulo?: string | null
          tipo?: string
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      feedback_usuario: {
        Row: {
          comentario: string | null
          created_at: string
          id: string
          nota_atendimento: number | null
          nota_equipamentos: number | null
          nota_geral: number
          nota_infraestrutura: number | null
          sugestao: string | null
          user_id: string | null
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          id?: string
          nota_atendimento?: number | null
          nota_equipamentos?: number | null
          nota_geral: number
          nota_infraestrutura?: number | null
          sugestao?: string | null
          user_id?: string | null
        }
        Update: {
          comentario?: string | null
          created_at?: string
          id?: string
          nota_atendimento?: number | null
          nota_equipamentos?: number | null
          nota_geral?: number
          nota_infraestrutura?: number | null
          sugestao?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      solicitacoes_auditorio: {
        Row: {
          cpf: string
          created_at: string
          data_evento: string
          descricao_evento: string | null
          email: string
          horario_fim: string
          horario_inicio: string
          id: string
          nome_solicitante: string
          num_participantes: number | null
          orgao: string
          secretaria_atendida: string
          status: Database["public"]["Enums"]["status_solicitacao"]
          telefone: string | null
          termo_assinado_url: string | null
          titulo_evento: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cpf: string
          created_at?: string
          data_evento: string
          descricao_evento?: string | null
          email: string
          horario_fim: string
          horario_inicio: string
          id?: string
          nome_solicitante: string
          num_participantes?: number | null
          orgao: string
          secretaria_atendida: string
          status?: Database["public"]["Enums"]["status_solicitacao"]
          telefone?: string | null
          termo_assinado_url?: string | null
          titulo_evento: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string
          data_evento?: string
          descricao_evento?: string | null
          email?: string
          horario_fim?: string
          horario_inicio?: string
          id?: string
          nome_solicitante?: string
          num_participantes?: number | null
          orgao?: string
          secretaria_atendida?: string
          status?: Database["public"]["Enums"]["status_solicitacao"]
          telefone?: string | null
          termo_assinado_url?: string | null
          titulo_evento?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vistoria_equipamentos: {
        Row: {
          ar_condicionado: Database["public"]["Enums"]["status_item"]
          created_at: string
          id: string
          iluminacao: Database["public"]["Enums"]["status_item"]
          inspector_id: string
          limpeza_cadeiras: Database["public"]["Enums"]["status_item"]
          microfones: Database["public"]["Enums"]["status_item"]
          observacoes: string | null
          projetor: Database["public"]["Enums"]["status_item"]
          rede_wifi: Database["public"]["Enums"]["status_item"]
          solicitacao_id: string | null
          som: Database["public"]["Enums"]["status_item"]
          tela_projecao: Database["public"]["Enums"]["status_item"]
          tipo_vistoria: string
        }
        Insert: {
          ar_condicionado?: Database["public"]["Enums"]["status_item"]
          created_at?: string
          id?: string
          iluminacao?: Database["public"]["Enums"]["status_item"]
          inspector_id: string
          limpeza_cadeiras?: Database["public"]["Enums"]["status_item"]
          microfones?: Database["public"]["Enums"]["status_item"]
          observacoes?: string | null
          projetor?: Database["public"]["Enums"]["status_item"]
          rede_wifi?: Database["public"]["Enums"]["status_item"]
          solicitacao_id?: string | null
          som?: Database["public"]["Enums"]["status_item"]
          tela_projecao?: Database["public"]["Enums"]["status_item"]
          tipo_vistoria: string
        }
        Update: {
          ar_condicionado?: Database["public"]["Enums"]["status_item"]
          created_at?: string
          id?: string
          iluminacao?: Database["public"]["Enums"]["status_item"]
          inspector_id?: string
          limpeza_cadeiras?: Database["public"]["Enums"]["status_item"]
          microfones?: Database["public"]["Enums"]["status_item"]
          observacoes?: string | null
          projetor?: Database["public"]["Enums"]["status_item"]
          rede_wifi?: Database["public"]["Enums"]["status_item"]
          solicitacao_id?: string | null
          som?: Database["public"]["Enums"]["status_item"]
          tela_projecao?: Database["public"]["Enums"]["status_item"]
          tipo_vistoria?: string
        }
        Relationships: [
          {
            foreignKeyName: "vistoria_equipamentos_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_auditorio"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "readonly"
      status_item: "bom" | "manutencao" | "ajuste"
      status_solicitacao: "pendente" | "aprovada" | "recusada" | "cancelada"
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
    Enums: {
      app_role: ["admin", "readonly"],
      status_item: ["bom", "manutencao", "ajuste"],
      status_solicitacao: ["pendente", "aprovada", "recusada", "cancelada"],
    },
  },
} as const
