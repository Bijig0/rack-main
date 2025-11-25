'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { GalleryImageType } from './BarbershopGalleryEditModeDialogBody'
import { cookies } from 'next/headers'

const removeGalleryImages = async (
  galleryImageTypes: GalleryImageType[],
  barbershopId: number,
) => {
  const supabase = createServerClient(cookies())

  const nulledGalleryImageTypes = Object.fromEntries(
    galleryImageTypes.map((imageType) => [imageType, null]),
  )

  const { data, error } = await supabase
    .from('barbershop_gallery')
    .update(nulledGalleryImageTypes)
    .eq('barbershop_details_id', barbershopId)

  if (error) throw error

  return data
}

export default removeGalleryImages
