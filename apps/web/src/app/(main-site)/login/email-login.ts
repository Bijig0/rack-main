'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const emailLogin = async (email: string, password: string) => {
  const supabase = createServerClient(cookies())

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return error.message
}

export default emailLogin
