'server-only'
'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const resetPassword = async (password: string) => {
  const supabase = createServerClient(cookies())

  const { data, error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) throw error

  return data
}

export default resetPassword