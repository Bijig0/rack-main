import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/tailwind'
import { useWizard } from 'react-use-wizard'

type Props = {
  setSelectedAddOnId: (cutId: number) => void
}

const AddOnsList = (props: Props) => {
  const { setSelectedAddOnId } = props

  const { nextStep } = useWizard()

  const {
    barbershopDetails: { addon_details },
  } = useDashboardContext()

  if (addon_details.length === 0) {
    return (
      <p>
        No add-ons yet (e.g. beard, brows trim) :(
        <br />
        <button onClick={nextStep} className="text-blue-400">
          Add an add-on
        </button>
      </p>
    )
  }

  const handleViewMoreInfo = (cutId: number) => {
    setSelectedAddOnId(cutId)
    nextStep()
  }

  return (
    <div className="flex flex-col">
      {addon_details.map((addonDetail, index) => {
        return (
          <li
            onClick={() => handleViewMoreInfo(addonDetail.id)}
            className={cn(
              buttonVariants({
                variant: 'secondary',
                size: 'sm',
              }),
              'text-wrap flex h-12 justify-between gap-2 rounded-none px-6 hover:opacity-80',
            )}
          >
            <Label className="cursor-pointer" htmlFor={addonDetail.name}>
              {addonDetail.name}
            </Label>
            <Button className="text-xs font-medium text-black bg-transparent hover:bg-transparent hover:underline">
              View More Info
            </Button>
          </li>
        )
      })}
    </div>
  )
}

export default AddOnsList
