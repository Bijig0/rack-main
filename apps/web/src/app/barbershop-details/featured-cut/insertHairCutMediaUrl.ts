'use server'

import { createBarbershopStoragePath } from '@/app/globals'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const insertHairCutMediaUrl = async (
  haircutDetailsGalleryId: number,
  paths: string[],
  order: number,
) => {
  const basePath = createBarbershopStoragePath()

  const imgUrl = paths[0]
  const fullPath = `${basePath}/${imgUrl}`

  const supabase = createServerClient(cookies())
  const { data, error } = await supabase
    .from('haircut_details_gallery_image')
    .insert({
      image_url: fullPath,
      haircut_details_gallery_id: haircutDetailsGalleryId,
      order: order,
    })

  if (error) throw error

  return data
}

export default insertHairCutMediaUrl
