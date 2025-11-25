'use client'
import Urls from '@/app/urls/urls'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/spinner'
import { assertGallery } from '@/utils/assertGallery'
import Link from 'next/link'
import { FaArrowRightLong } from 'react-icons/fa6'
import DashboardProvider from '../barbershop-dashboard-context'
import BarbershopDetails from '../details-page'
import useGetBarbershopDetails, {
  getBarbershopDetails,
} from '../useGetBarbershopDetails'
import EditModeButton from './EditModeButton'
import EmailResetForm from './settings/EmailResetForm'

export type RawBarbershopDetails = NonNullable<
  Awaited<ReturnType<typeof getBarbershopDetails>>
>

export default function Dashboard() {
  const {
    data: barbershopDetails,
    isLoading,
    error,
  } = useGetBarbershopDetails()

  if (barbershopDetails) {
    assertGallery(barbershopDetails)
    return (
      <DashboardProvider barbershopDetails={barbershopDetails}>
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Your Profile
          </h1>
          <div className="flex items-center gap-4">
            <FaArrowRightLong className="text-purple-600" size={64} />
            <div>
              <EditModeButton />
              <Link
                target="_blank"
                href={Urls.barbershopsDetail(barbershopDetails.name)}
                className="text-sm text-blue-400 hover:underline"
              >
                View My Profile
              </Link>
            </div>
          </div>
        </div>

        <EmailResetForm />

        <Separator className="mb-8 mt-4 w-3/4" />

        <BarbershopDetails />
      </DashboardProvider>
    )
  }

  if (error) throw error

  if (isLoading) return <LoadingSpinner className="mx-auto h-8 w-8" />
}
