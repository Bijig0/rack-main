import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWizard } from 'react-use-wizard'

type Props = {
  setSelectedAddOnId: (cutId: number | undefined) => void
}

const AddOnsListHeader = (props: Props) => {
  const { setSelectedAddOnId } = props
  const { goToStep } = useWizard()

  const handleClick = () => {
    setSelectedAddOnId(undefined)
    goToStep(1)
  }

  return (
    <DialogHeader>
      <DialogTitle>Edit Your Add-Ons</DialogTitle>
      <DialogDescription className="flex justify-between">
        <p className="w-3/4 ">Select your add-ons to view/edit!</p>
        <button onClick={handleClick} className="text-blue-400">
          Add an add-on +
        </button>
      </DialogDescription>
    </DialogHeader>
  )
}

export default AddOnsListHeader
