'use server'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const getGalleryImages = async (barbershopId: number) => {
  const supabase = createServerClient(cookies())

  const createGalleryPath = () => {
    return `${barbershopId}/gallery/`
  }

  const images = supabase.storage.from('barbershop').download('')
}

export default getGalleryImages
