import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MdArrowBack } from 'react-icons/md'
import { useWizard } from 'react-use-wizard'

type Props = {
  selectedAddOnId: number | undefined
}

const AddOnInfoHeader = (props: Props) => {
  const { previousStep } = useWizard()
  const { selectedAddOnId } = props
  const { barbershopDetails } = useDashboardContext()
  const selectedAddOnDetails = barbershopDetails.addon_details.find(
    (addonDetail) => addonDetail.id === selectedAddOnId,
  )
  return (
    <DialogHeader className="space-y-3">
      <MdArrowBack
        onClick={previousStep}
        className="cursor-pointer"
        size={18}
      />
      <div className="space-y-1">
        <DialogTitle>{selectedAddOnDetails?.name ?? 'Add new add-on'}</DialogTitle>
        <DialogDescription className="w-3/4">
          Edit and/or view your cut details
        </DialogDescription>
      </div>
    </DialogHeader>
  )
}

export default AddOnInfoHeader
