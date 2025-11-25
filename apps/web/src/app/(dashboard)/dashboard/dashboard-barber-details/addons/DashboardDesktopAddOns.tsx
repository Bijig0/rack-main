import DesktopOtherCuts from '@/app/barbershop-details/other-cuts/DesktopOtherCuts'
import OtherCutsEditModeDialog from '@/app/barbershop-details/other-cuts/OtherCutsEditModeDialog'
import { cn } from '@/utils/tailwind'
import { useBoolean } from 'usehooks-ts'
import EditModeOverlay from '../../EditModeOverlay'
import { useDashboardContext } from '../../barbershop-dashboard-context'
import DesktopAddOns from '@/app/barbershop-details/addons/DesktopAddOns'
import AddOnsEditModeDialog from '@/app/barbershop-details/addons/AddOnsEditModeDialog'

const DashboardDesktopAddOns = () => {
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
      <DesktopAddOns
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
}

export default DashboardDesktopAddOns
