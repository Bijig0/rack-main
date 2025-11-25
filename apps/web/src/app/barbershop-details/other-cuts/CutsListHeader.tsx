import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWizard } from 'react-use-wizard'

type Props = {
  setSelectedCutId: (cutId: number | undefined) => void
}

const CutsListHeader = (props: Props) => {
  const { setSelectedCutId } = props
  const { goToStep } = useWizard()

  const handleClick = () => {
    setSelectedCutId(undefined)
    goToStep(1)
  }

  return (
    <DialogHeader>
      <DialogTitle>Edit Your Cuts</DialogTitle>
      <DialogDescription className="flex justify-between">
        <p className="w-3/4 ">Select your cuts to view/edit!</p>
        <button onClick={handleClick} className="text-blue-400">
          Add a cut +
        </button>
      </DialogDescription>
    </DialogHeader>
  )
}

export default CutsListHeader
