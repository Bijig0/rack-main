import DesktopOtherCuts from '@/app/barbershop-details/other-cuts/DesktopOtherCuts'
import OtherCutsEditModeDialog from '@/app/barbershop-details/other-cuts/OtherCutsEditModeDialog'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'

const DashboardDesktopOtherCuts = () => {
  const { isEditMode, barbershopDetails } = useDashboardContext()

  const handleCardClickDuringEditMode = () => {
    console.log({ isEditMode })
    if (isEditMode) {
      console.log('opening')
      openEditModeDialog()
    }
  }

  const {
    value: isEditModeDialogOpen,
    setFalse: closeEditModeDialog,
    setTrue: openEditModeDialog,
  } = useBoolean(false)

  return (
    <section className="group relative">
      <DesktopOtherCuts
        barbershopDetails={barbershopDetails}
        className={cn(
          isEditMode &&
            'edit-mode-scalable-component-styles rounded-xl border p-4',
          !barbershopDetails.haircut_details.length && 'text-gray-400',
        )}
      />
      <EditModeOverlay
        onClick={handleCardClickDuringEditMode}
        isEditMode={isEditMode}
      />
      <OtherCutsEditModeDialog
        isEditModeDialogOpen={isEditModeDialogOpen}
        closeEditModeDialog={closeEditModeDialog}
      />
    </section>
  )
}

export default DashboardDesktopOtherCuts
