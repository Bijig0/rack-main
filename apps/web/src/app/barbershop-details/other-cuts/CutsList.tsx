import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/tailwind'
import { useWizard } from 'react-use-wizard'

type Props = {
  setSelectedCutId: (cutId: number) => void
}

const CutsList = (props: Props) => {
  const { setSelectedCutId } = props

  const { nextStep } = useWizard()

  const {
    barbershopDetails: { haircut_details },
  } = useDashboardContext()

  if (haircut_details.length === 0) {
    return (
      <p>
        No haircuts yet :(
        <br />
        <button onClick={nextStep} className="text-blue-400">
          Add a haircut
        </button>
      </p>
    )
  }

  const handleViewMoreInfo = (cutId: number) => {
    setSelectedCutId(cutId)
    nextStep()
  }

  return (
    <div className="flex flex-col">
      {haircut_details.map((haircut_detail, index) => {
        return (
          <li
            onClick={() => handleViewMoreInfo(haircut_detail.id)}
            className={cn(
              buttonVariants({
                variant: 'secondary',
                size: 'sm',
              }),
              'text-wrap flex h-12 justify-between gap-2 rounded-none px-6 hover:opacity-80',
            )}
          >
            <Label className="cursor-pointer" htmlFor={haircut_detail.name}>
              {haircut_detail.name}
            </Label>
            <Button className="bg-transparent text-xs font-medium text-black hover:bg-transparent hover:underline">
              View More Info
            </Button>
          </li>
        )
      })}
    </div>
  )
}

export default CutsList
