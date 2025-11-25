import MobileAddOns from '@/app/barbershop-details/addons/MobileAddons'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'
import AddOnsEditModeDialog from '@/app/barbershop-details/addons/AddOnsEditModeDialog'

const DashboardMobileAddOns = () => {
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
      <MobileAddOns
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
      <AddOnsEditModeDialog
        isEditModeDialogOpen={isEditModeDialogOpen}
        closeEditModeDialog={closeEditModeDialog}
      />
    </section>
  )

  return
}

export default DashboardMobileAddOns
