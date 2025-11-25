'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

type Args = {
  oldEmail: string
}

const synchronizeChangedEmail = async ({ oldEmail }: Args) => {
  const supabase = createServerClient(cookies())
  console.log({ oldEmail })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log({ user, error })

  if (error || user === null) throw error

  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profile')
    .update({
      email: user.email,
    })
    .eq('email', oldEmail)
    .select('id')
    .single()

  console.log({ userProfile, userProfileError })

  if (userProfileError) throw userProfileError

  return userProfile
}

export default synchronizeChangedEmail
