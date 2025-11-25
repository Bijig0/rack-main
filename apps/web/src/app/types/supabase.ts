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
      addon_details: {
        Row: {
          barbershop_details_id: number
          created_at: string
          details: string | null
          id: number
          name: string
          price: number | null
        }
        Insert: {
          barbershop_details_id: number
          created_at?: string
          details?: string | null
          id?: number
          name: string
          price?: number | null
        }
        Update: {
          barbershop_details_id?: number
          created_at?: string
          details?: string | null
          id?: number
          name?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addon_details_barbershop_details_id_fkey"
            columns: ["barbershop_details_id"]
            isOneToOne: false
            referencedRelation: "barbershop_details"
            referencedColumns: ["id"]
          },
        ]
      }
      addon_details_gallery: {
        Row: {
          addon_details_id: number
          created_at: string
          id: number
        }
        Insert: {
          addon_details_id: number
          created_at?: string
          id?: number
        }
        Update: {
          addon_details_id?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "addon_details_gallery_addon_details_id_fkey"
            columns: ["addon_details_id"]
            isOneToOne: true
            referencedRelation: "addon_details"
            referencedColumns: ["id"]
          },
        ]
      }
      addon_details_gallery_image: {
        Row: {
          addon_details_gallery_id: number | null
          created_at: string
          id: number
          image_url: string | null
          order: number | null
        }
        Insert: {
          addon_details_gallery_id?: number | null
          created_at?: string
          id?: number
          image_url?: string | null
          order?: number | null
        }
        Update: {
          addon_details_gallery_id?: number | null
          created_at?: string
          id?: number
          image_url?: string | null
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "addon_details_gallery_image_addon_details_gallery_id_fkey"
            columns: ["addon_details_gallery_id"]
            isOneToOne: false
            referencedRelation: "addon_details_gallery"
            referencedColumns: ["id"]
          },
        ]
      }
      barbershop_booking: {
        Row: {
          addon_details: number | null
          barbershop: number
          booking_user: number
          created_at: string
          haircut_details: number | null
          id: number
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          addon_details?: number | null
          barbershop: number
          booking_user: number
          created_at?: string
          haircut_details?: number | null
          id?: number
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          addon_details?: number | null
          barbershop?: number
          booking_user?: number
          created_at?: string
          haircut_details?: number | null
          id?: number
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "barbershop_booking_addon_details_fkey"
            columns: ["addon_details"]
            isOneToOne: false
            referencedRelation: "addon_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barbershop_booking_barbershop_fkey"
            columns: ["barbershop"]
            isOneToOne: false
            referencedRelation: "barbershop_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barbershop_booking_booking_user_fkey"
            columns: ["booking_user"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barbershop_booking_haircut_details_fkey"
            columns: ["haircut_details"]
            isOneToOne: false
            referencedRelation: "haircut_details"
            referencedColumns: ["id"]
          },
        ]
      }
      barbershop_details: {
        Row: {
          about: string | null
          address_url: string | null
          booking_url: string | null
          created_at: string
          exact_address: string | null
          general_address: string | null
          general_location: unknown | null
          id: number
          main_image: string | null
          name: string
          place_id: string | null
          tagline: string | null
          user_profile_id: number | null
        }
        Insert: {
          about?: string | null
          address_url?: string | null
          booking_url?: string | null
          created_at?: string
          exact_address?: string | null
          general_address?: string | null
          general_location?: unknown | null
          id?: number
          main_image?: string | null
          name: string
          place_id?: string | null
          tagline?: string | null
          user_profile_id?: number | null
        }
        Update: {
          about?: string | null
          address_url?: string | null
          booking_url?: string | null
          created_at?: string
          exact_address?: string | null
          general_address?: string | null
          general_location?: unknown | null
          id?: number
          main_image?: string | null
          name?: string
          place_id?: string | null
          tagline?: string | null
          user_profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "barbershop_details_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      barbershop_gallery: {
        Row: {
          barbershop_details_id: number
          created_at: string
          id: number
          main_image: string | null
          sub_image_one: string | null
          sub_image_three: string | null
          sub_image_two: string | null
        }
        Insert: {
          barbershop_details_id: number
          created_at?: string
          id?: number
          main_image?: string | null
          sub_image_one?: string | null
          sub_image_three?: string | null
          sub_image_two?: string | null
        }
        Update: {
          barbershop_details_id?: number
          created_at?: string
          id?: number
          main_image?: string | null
          sub_image_one?: string | null
          sub_image_three?: string | null
          sub_image_two?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barbershop_gallery_barbershop_details_id_fkey"
            columns: ["barbershop_details_id"]
            isOneToOne: true
            referencedRelation: "barbershop_details"
            referencedColumns: ["id"]
          },
        ]
      }
      haircut_details: {
        Row: {
          barbershop_details_id: number | null
          created_at: string
          details: string | null
          id: number
          is_featured: boolean | null
          name: string | null
          price: number | null
        }
        Insert: {
          barbershop_details_id?: number | null
          created_at?: string
          details?: string | null
          id?: number
          is_featured?: boolean | null
          name?: string | null
          price?: number | null
        }
        Update: {
          barbershop_details_id?: number | null
          created_at?: string
          details?: string | null
          id?: number
          is_featured?: boolean | null
          name?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "haircut_details_barbershop_details_id_fkey"
            columns: ["barbershop_details_id"]
            isOneToOne: false
            referencedRelation: "barbershop_details"
            referencedColumns: ["id"]
          },
        ]
      }
      haircut_details_gallery: {
        Row: {
          created_at: string
          haircut_details_id: number | null
          id: number
        }
        Insert: {
          created_at?: string
          haircut_details_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          haircut_details_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "haircut_details_gallery_haircut_details_id_fkey"
            columns: ["haircut_details_id"]
            isOneToOne: true
            referencedRelation: "haircut_details"
            referencedColumns: ["id"]
          },
        ]
      }
      haircut_details_gallery_image: {
        Row: {
          created_at: string
          haircut_details_gallery_id: number | null
          id: number
          image_url: string | null
          order: number | null
        }
        Insert: {
          created_at?: string
          haircut_details_gallery_id?: number | null
          id?: number
          image_url?: string | null
          order?: number | null
        }
        Update: {
          created_at?: string
          haircut_details_gallery_id?: number | null
          id?: number
          image_url?: string | null
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "haircut_details_gallery_image_haircut_details_gallery_id_fkey"
            columns: ["haircut_details_gallery_id"]
            isOneToOne: false
            referencedRelation: "haircut_details_gallery"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media: {
        Row: {
          barbershop_details_id: number | null
          created_at: string
          follower_count: number | null
          handle: string | null
          id: number
          password: string | null
        }
        Insert: {
          barbershop_details_id?: number | null
          created_at?: string
          follower_count?: number | null
          handle?: string | null
          id?: number
          password?: string | null
        }
        Update: {
          barbershop_details_id?: number | null
          created_at?: string
          follower_count?: number | null
          handle?: string | null
          id?: number
          password?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_media_barbershop_details_id_fkey"
            columns: ["barbershop_details_id"]
            isOneToOne: true
            referencedRelation: "barbershop_details"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
          user_id: string | null
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type"]
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_id?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      barbershops: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          tagline: string
          exact_address: string
          general_address: string
          lat: number
          long: number
          main_image: string
          handle: string
          follower_count: number
        }[]
      }
      drop_all_tables: {
        Args: {
          schema_name: string
        }
        Returns: undefined
      }
      nearby_barbershops: {
        Args: {
          lat: number
          long: number
          result_limit: number
        }
        Returns: {
          id: number
          name: string
          tagline: string
          exact_address: string
          general_address: string
          main_image: string
          handle: string
          follower_count: number
        }[]
      }
      set_featured_haircut: {
        Args: {
          barbershop_details_id: number
          cut_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      account_type: "barbershop" | "individual"
      booking_status: "cancelled" | "recurring" | "upcoming" | "past"
      social_media_type: "instagram" | "twitter"
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
