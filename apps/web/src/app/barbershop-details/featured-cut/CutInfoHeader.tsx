import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MdArrowBack } from 'react-icons/md'
import { useWizard } from 'react-use-wizard'

type Props = {
  selectedCutId: number | undefined
}

const CutInfoHeader = (props: Props) => {
  const { previousStep } = useWizard()
  const { selectedCutId } = props
  const { barbershopDetails } = useDashboardContext()
  const selectedCutDetails = barbershopDetails.haircut_details.find(
    (haircutDetail) => haircutDetail.id === selectedCutId,
  )
  return (
    <DialogHeader className="space-y-3">
      <MdArrowBack
        onClick={previousStep}
        className="cursor-pointer"
        size={18}
      />
      <div className="space-y-1">
        <DialogTitle>{selectedCutDetails?.name ?? 'Add new cut'}</DialogTitle>
        <DialogDescription className="w-3/4">
          Edit and/or view your cut details
        </DialogDescription>
      </div>
    </DialogHeader>
  )
}

export default CutInfoHeader
