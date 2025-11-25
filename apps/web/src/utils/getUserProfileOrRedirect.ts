'use server'

import { redirect } from 'next/navigation'
import getUserProfile from './getUserProfile'

const getUserProfileOrRedirect = async () => {
  let userProfile: Awaited<ReturnType<typeof getUserProfile>>
  try {
    const _userProfile = await getUserProfile()
    userProfile = _userProfile
  } catch (error) {
    console.error(error)
    redirect('/login')
  }
  return userProfile
}

export default getUserProfileOrRedirect
