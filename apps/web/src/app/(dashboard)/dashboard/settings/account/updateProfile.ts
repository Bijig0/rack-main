'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'
import { ProfileFormValues } from './account-form'

const updateProfile = async (data: ProfileFormValues) => {
  const supabase = createServerClient(cookies())
  console.log({ data })
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || user === null) throw userError

  const { error } = await supabase
    .from('user_profile')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
    })
    .eq('user_id', user.id)
  console.log({ error })
  return error
}

export default updateProfile
