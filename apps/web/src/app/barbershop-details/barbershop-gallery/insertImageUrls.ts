'use server'

import { createBarbershopStoragePath } from '@/app/globals'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'
import { GalleryImageType } from './BarbershopGalleryEditModeDialogBody'

// OK FOR NOW, PATHS IS ONLY GOING TO UPLOAD ONE IMAGE AT A TIME, MAKE IT IN THE FUTURE MULTI-IMAGES
// PROBLEM IS I CAN'T THINK OF THE LOGIC OF DETERMINING IF IMAGE SHOULD BE SUB IMAGE/MAIN IAMGE OR ADDITIONAL
// BASED ON THE INDICES OF THE ORIGINAL DATA YET

const insertImageUrls = async (
  barbershopId: number,
  paths: string[],
  imageType: GalleryImageType,
) => {
  // TEMPORARY

  const basePath = createBarbershopStoragePath()
  const imgUrl = paths[0]
  const fullPath = `${basePath}/${imgUrl}`

  const supabase = createServerClient(cookies())
  const { data, error } = await supabase
    .from('barbershop_gallery')
    .update({
      [imageType]: fullPath,
    })
    .eq('barbershop_details_id', barbershopId)

  if (error) throw error

  return data
}

export default insertImageUrls
