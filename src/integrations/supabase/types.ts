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
      matches: {
        Row: {
          away_logo: string | null
          away_ranking: number | null
          away_score: number | null
          away_team: string
          created_at: string
          data_source: string | null
          external_id: string | null
          home_logo: string | null
          home_ranking: number | null
          home_score: number | null
          home_team: string
          id: string
          league: string
          match_date: string
          odds: Json | null
          season: string | null
          source_priority: number | null
          sport: string
          stats: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          away_logo?: string | null
          away_ranking?: number | null
          away_score?: number | null
          away_team: string
          created_at?: string
          data_source?: string | null
          external_id?: string | null
          home_logo?: string | null
          home_ranking?: number | null
          home_score?: number | null
          home_team: string
          id?: string
          league: string
          match_date: string
          odds?: Json | null
          season?: string | null
          source_priority?: number | null
          sport?: string
          stats?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          away_logo?: string | null
          away_ranking?: number | null
          away_score?: number | null
          away_team?: string
          created_at?: string
          data_source?: string | null
          external_id?: string | null
          home_logo?: string | null
          home_ranking?: number | null
          home_score?: number | null
          home_team?: string
          id?: string
          league?: string
          match_date?: string
          odds?: Json | null
          season?: string | null
          source_priority?: number | null
          sport?: string
          stats?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          confidence: number
          created_at: string
          created_by: string | null
          id: string
          is_premium: boolean | null
          league: string
          match_date: string
          match_title: string
          odds: number
          prediction: string
          result: string | null
          updated_at: string
          absents: string | null
          meteo: string | null
          enjeux: string | null
          description: string | null
          archived: boolean | null
        }
        Insert: {
          confidence: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_premium?: boolean | null
          league: string
          match_date: string
          match_title: string
          odds: number
          prediction: string
          result?: string | null
          updated_at?: string
          absents?: string | null
          meteo?: string | null
          enjeux?: string | null
          description?: string | null
          archived?: boolean | null
        }
        Update: {
          confidence?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_premium?: boolean | null
          league?: string
          match_date?: string
          match_title?: string
          odds?: number
          prediction?: string
          result?: string | null
          updated_at?: string
          absents?: string | null
          meteo?: string | null
          enjeux?: string | null
          description?: string | null
          archived?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_premium: boolean
          referral_code: string | null
          referred_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_premium?: boolean
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_premium?: boolean
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          reward_type: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          reward_type?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          reward_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      tips: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string
          featured: boolean | null
          id: string
          read_time: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          excerpt: string
          featured?: boolean | null
          id?: string
          read_time: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: string
          read_time?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_game_stats: {
        Row: {
          accumulators_created: number | null
          accumulators_won: number | null
          created_at: string
          id: string
          quiz_correct_answers: number | null
          quiz_games_played: number | null
          score_predictions_correct: number | null
          score_predictions_made: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accumulators_created?: number | null
          accumulators_won?: number | null
          created_at?: string
          id?: string
          quiz_correct_answers?: number | null
          quiz_games_played?: number | null
          score_predictions_correct?: number | null
          score_predictions_made?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accumulators_created?: number | null
          accumulators_won?: number | null
          created_at?: string
          id?: string
          quiz_correct_answers?: number | null
          quiz_games_played?: number | null
          score_predictions_correct?: number | null
          score_predictions_made?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_referral_code_exists: { Args: { code: string }; Returns: boolean }
      generate_referral_code: { Args: never; Returns: string }
      get_referrer_id_by_code: { Args: { code: string }; Returns: string | null }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
