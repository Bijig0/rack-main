'use client'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useGetServices } from './useGetServices'

const page = () => {
  const { data: services, isLoading, error } = useGetServices()

  if (services) {
    const { addons, haircuts } = services
    return (
      <div>
        <div>
          Addons
          {addons.map((addon) => {
            return <p>{JSON.stringify(addon)}</p>
          })}
        </div>
        <div>
          Haircuts
          {haircuts.map((haircut) => {
            return <p>{JSON.stringify(haircut)}</p>
          })}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  throw error
}

export default page
