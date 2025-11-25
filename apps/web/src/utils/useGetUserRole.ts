import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { createBrowserClient } from './supabase/browerClient'

const useGetUserRole = () => {
  const getUserRole = async () => {
    const supabase = createBrowserClient()

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    if (getUserError || user === null) redirect('/login')

    const { data: userProfile, error: getUserProfileIdError } = await supabase
      .from('user_profile')
      .select('account_type')
      .eq('user_id', user.id)
      .single()

    console.log({ userProfile })

    if (getUserProfileIdError || userProfile === null)
      throw getUserProfileIdError

    const isBarbershopOwner = userProfile.account_type === 'barbershop'

    return isBarbershopOwner ? 'barbershop' : 'user'
  }

  const query = useQuery({
    queryKey: ['userRole'],
    queryFn: getUserRole,
  })

  return query
}

export default useGetUserRole
