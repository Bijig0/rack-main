import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export const SUPABASE_AUTH_EMAIL = 'bradysuryasie@gmail.com'
export const SUPABASE_AUTH_PASSWORD = 'Mycariscclass1'
const SUPABASE_URL = 'https://agslweirgmorisihaqbz.supabase.co'

const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnc2x3ZWlyZ21vcmlzaWhhcWJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjYyMTc2OCwiZXhwIjoyMDMyMTk3NzY4fQ.xSIvVRZoqzMaPnbwAVbuQridb99GWhEMwDWiCcUHmtw'

export const supabase = createClient<Database>(SUPABASE_URL, ANON_KEY)
