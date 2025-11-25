'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const deleteInstagramInfo = async (barbershopId: number) => {
  console.log({ barbershopId })
  const supabase = createServerClient(cookies())

  const { error } = await supabase
    .from('social_media')
    .update({
      barbershop_details_id: null,
    })
    .eq('barbershop_details_id', barbershopId)

  console.log({ error })

  if (error) throw error
}

export default deleteInstagramInfo
