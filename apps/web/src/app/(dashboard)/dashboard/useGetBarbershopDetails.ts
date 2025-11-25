import Urls from '@/app/urls/urls'
import { barbershopsKeys } from '@/providers/ReactQueryProvider'
import getUserProfile from '@/utils/getUserProfile'
import { createBrowserClient } from '@/utils/supabase/browerClient'
import { SupabaseClient } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'

// addons_details(
//   name,
//   price,
//   details,
//   id,
//   addons_details_gallery(id, addons_details_gallery_image(image_url)),
// )

export const getBarbershopDetails = async (supabaseClient: SupabaseClient) => {
  let userProfile

  try {
    const _userProfile = await getUserProfile()
    userProfile = _userProfile
  } catch (error) {
    redirect('/')
  }

  let barbershopDetails

  const { data: _barbershopDetails, error: barbershopDetailsError } =
    await supabaseClient
      .from('barbershop_details')
      .select(
        'id, name, booking_url, about, exact_address, general_address, tagline, barbershop_gallery(main_image, sub_image_one, sub_image_two, sub_image_three), haircut_details (name, price, details, is_featured, id, haircut_details_gallery( id, haircut_details_gallery_image (image_url) )), social_media(handle, follower_count), user_profile(first_name, last_name), addon_details (name, price, details, id, addon_details_gallery( id, addon_details_gallery_image (image_url) ))',
      )
      .eq('user_profile_id', userProfile.id)
      .single()
  barbershopDetails = _barbershopDetails

  console.log({ barbershopDetails, barbershopDetailsError })

  if (barbershopDetailsError) throw redirect(Urls.barbershopStart)

  return barbershopDetails
}
const useGetBarbershopDetails = () => {
  const supabaseClient = createBrowserClient()

  return useQuery({
    queryKey: barbershopsKeys.admin(),
    queryFn: () => getBarbershopDetails(supabaseClient),
  })
}

export default useGetBarbershopDetails
