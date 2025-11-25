'use client'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/utils/tailwind'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { FaGoogle } from 'react-icons/fa'
import { MdOutlineStar } from 'react-icons/md'

type Props = {
  className?: string
}
const Reviews = (props: Props) => {
  const { className } = props
  return (
    <div id="reviews" className={cn(className)}>
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="my-2" />
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <div>
                <Card className="overflow-visible">
                  <CardContent className="items-center justify-between block pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            className="w-12 rounded-full"
                            src="https://lh3.googleusercontent.com/xyIy1zmezjQRHPSxB_MwfILYOCoZtFg8wXGkV-7fVbe-BGuYG92IHV-FufzC8kw8ZBmDfTitzwGxwEKId44u2CGRNqRi6a9bYnoQh-25y7T4wSV2=s100"
                            alt="Featured Haircut"
                          />
                          <AvatarFallback>HC</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-md">Joel Moore</p>
                      </div>
                      <FaGoogle />
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Integer nec odio. Praesent libero.
                    </p>
                    <div className="flex">
                      <MdOutlineStar />
                      <MdOutlineStar />
                      <MdOutlineStar />
                      <MdOutlineStar />
                      <MdOutlineStar />
                    </div>
                    <p className="text-sm">27/05/20204</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-12px]" />
        <CarouselNext className="right-[-12px]" />
      </Carousel>
    </div>
  )
}

export default Reviews
