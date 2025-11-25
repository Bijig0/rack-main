'use server'

import { queryClient, userKeys } from '@/providers/ReactQueryProvider'
import { createServerClient } from '@/utils/supabase/supabase'
import { cookies } from 'next/headers'

const signOut = async () => {
  const supabase = createServerClient(cookies())
  await supabase.auth.signOut()
}

export default signOut
