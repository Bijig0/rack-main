'use client'
import { BarbershopDetails } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/utils/tailwind'
import OtherCutCard from './OtherCutCard'

type Props = {
  className?: string
  barbershopDetails: BarbershopDetails
}

const DesktopOtherCuts = (props: Props) => {
  const { className, barbershopDetails } = props

  const haircuts = barbershopDetails.haircut_details

  console.log({ haircuts })

  return (
    <div className={cn('space-y-2', className)}>
      <h2 className="text-2xl font-bold">Cuts And Prices</h2>
      <div className="my-2" />
      <Carousel
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent className="flex items-center gap-2 overflow-scroll flex-nowrap">
          {haircuts.map((haircut) => (
            <>
              <CarouselItem key={haircut.id} className="lg:basis-1/3">
                <OtherCutCard
                  cutMainImage={() => {
                    const mainImageURL =
                      haircut.haircut_details_gallery?.haircut_details_gallery_image.at(
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
                  haircut={haircut}
                  className="min-w-auto"
                />
              </CarouselItem>
            </>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute left-[-12px] z-50" /> */}
        <CarouselNext className="right-[-12px] z-50" />
      </Carousel>
    </div>
  )
}

export default DesktopOtherCuts
