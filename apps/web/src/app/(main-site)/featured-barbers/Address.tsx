'use client'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { MdLocationPin } from 'react-icons/md'
import { useIsMounted } from 'usehooks-ts'
import useGetAddress from '../../../utils/address/useGetAddress'

const Address = () => {
  const { data, isLoading, error } = useGetAddress()
  const isMounted = useIsMounted()

  if (!isMounted()) return null

  if (data) {
    return (
      <div className="flex items-center justify-start gap-1">
        <MdLocationPin className="text-red-600" />
        <a className="text-sm underline">{data.formattedAddress}</a>
      </div>
    )
  }

  if (error) {
    // TODO report to sentry
    return (
      <div className="flex items-center justify-start">
        <p className="text-sm">Unable to get location</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-start">
        <LoadingSpinner className="h-4 w-4" />
      </div>
    )
  }
}

export default Address
