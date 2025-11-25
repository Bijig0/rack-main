namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string
    NODE_ENV: 'development' | 'production'
    NEXT_PUBLIC_GEOAPIFY_API_KEY: string
    INSTAGRAM_URL: string
    INSTAGRAM_APP_ID: string
    INSTAGRAM_APP_SECRET: string
    SITE_URL: string
    NEXT_PUBLIC_GOOGLE_PLACES_API: string
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE: string
  }
}
