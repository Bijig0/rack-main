import BarbershopGallery from '@/app/barbershop-details/barbershop-gallery/BarbershopGallery'
import BarbershopGalleryEditModeDialog from '@/app/barbershop-details/barbershop-gallery/BarbershopGalleryEditModeDialog'
import BarbershopGalleryMainImage from '@/app/barbershop-details/barbershop-gallery/BarbershopGalleryMainImage'
import BarbershopGallerySubImage from '@/app/barbershop-details/barbershop-gallery/BarbershopGallerySubImage'
import { PLACEHOLDER_IMAGE_URL } from '@/app/globals'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'
import GalleryButton from '@/components/GalleryButton'

const DashboardBarbershopGallery = () => {
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

  const {
    barbershopDetails: {
      barbershop_gallery: {
        main_image,
        sub_image_one,
        sub_image_two,
        sub_image_three,
      },
    },
  } = useDashboardContext()

  return (
    <section className="relative mr-4 group">
      <BarbershopGallery
        galleryButton={() => {
          return (
            <GalleryButton
              srcs={
                [
                  main_image,
                  sub_image_one,
                  sub_image_two,
                  sub_image_three,
                ].filter(Boolean) as string[]
              }
              cutName={''}
              className="px-0 pb-2 text-base font-normal text-blue-400 bg-transparent cursor-pointer hover:un justify-self-start text-start hover:bg-transparent"
              text="View Gallery"
              type="button"
            />
          )
        }}
        mainImage={() => (
          <BarbershopGalleryMainImage
            src={main_image ?? PLACEHOLDER_IMAGE_URL}
          />
        )}
        subImageOne={() => (
          <BarbershopGallerySubImage
            src={sub_image_one ?? PLACEHOLDER_IMAGE_URL}
          />
        )}
        subImageTwo={() => (
          <BarbershopGallerySubImage
            src={sub_image_two ?? PLACEHOLDER_IMAGE_URL}
          />
        )}
        subImageThree={() => (
          <BarbershopGallerySubImage
            src={sub_image_three ?? PLACEHOLDER_IMAGE_URL}
          />
        )}
        className={
          isEditMode
            ? 'edit-mode-scalable-component-styles rounded-xl border p-4'
            : ''
        }
      />
      <EditModeOverlay
        isEditMode={isEditMode}
        onClick={handleCardClickDuringEditMode}
      />
      <BarbershopGalleryEditModeDialog
        isEditModeDialogOpen={isEditModeDialogOpen}
        closeEditModeDialog={closeEditModeDialog}
      />
    </section>
  )
}

export default DashboardBarbershopGallery
