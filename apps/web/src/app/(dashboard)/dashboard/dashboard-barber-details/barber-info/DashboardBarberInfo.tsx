import BarberInfo from '@/app/barbershop-details/barber-info/BarberInfo'
import BarbershopInfoEditModeDialog from '@/app/barbershop-details/barber-info/BarbershopInfoEditModeDialog'
import { TAPER_INSTAGRAM_URL } from '@/app/globals'
import InstagramIcon from '@/components/InstagramIcon'
import { CardTitle } from '@/components/ui/card'
import createInstagramlink from '@/utils/instagram/createInstagramLink'
import { cn } from '@/utils/tailwind'
import { CiGlobe } from 'react-icons/ci'
import { FaCircleUser, FaPerson } from 'react-icons/fa6'
import { MdLocationPin } from 'react-icons/md'
import { useBoolean } from 'usehooks-ts'
import { truncate } from '../../../../../utils/truncate'
import EditModeOverlay from '../../EditModeOverlay'
import { Button } from '../../SidebarButton'
import { useDashboardContext } from '../../barbershop-dashboard-context'

const DashboardBarberInfo = () => {
  const { isEditMode } = useDashboardContext()

  const {
    value: isEditModeDialogOpen,
    setFalse: closeEditModeDialog,
    setTrue: openEditModeDialog,
  } = useBoolean(false)

  const handleCardClickDuringEditMode = () => {
    console.log({ isEditMode })
    if (isEditMode) {
      console.log('opening')
      openEditModeDialog()
    }
  }

  const { barbershopDetails } = useDashboardContext()

  const { name: barbershopName, exact_address, booking_url } = barbershopDetails

  const instagramUrl = barbershopDetails.social_media?.handle
    ? createInstagramlink(barbershopDetails.social_media.handle)
    : TAPER_INSTAGRAM_URL

  const name = barbershopDetails.user_profile?.first_name
    ? `${barbershopDetails.user_profile.first_name} ${barbershopDetails.user_profile.last_name}`
    : null

  return (
    <section className="relative group">
      <BarberInfo
        title={() => (
          <CardTitle className="text-2xl font-bold">
            {barbershopName} Info
          </CardTitle>
        )}
        // name={() => (
        //   <div className="flex flex-col items-center gap-2 md:flex-row">
        //     <div className="flex items-center justify-start gap-1">
        //       <FaCircleUser className="w-4 h-4" />
        //       <a
        //         href={instagramUrl}
        //         target="_blank"
        //         className={cn(
        //           barbershopDetails.user_profile?.first_name
        //             ? ''
        //             : 'text-gray-400',
        //         )}
        //       >
        //         {name ?? 'John Doe'}
        //       </a>
        //     </div>
        //   </div>
        // )}
        instagramLink={() => (
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <div className="flex items-center justify-start gap-1">
              <InstagramIcon className="w-4 h-4" />
              <a
                href={instagramUrl}
                target="_blank"
                className={cn(
                  'underline',
                  barbershopDetails.social_media?.handle ? '' : 'text-gray-400',
                )}
              >
                {barbershopDetails.social_media?.handle ?? 'taperau'}
              </a>
            </div>
            {barbershopDetails.social_media?.follower_count && (
              <div className="flex items-center justify-start gap-1">
                <FaPerson className="w-4 h-4" />
                <p className="relative font-bold text-md">
                  {barbershopDetails.social_media?.follower_count} Followers
                </p>
              </div>
            )}
          </div>
        )}
        address={() => (
          <div className="flex items-center justify-start gap-1">
            <MdLocationPin />
            <p
              className={cn(
                '',
                barbershopDetails.exact_address ? 'underline' : 'text-gray-400',
              )}
            >
              {exact_address ?? 'CBD, Melbourne 3000'}
            </p>
          </div>
        )}
        bookingWebsite={() => (
          <div className="flex items-center justify-start gap-1">
            <CiGlobe />
            <a
              href={booking_url ?? TAPER_INSTAGRAM_URL}
              target="_blank"
              className={cn(
                'text-blue-400',
                barbershopDetails.booking_url ? 'underline' : 'text-gray-400',
              )}
            >
              {booking_url ? truncate(booking_url, 30) : 'www.bookingurl.com'}
            </a>
          </div>
        )}
        bookNowButton={() => (
          <a href={booking_url ?? '#'} target="_blank" rel="noreferrer">
            <Button
              disabled={!booking_url}
              className="font-bold text-white bg-purple-500 lg:mt-2"
            >
              Book Now
            </Button>
          </a>
        )}
        className={isEditMode ? 'edit-mode-scalable-component-styles' : ''}
      />
      <EditModeOverlay
        isEditMode={isEditMode}
        onClick={handleCardClickDuringEditMode}
      />
      <BarbershopInfoEditModeDialog
        closeEditModeDialog={closeEditModeDialog}
        isEditModeDialogOpen={isEditModeDialogOpen}
      />
    </section>
  )
}

export default DashboardBarberInfo
