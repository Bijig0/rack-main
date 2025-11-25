import { createBrowserClient } from '@/utils/supabase/browerClient'
import { useQuery } from '@tanstack/react-query'

const useGetUserDetails = () => {
  const getUserDetails = async () => {
    const supabase = createBrowserClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || user === null) throw userError

    const { data: userProfile, error: userProfileError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (userProfileError || userProfile === null) throw userProfileError

    return { ...user, ...userProfile }
  }

  const query = useQuery({
    queryKey: ['user'],
    queryFn: getUserDetails,
  })

  return query
}

export default useGetUserDetails
