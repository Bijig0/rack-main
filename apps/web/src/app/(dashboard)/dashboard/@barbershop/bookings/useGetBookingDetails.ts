'server-only'

import { createBrowserClient } from '@/utils/supabase/browerClient'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { getBarbershopDetails } from '../../useGetBarbershopDetails'

export const getBookingDetails = async () => {
  const supabase = createBrowserClient()
  const barbershopDetails = await getBarbershopDetails(supabase)

  if (!barbershopDetails) redirect('/')

  const barbershopId = barbershopDetails.id

  const { data: barbershopBookings, error: barbershopBookingsError } =
    await supabase
      .from('barbershop_booking')
      .select('status, addon_details (name), haircut_details (name)')
      .eq('barbershop', barbershopId)

  if (barbershopBookingsError) throw barbershopBookingsError

  return barbershopBookings
}

export const useGetBookingDetails = () => {
  const result = useQuery({
    queryFn: getBookingDetails,
    queryKey: ['bookingDetails'],
  })

  return result
}
