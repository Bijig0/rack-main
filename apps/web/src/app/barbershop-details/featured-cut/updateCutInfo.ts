'use server'

import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'
const updateCutInfo = async (
  haircutDetailsId: number,
  cutName: string,
  cutPrice: number,
  cutDetails: string,
) => {
  const supabase = createServerClient(cookies())

  const { data: haircutDetails, error: haircutDetailsError } = await supabase
    .from('haircut_details')
    .update({
      name: cutName,
      price: cutPrice,
      details: cutDetails,
    })
    .eq('id', haircutDetailsId)
    .select('id')
    .single()

  console.log({ haircutDetails, haircutDetailsError })

  if (haircutDetailsError) throw haircutDetailsError

  const { data: haircutDetailsGallery, error: haircutDetailsGalleryError } =
    await supabase
      .from('haircut_details_gallery')
      .select('id')
      .eq('haircut_details_id', haircutDetails.id)
      .single()

  if (haircutDetailsGalleryError) throw haircutDetailsGalleryError

  return haircutDetailsGallery
}

export default updateCutInfo
