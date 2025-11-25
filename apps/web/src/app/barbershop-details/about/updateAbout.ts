'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const updateAbout = async (about: string, barbershopId: number) => {
  const supabase = createServerClient(cookies())
  
  const { data, error } = await supabase
    .from('barbershop_details')
    .update({
      about,
    })
    .eq('id', barbershopId)
  if (error) throw error
  return data
}

export default updateAbout
