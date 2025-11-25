'server-only'
'use server'
import { cookies } from 'next/headers'
import { createServerClient } from './supabase/supabase'

const getUserProfile = async () => {
  const supabase = createServerClient(cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  console.log({ user, error })
  if (error || user === null) throw error
  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', user.id)
    .single()

  console.log({ userProfile, userProfileError })

  if (userProfileError || userProfile === null) throw userProfileError

  return { ...user, ...userProfile }
}

export default getUserProfile
