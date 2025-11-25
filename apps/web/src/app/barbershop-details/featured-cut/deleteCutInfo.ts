'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const deleteCutInfo = async (cutId: number) => {
  const supabase = createServerClient(cookies())

  console.log({ cutId })

  const { data: haircutDetails, error: haircutDetailsError } = await supabase
    .from('haircut_details')
    .delete()
    .eq('id', cutId)

  if (haircutDetailsError) throw haircutDetailsError

  return haircutDetails
}

export default deleteCutInfo
