import BarbershopInfoEditModeDialog from '@/app/barbershop-details/about/AboutEditModeDialog'
import About from '@/app/barbershop-details/about/about'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.'

const DashboardAbout = () => {
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

  return (
    <section className="group relative">
      <About
        textToShow={barbershopDetails?.about ?? LOREM_IPSUM}
        className={cn(
          isEditMode &&
            'edit-mode-scalable-component-styles rounded-xl border p-4',
          !barbershopDetails?.about && 'text-gray-400',
        )}
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

export default DashboardAbout
