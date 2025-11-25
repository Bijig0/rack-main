'use client'
import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/utils/tailwind'
import AddOnCard from './AddOnCard'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

type Props = {
  className?: string
  barbershopDetails: BarbershopDetails
}

const DesktopAddOns = (props: Props) => {
  const { className, barbershopDetails } = props

  const addOns = barbershopDetails.addon_details

  console.log({ addOns })

  return (
    <div className={cn('space-y-2', className)}>
      <h2 className="text-2xl font-bold">Add Ons</h2>
      <div className="my-2" />
      <Carousel
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent className="flex items-center gap-2 overflow-scroll flex-nowrap">
          {addOns.map((addOn) => (
            <CarouselItem key={addOn.id} className="lg:basis-1/3">
              <AddOnCard
                addOnMainImage={() => {
                  const mainImageURL =
                    addOn.addon_details_gallery?.addon_details_gallery_image.at(
                      0,
                    )?.image_url
                  return mainImageURL ? (
                    <Avatar>
                      <AvatarImage
                        className="object-cover w-12 rounded-full"
                        src={mainImageURL}
                        alt="Featured Haircut"
                      />
                      <AvatarFallback className="text-gray-400">
                        FC
                      </AvatarFallback>
                    </Avatar>
                  ) : null
                }}
                addOn={addOn}
                className="min-w-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="left-[-12px]" /> */}
        <CarouselNext className="right-[-12px]" />
      </Carousel>
    </div>
  )
}

export default DesktopAddOns
