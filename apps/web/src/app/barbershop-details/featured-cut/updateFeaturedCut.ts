'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const updateFeaturedCut = async (barbershopId: number, cutName: string) => {
  const supabase = createServerClient(cookies())

  const { data, error } = await supabase.rpc('set_featured_haircut', {
    barbershop_details_id: barbershopId,
    cut_name: cutName,
  })

  if (error) throw error

  return data
}

export default updateFeaturedCut
