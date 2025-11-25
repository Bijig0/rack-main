'use client'
import LoadingSpinner from '@/components/ui/loading-spinner'
import useGetAddress from '@/utils/address/useGetAddress'
import { MdLocationPin } from 'react-icons/md'
import { useIsMounted } from 'usehooks-ts'

const Address = () => {
  const { data, isLoading, error } = useGetAddress()

  if (data) {
    console.log({ data })
    return (
      <div className="flex items-center justify-start gap-1">
        <MdLocationPin className="text-black" />
        <a className="text-sm underline">{data.formattedAddress}</a>
      </div>
    )
  }

  if (error) {
    console.log(error)
    // TODO report to sentry
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm">Unable to get location</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner className="w-4 h-4" />
      </div>
    )
  }
}

export default Address
