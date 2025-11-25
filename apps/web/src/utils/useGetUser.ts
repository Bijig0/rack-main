import { useQuery } from '@tanstack/react-query'
import { createBrowserClient } from './supabase/browerClient'

const getUser = async () => {
  const supabase = createBrowserClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return {user, error}
}

const useGetUser = () => {
  return useQuery({
    queryFn: getUser,
    queryKey: ['user'],
    gcTime: Infinity
  })
}
export default useGetUser
