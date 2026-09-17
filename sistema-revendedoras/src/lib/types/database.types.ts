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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conferencias: {
        Row: {
          acrescimos: number
          created_at: string
          data_realizada: string
          descontos: number
          entrega_id: string
          id: string
          observacoes: string | null
          pecas_devolvidas: number
          pecas_repostas: number
          pecas_vendidas: number
          percentual_empresa_aplicado: number
          percentual_proprietaria_aplicado: number
          percentual_revendedora_aplicado: number
          percentual_socia_aplicado: number
          proxima_conferencia_prevista: string | null
          quantidade_pecas_apos: number
          status: string
          tipo: string
          updated_at: string
          valor_atual_apos: number
          valor_comissao_revendedora: number
          valor_empresa: number
          valor_proprietaria: number
          valor_reposicao: number
          valor_socia: number
          valor_vendido: number
        }
        Insert: {
          acrescimos?: number
          created_at?: string
          data_realizada?: string
          descontos?: number
          entrega_id: string
          id?: string
          observacoes?: string | null
          pecas_devolvidas?: number
          pecas_repostas?: number
          pecas_vendidas?: number
          percentual_empresa_aplicado: number
          percentual_proprietaria_aplicado: number
          percentual_revendedora_aplicado: number
          percentual_socia_aplicado: number
          proxima_conferencia_prevista?: string | null
          quantidade_pecas_apos: number
          status?: string
          tipo: string
          updated_at?: string
          valor_atual_apos: number
          valor_comissao_revendedora: number
          valor_empresa: number
          valor_proprietaria: number
          valor_reposicao?: number
          valor_socia: number
          valor_vendido?: number
        }
        Update: {
          acrescimos?: number
          created_at?: string
          data_realizada?: string
          descontos?: number
          entrega_id?: string
          id?: string
          observacoes?: string | null
          pecas_devolvidas?: number
          pecas_repostas?: number
          pecas_vendidas?: number
          percentual_empresa_aplicado?: number
          percentual_proprietaria_aplicado?: number
          percentual_revendedora_aplicado?: number
          percentual_socia_aplicado?: number
          proxima_conferencia_prevista?: string | null
          quantidade_pecas_apos?: number
          status?: string
          tipo?: string
          updated_at?: string
          valor_atual_apos?: number
          valor_comissao_revendedora?: number
          valor_empresa?: number
          valor_proprietaria?: number
          valor_reposicao?: number
          valor_socia?: number
          valor_vendido?: number
        }
        Relationships: [
          {
            foreignKeyName: "conferencias_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          cnpj_empresa: string | null
          endereco_empresa: string | null
          id: number
          nome_empresa: string | null
          percentual_empresa: number
          percentual_proprietaria: number
          percentual_revendedora: number
          percentual_socia: number
          prazo_padrao_dias: number
          telefone_empresa: string | null
          updated_at: string
        }
        Insert: {
          cnpj_empresa?: string | null
          endereco_empresa?: string | null
          id?: number
          nome_empresa?: string | null
          percentual_empresa?: number
          percentual_proprietaria?: number
          percentual_revendedora?: number
          percentual_socia?: number
          prazo_padrao_dias?: number
          telefone_empresa?: string | null
          updated_at?: string
        }
        Update: {
          cnpj_empresa?: string | null
          endereco_empresa?: string | null
          id?: number
          nome_empresa?: string | null
          percentual_empresa?: number
          percentual_proprietaria?: number
          percentual_revendedora?: number
          percentual_socia?: number
          prazo_padrao_dias?: number
          telefone_empresa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          created_at: string
          data_conferencia_prevista: string
          data_encerramento: string | null
          data_entrega: string
          excecao_autorizada: boolean
          id: string
          mostruario_id: string
          observacoes: string | null
          prazo_dias_aplicado: number
          quantidade_pecas_atual: number
          quantidade_pecas_entrega: number
          responsavel: string | null
          revendedora_id: string
          status: string
          updated_at: string
          valor_atual: number
          valor_total_entrega: number
        }
        Insert: {
          created_at?: string
          data_conferencia_prevista: string
          data_encerramento?: string | null
          data_entrega?: string
          excecao_autorizada?: boolean
          id?: string
          mostruario_id: string
          observacoes?: string | null
          prazo_dias_aplicado: number
          quantidade_pecas_atual: number
          quantidade_pecas_entrega: number
          responsavel?: string | null
          revendedora_id: string
          status?: string
          updated_at?: string
          valor_atual: number
          valor_total_entrega: number
        }
        Update: {
          created_at?: string
          data_conferencia_prevista?: string
          data_encerramento?: string | null
          data_entrega?: string
          excecao_autorizada?: boolean
          id?: string
          mostruario_id?: string
          observacoes?: string | null
          prazo_dias_aplicado?: number
          quantidade_pecas_atual?: number
          quantidade_pecas_entrega?: number
          responsavel?: string | null
          revendedora_id?: string
          status?: string
          updated_at?: string
          valor_atual?: number
          valor_total_entrega?: number
        }
        Relationships: [
          {
            foreignKeyName: "entregas_mostruario_id_fkey"
            columns: ["mostruario_id"]
            isOneToOne: false
            referencedRelation: "mostruarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_revendedora_id_fkey"
            columns: ["revendedora_id"]
            isOneToOne: false
            referencedRelation: "revendedoras"
            referencedColumns: ["id"]
          },
        ]
      }
      mostruarios: {
        Row: {
          codigo: string
          created_at: string
          id: string
          nome: string
          observacoes: string | null
          quantidade_pecas: number
          status: string
          tamanho: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          codigo?: string
          created_at?: string
          id?: string
          nome: string
          observacoes?: string | null
          quantidade_pecas: number
          status?: string
          tamanho?: string | null
          updated_at?: string
          valor_total: number
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: string
          nome?: string
          observacoes?: string | null
          quantidade_pecas?: number
          status?: string
          tamanho?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          conferencia_id: string
          created_at: string
          data: string
          forma_pagamento: string
          id: string
          observacao: string | null
          status: string
          valor_pago: number
        }
        Insert: {
          conferencia_id: string
          created_at?: string
          data?: string
          forma_pagamento: string
          id?: string
          observacao?: string | null
          status?: string
          valor_pago: number
        }
        Update: {
          conferencia_id?: string
          created_at?: string
          data?: string
          forma_pagamento?: string
          id?: string
          observacao?: string | null
          status?: string
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_conferencia_id_fkey"
            columns: ["conferencia_id"]
            isOneToOne: false
            referencedRelation: "conferencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_conferencia_id_fkey"
            columns: ["conferencia_id"]
            isOneToOne: false
            referencedRelation: "v_conferencias_saldo"
            referencedColumns: ["conferencia_id"]
          },
        ]
      }
      repasses: {
        Row: {
          created_at: string
          data: string
          forma_pagamento: string
          id: string
          observacao: string | null
          status: string
          valor: number
        }
        Insert: {
          created_at?: string
          data?: string
          forma_pagamento: string
          id?: string
          observacao?: string | null
          status?: string
          valor: number
        }
        Update: {
          created_at?: string
          data?: string
          forma_pagamento?: string
          id?: string
          observacao?: string | null
          status?: string
          valor?: number
        }
        Relationships: []
      }
      revendedoras: {
        Row: {
          bairro: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          data_cadastro: string
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          nome_completo: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_completo: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome_completo?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_conferencias_saldo: {
        Row: {
          conferencia_id: string | null
          data_realizada: string | null
          entrega_id: string | null
          mais_recente: boolean | null
          status_pagamento: string | null
          valor_empresa: number | null
          valor_pago: number | null
          valor_pendente: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conferencias_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
