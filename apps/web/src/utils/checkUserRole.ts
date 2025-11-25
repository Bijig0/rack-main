'use server'
import getUserProfile from './getUserProfile'

type Role = 'barbershop' | 'user'

const checkUserRole = async (): Promise<Role> => {
  const userProfile = await getUserProfile()

  const isBarbershopOwner = userProfile?.account_type === 'barbershop'

  return isBarbershopOwner ? 'barbershop' : 'user'
}

export default checkUserRole
