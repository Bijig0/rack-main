import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { cn } from '@/utils/tailwind'
import MobileOtherCutCard from './MobileOtherCutCard'

type Props = {
  className?: string
  barbershopDetails: BarbershopDetails
}

const MobileOtherCuts = (props: Props) => {
  const { className, barbershopDetails } = props
  const haircuts = barbershopDetails.haircut_details

  return (
    <section className={cn('space-y-2', className)}>
      <h2 className="text-2xl font-bold">Cuts And Prices</h2>
      <div className="my-2" />

      <div className="flex flex-nowrap items-center gap-2 overflow-scroll">
        {haircuts.map((haircut) => (
          <MobileOtherCutCard key={haircut.id} haircut={haircut} />
        ))}
      </div>
    </section>
  )
}

export default MobileOtherCuts
