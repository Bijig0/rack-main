'server-only'
'use server'

import Urls from '@/app/urls/urls'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const sendPasswordResetEmail = async (email: string) => {
  const supabase = createServerClient(cookies())

  const redirectUrl = `${process.env.SITE_URL}${Urls['password-reset']}`

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  })

  if (error) throw error

  return data
}

export default sendPasswordResetEmail
