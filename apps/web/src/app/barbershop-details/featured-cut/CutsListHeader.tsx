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
      <DialogTitle>Select Featured Cut</DialogTitle>
      <DialogDescription className="flex justify-between">
        <p className="w-3/4 ">Select your cut to be featured</p>
        <button onClick={handleClick} className="text-blue-400">
          Add a cut +
        </button>
      </DialogDescription>
    </DialogHeader>
  )
}

export default CutsListHeader
