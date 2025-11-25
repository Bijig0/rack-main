'use server'

import Urls from '@/app/urls/urls'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const resetEmail = async ({
  email,
  redirectUrl,
}: {
  email: string
  redirectUrl: string
}) => {
  const supabase = createServerClient(cookies())

  const { data, error } = await supabase.auth.updateUser(
    {
      email: email,
    },
    {
      emailRedirectTo: redirectUrl,
    },
  )

  console.log({ data, error })

  if (error) throw error
}

export default resetEmail
