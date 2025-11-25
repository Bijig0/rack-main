'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'
const updateAddOnInfo = async (
  addOnDetailsId: number,
  addOnName: string,
  addOnPrice: number,
  addOnDetails: string,
) => {
  const supabase = createServerClient(cookies())

  const { data: addOnDetailsData, error: addOnDetailsError } = await supabase
    .from('haircut_details')
    .update({
      name: addOnName,
      price: addOnPrice,
      details: addOnDetails,
    })
    .eq('id', addOnDetailsId)
    .select('id')
    .single()

  console.log({ addOnDetailsData, addOnDetailsError })

  if (addOnDetailsError) throw addOnDetailsError

  const { data: addOnDetailsGallery, error: addOnDetailsGalleryError } =
    await supabase
      .from('addon_details_gallery')
      .select('id')
      .eq('addon_details_id', addOnDetailsData.id)
      .single()

  if (addOnDetailsGalleryError) throw addOnDetailsGalleryError

  return addOnDetailsGallery
}

export default updateAddOnInfo
