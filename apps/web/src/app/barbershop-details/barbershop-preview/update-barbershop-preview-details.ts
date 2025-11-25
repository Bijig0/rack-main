'use server'

import getUserProfileOrRedirect from '@/utils/getUserProfileOrRedirect'
import { createServerClient } from '@/utils/supabase/supabase'
import { BarbershopPreviewFormValues } from './BarbershopPreviewBody'
import { cookies } from 'next/headers'

const updateBarbershopPreviewDetails = async (
  data: any,
) => {
  const supabase = createServerClient(cookies())

  const userProfile = await getUserProfileOrRedirect()

  const { error } = await supabase
    .from('barbershop_details')
    .update(data)
    .eq('user_profile_id', userProfile.id)

  if (error) throw error
}

export default updateBarbershopPreviewDetails
