'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'
import { SignUpFormValues } from './SignUpForm'

const emailSignup = async (
  args: SignUpFormValues & { redirectUrl: string },
) => {
  const { email, password, userType } = args
  const supabase = createServerClient(cookies())

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: args.redirectUrl,
    },
  })

  if (error || user === null) throw error

  const { error: userProfileError } = await supabase
    .from('user_profile')
    .insert({
      user_id: user.id,
      account_type: userType,
    })
    .select('id')
    .single()

  if (userProfileError) throw userProfileError

}

export default emailSignup
