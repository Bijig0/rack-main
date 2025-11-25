'server-only'
import { cookies } from 'next/headers'
import { createServerClient } from './supabase/supabase'

const getUser = async () => {
  const supabase = createServerClient(cookies())
  const result = await supabase.auth.getUser()
  return result
}

export default getUser
