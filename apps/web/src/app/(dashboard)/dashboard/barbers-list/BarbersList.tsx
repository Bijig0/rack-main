'use client'
import useGetBarbershops from '@/app/(main-site)/barbershops/useGetBarbershops'
import useGetLatLong from '@/app/(main-site)/barbershops/useGetLatLong'
import BarberCard from '@/components/BarberCard/BarberCard'
import { Card, CardContent } from '@/components/ui/card'
import useGetAddress from '@/utils/address/useGetAddress'
import { cn } from '@/utils/tailwind'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const LoadingSkeleton = () => (
  <Card className={cn('shrink-0 basis-2/3 rounded-xl border-none py-2')}>
    <CardContent className="p-0">
      <Skeleton className="w-full h-56 rounded-xl" />
      <Skeleton className="w-full h-12 rounded-xl" />
    </CardContent>
  </Card>
)

const BarbersList = () => {
  const {
    data,
    isLoading: isLoadingAddress,
    error: addressError,
  } = useGetAddress()

  console.log(Boolean(data))

  const {
    data: latLong,
    error: latLongError,
    isLoading: isLatLongLoading,
  } = useGetLatLong(data?.formattedAddress!, Boolean(data))

  console.log({ latLong })

  const {
    data: barbershopsDetails,
    isLoading: isBarbershopsLoading,
    error: barbershopsError,
  } = useGetBarbershops({
    latitude: latLong?.latitude,
    longitude: latLong?.longitude,
    enabled: Boolean(latLong),
    limit: 9,
  })

  const isLoading = isLoadingAddress || isLatLongLoading || isBarbershopsLoading

  const error = addressError || latLongError || barbershopsError

  if (barbershopsDetails) {
    return (
      <div className="grid gap-y-8 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-8 lg:space-y-0">
        {barbershopsDetails.map((barbershopDetails, index) => {
          return (
            <BarberCard index={index} barbershopDetails={barbershopDetails} isHoverable />
          )
        })}
      </div>
    )
  }

  if (isLoading)
    return (
      <div className="space-y-2 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-8 lg:space-y-0">
        {[0, 1, 2].map((index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    )

  if (error) throw error
}

export default BarbersList
