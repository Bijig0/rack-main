import MobileOtherCuts from '@/app/barbershop-details/other-cuts/MobileOtherCuts'
import { useBoolean } from 'usehooks-ts'
import { useDashboardContext } from '../../barbershop-dashboard-context'
import OtherCutsEditModeDialog from '@/app/barbershop-details/other-cuts/OtherCutsEditModeDialog'
import { cn } from '@/utils/tailwind'
import EditModeOverlay from '../../EditModeOverlay'

const DashboardMobileOtherCuts = () => {
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
    <section className="relative group">
      <MobileOtherCuts
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

  return
}

export default DashboardMobileOtherCuts
