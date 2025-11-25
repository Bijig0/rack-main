import { Database } from '@/app/types/supabase'
import { createBrowserClient as browserClient } from '@supabase/ssr'

export const createBrowserClient = () =>
  browserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

export const createAdminClient = () =>
  browserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!,
  )
