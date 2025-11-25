import { Separator } from '@/components/ui/separator'
import { MdOutlineStar } from 'react-icons/md'
import Address from './Address'
import BarbersList from './BarbersList'
import FilterButton from './FilterButton'

const BarbersListSection = () => {
  return (
    <section
      style={{ maxWidth: '1280px' }}
      className="w-full px-4 mx-auto space-y-4 lg:px-32"
    >
      <p className="text-base font-futura text-md">
        <span className="font-bold text-purple-500">50 + </span>{' '}
        <strong>independent barbers</strong> and{' '}
        <strong>established barbershops</strong>
      </p>
      <div className="flex">
        <MdOutlineStar size={18} className="text-purple-500" />
        <MdOutlineStar size={18} className="text-purple-500" />
        <MdOutlineStar size={18} className="text-purple-500" />
        <MdOutlineStar size={18} className="text-purple-500" />
        <MdOutlineStar size={18} className="text-purple-500" />
      </div>
      <h2 className="text-3xl font-bold font-futura">Our Barbers</h2>

      <div className="flex justify-start gap-2">
        <Address />
        <FilterButton />
      </div>
      <BarbersList />
      <Separator className="w-3/4 my-4 font-bold" />
    </section>
  )
}

export default BarbersListSection
