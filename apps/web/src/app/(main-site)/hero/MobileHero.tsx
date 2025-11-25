import Urls from '@/app/urls/urls'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { FaMap } from 'react-icons/fa'
import Search from './Search'

const MobileHero = () => {
  return (
    <section className="w-full px-4 mb-4 header-banner h-96">
      <div>
        <h1 className="text-5xl italic font-bold font-futura">
          Find your <br /> perfect barber
        </h1>
        <div className="my-6" />
        <div className="space-y-2">
          <Separator className="w-3/4" />
          <p className="w-3/4 font-normal font-primary text-md">
            <span className="font-semibold text-purple-500">
              Independent barbers
            </span>{' '}
            and{' '}
            <span className="font-semibold text-purple-500">
              established barbershops
            </span>{' '}
            all over Australia!
          </p>
          <Separator className="w-3/4" />
          <p className="font-normal font-primary text-md">
            Choose from over{' '}
            <span className="font-bold text-purple-500">50 + barbers!</span>
          </p>
        </div>
      </div>
      <div className="my-6" />

      <div className="flex flex-col items-center px-2 pt-2 pb-4 space-y-4 rounded-3xl bg-fuchsia-200">
        <Search />
        <div className="flex items-center w-full gap-4 justify-evenly">
          <Link href={Urls.barbershops('CBD, Melbourne')}>
            <div className="flex flex-col items-center justify-center space-y-1">
              <FaMap />
              <p className="text-xs font-semibold">CBD, Melbourne</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MobileHero
