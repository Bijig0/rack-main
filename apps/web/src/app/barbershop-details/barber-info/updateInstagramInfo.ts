'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

type Args = {
  handle: string
  followerCount: number
  barbershopId: number
  password: string
}

const updateInstagramInfo = async (values: Args) => {
  const { barbershopId, followerCount, handle, password } = values

  const supabase = createServerClient(cookies())
  const { error } = await supabase.from('social_media').upsert(
    {
      follower_count: followerCount,
      handle: handle,
      password: password,
      barbershop_details_id: barbershopId,
    },
    {
      onConflict: 'handle',
      ignoreDuplicates: false,
    },
  )

  if (error) throw error
}

export default updateInstagramInfo
