'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const deleteAddOnInfo = async (addOnId: number) => {
  const supabase = createServerClient(cookies())

  console.log({ addOnId })

  const { data: addOnDetails, error: addOnDetailsError } = await supabase
    .from('addon_details')
    .delete()
    .eq('id', addOnId)

  if (addOnDetailsError) throw addOnDetailsError

  return addOnDetails
}

export default deleteAddOnInfo
