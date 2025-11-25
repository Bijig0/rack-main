'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const resendEmail = async (
  email: string,
  userType: 'individual' | 'barbershop',
) => {
  const supabase = createServerClient(cookies())

  const redirectUrl =
    userType === 'barbershop'
      ? `${process.env.SITE_URL}/barbershop-start`
      : `${process.env.SITE_URL}/`

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  if (error) {
    throw error
  }

  return null
}

export default resendEmail
