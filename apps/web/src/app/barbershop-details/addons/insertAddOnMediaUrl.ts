'use server'

import { createBarbershopStoragePath } from '@/app/globals'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const insertAddOnMediaUrl = async (
  addonDetailsGalleryId: number,
  paths: string[],
  order: number,
) => {
  const basePath = createBarbershopStoragePath()

  const imgUrl = paths[0]
  const fullPath = `${basePath}/${imgUrl}`

  const supabase = createServerClient(cookies())
  const { data, error } = await supabase
    .from('addon_details_gallery_image')
    .insert({
      image_url: fullPath,
      addon_details_gallery_id: addonDetailsGalleryId,
      order: order,
    })

  if (error) throw error

  return data
}

export default insertAddOnMediaUrl
