'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import withSentry from '@/utils/withSentry'
import { cookies } from 'next/headers'

const updateBarbershopInfo = async (values: any) => {
  const { barbershopId, ...toUpdateValues } = values
  const supabase = createServerClient(cookies())
  const { data, error } = await supabase
    .from('barbershop_details')
    .update(toUpdateValues)
    .eq('id', barbershopId)
  if (error) throw error
  return data
}

export default withSentry(updateBarbershopInfo)
