import { Tables } from '@/app/types/supabase'
import { createBrowserClient } from '@/utils/supabase/browerClient'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { getBarbershopDetails } from '../../../useGetBarbershopDetails'

type Addons = Pick<Tables<'addon_details'>, 'name' | 'price' | 'details'>
type Haircuts = Pick<Tables<'haircut_details'>, 'name' | 'price' | 'details'>

type Return = {
  addons: Addons[]
  haircuts: Haircuts[]
}

export const getServices = async (): Promise<Return> => {
  const supabase = createBrowserClient()

  const barbershopDetails = await getBarbershopDetails(supabase)

  if (!barbershopDetails) redirect('/')

  const barbershopId = barbershopDetails.id

  const { data: addons, error: addonsError } = await supabase
    .from('addon_details')
    .select('name, price, details')
    .eq('barbershop_details_id', barbershopId)

  if (addonsError) throw addonsError

  const { data: haircuts, error: haircutsError } = await supabase
    .from('haircut_details')
    .select('name, price, details')
    .eq('barbershop_details_id', barbershopId)

  if (haircutsError) throw haircutsError

  return {
    addons,
    haircuts,
  }
}

export const useGetServices = () => {
  const result = useQuery({
    queryFn: getServices,
    queryKey: ['services'],
  })

  return result
}
