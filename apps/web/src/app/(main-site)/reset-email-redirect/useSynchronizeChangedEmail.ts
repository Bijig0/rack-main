import { useQuery } from '@tanstack/react-query'
import synchronizeChangedEmail from './synchronizeChangedEmail'

type Args = {
    oldEmail: string
}

const useSynchronizeChangedEmail = ({ oldEmail}: Args) => {

  return useQuery({
    queryKey: ['synchronizeChangedEmail'],
    queryFn: () => synchronizeChangedEmail({ oldEmail}),
  })
}

export default useSynchronizeChangedEmail
