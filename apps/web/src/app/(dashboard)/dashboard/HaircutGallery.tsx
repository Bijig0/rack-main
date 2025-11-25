import Media from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/utils/tailwind'
import { Suspense } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

type Props = {
  closeModal: () => void
  urls: string[]
  isOpen: boolean
  cutName: string
}

type CircleWithXProps = {
  className?: string
  onClick?: () => void
}
const CircleWithX = (props: CircleWithXProps) => {
  const { onClick, className } = props
  return (
    <button
      onClick={props.onClick}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-center shadow-xl',
        className,
      )}
    >
      <IoCloseOutline size={18} />
    </button>
  )
}

const HaircutGallery = (props: Props) => {
  const { isOpen, closeModal, urls, cutName } = props
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className="border-none bg-transparent sm:max-w-[800px]"
        hideCloseButton
      >
        <Carousel className="w-full">
          <CarouselContent>
            {urls.map((url, index) => (
              <CarouselItem key={index} className="relative">
                <div className="w-full">
                  <Suspense fallback={<Skeleton />}>
                    <Media src={url} alt="haircut" controls />
                  </Suspense>
                </div>
                <CircleWithX
                  onClick={closeModal}
                  className="absolute left-10 top-10"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-12px]" />
          <CarouselNext className="right-[-12px]" />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

export default HaircutGallery
