import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { cn } from '@/utils/tailwind'
import MobileAddOnCard from './MobileAddOnCard'

type Props = {
  className?: string
  barbershopDetails: BarbershopDetails
}

const MobileAddOns = (props: Props) => {
  const { className, barbershopDetails } = props
  const addOns = barbershopDetails.addon_details

  return (
    <section className={cn('space-y-2', className)}>
      <h2 className="text-2xl font-bold">Add Ons</h2>
      <div className="my-2" />

      <div className="flex flex-nowrap items-center gap-2 overflow-scroll">
        {addOns.map((addOn) => (
          <MobileAddOnCard key={addOn.name} addOn={addOn} />
        ))}
      </div>
    </section>
  )
}

export default MobileAddOns
