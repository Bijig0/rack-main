import FeaturedCut from '@/app/barbershop-details/featured-cut/FeaturedCut'
import FeaturedCutEditModeDialog from '@/app/barbershop-details/featured-cut/FeaturedCutEditModeDialog'
import GalleryButton from '@/app/barbershop-details/featured-cut/GalleryButton'
import { CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'

const DashboardFeaturedCut = () => {
  const { isEditMode, barbershopDetails } = useDashboardContext()
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

  const featuredCut = barbershopDetails.haircut_details.find(
    (haircut_detail) => haircut_detail.is_featured,
  )

  const galleryImages =
    featuredCut?.haircut_details_gallery?.haircut_details_gallery_image.map(
      (image) => image.image_url,
    ) ?? []

  return (
    <section
      className={cn('group relative relative overflow-visible rounded-xl')}
    >
      <FeaturedCut
        name={() => (
          <CardTitle
            className={cn(
              'text-2xl font-bold',
              !featuredCut?.name && 'text-gray-400',
            )}
          >
            Featured Cut
          </CardTitle>
        )}
        cutName={() => (
          <p
            className={cn(
              'text-md font-medium',
              !featuredCut?.name && 'text-gray-400',
            )}
          >
            {featuredCut?.name ?? 'Featured Cut Name'}
          </p>
        )}
        cutPrice={() => (
          <p
            className={cn(
              'text-xs text-muted-foreground',
              !featuredCut?.price && 'text-gray-400',
            )}
          >
            {`$${featuredCut?.price ?? 'Featured Cut Price'}`}
            <span className="cursor-pointer text-blue-400"></span>
          </p>
        )}
        // @ts-ignore

        cutMainimage={galleryImages[0]}
        // @ts-ignore

        galleryImages={galleryImages}
        galleryButton={() => (
          <GalleryButton
            disabled={!featuredCut?.name}
            // @ts-ignore

            srcs={galleryImages}
            cutName={featuredCut?.name ?? 'Featured Cut Name'}
          />
        )}
        className={isEditMode ? 'edit-mode-scalable-component-styles' : ''}
      />
      <EditModeOverlay
        onClick={handleCardClickDuringEditMode}
        isEditMode={isEditMode}
      />
      <FeaturedCutEditModeDialog
        isEditModeDialogOpen={isEditModeDialogOpen}
        closeEditModeDialog={closeEditModeDialog}
      />
    </section>
  )
}

export default DashboardFeaturedCut
