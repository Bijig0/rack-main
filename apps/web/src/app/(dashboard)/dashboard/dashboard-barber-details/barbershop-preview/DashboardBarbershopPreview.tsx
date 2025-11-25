import BarbershopDisplayName from '@/app/barbershop-details/barbershop-preview/BarbershopDisplayName'
import BarbershopPreview from '@/app/barbershop-details/barbershop-preview/BarbershopPreview'
import BarbershopPreviewAddress from '@/app/barbershop-details/barbershop-preview/BarbershopPreviewAddress'
import BarbershopPreviewEditModeDialog from '@/app/barbershop-details/barbershop-preview/BarbershopPreviewEditModeDialog'
import BarbershopPreviewInstagram from '@/app/barbershop-details/barbershop-preview/BarbershopPreviewInstagram'
import BarbershopTagline from '@/app/barbershop-details/barbershop-preview/BarbershopTagline'
import { TAPER_INSTAGRAM_URL } from '@/app/globals'
import createInstagramlink from '@/utils/instagram/createInstagramLink'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'

const DashboardBarbershopPreview = () => {
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

  const instagramUrl = barbershopDetails.social_media?.handle
    ? createInstagramlink(barbershopDetails.social_media.handle)
    : TAPER_INSTAGRAM_URL

  return (
    <section className="relative space-y-1 group">
      <BarbershopPreview
        barbershopDisplayName={() => (
          <BarbershopDisplayName
            // Put in conditional, so if there is indeed data then no need to put opaque styles
            className={!barbershopDetails.name ? 'underline opacity-40' : ''}
          >
            {barbershopDetails.name ?? 'Barbershop Name'}
          </BarbershopDisplayName>
        )}
        barbershopTagline={() => (
          <BarbershopTagline
            className={!barbershopDetails.tagline ? 'underline opacity-40' : ''}
          >
            {barbershopDetails.tagline ??
              'Barbershop tagline, i.e specialized in low-down tapers'}
          </BarbershopTagline>
        )}
        barbershopStars={() => {
          return null
          // <BarbershopPreviewStars />
        }}
        barbershopInstagram={() => (
          <BarbershopPreviewInstagram
            className={
              !barbershopDetails.social_media?.handle
                ? 'underline opacity-40'
                : ''
            }
          >
            <a
              target="_blank"
              href={instagramUrl}
              className={cn(
                barbershopDetails.social_media?.handle && 'underline',
              )}
            >
              {barbershopDetails.social_media?.handle ?? 'taperau'}
            </a>
          </BarbershopPreviewInstagram>
        )}
        barbershopAddress={() => (
          <BarbershopPreviewAddress
            className={
              !barbershopDetails.exact_address ? 'underline opacity-40' : ''
            }
          >
            {barbershopDetails.exact_address ?? 'Barbershop address'}
          </BarbershopPreviewAddress>
        )}
        className={
          isEditMode
            ? 'edit-mode-scalable-component-styles mr-4 rounded-xl border p-4'
            : ''
        }
      />
      <EditModeOverlay
        onClick={handleCardClickDuringEditMode}
        isEditMode={isEditMode}
        classNames="mr-4"
      />
      <BarbershopPreviewEditModeDialog
        isEditModeDialogOpen={isEditModeDialogOpen}
        closeEditModeDialog={closeEditModeDialog}
      />
    </section>
  )
}

export default DashboardBarbershopPreview
