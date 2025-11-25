import { cn } from '@/utils/tailwind'
import React from 'react'

type Props = {
  mainImage: () => React.ReactNode
  subImageOne: () => React.ReactNode
  subImageTwo: () => React.ReactNode
  subImageThree: () => React.ReactNode
  galleryButton: () => React.ReactNode
  className?: string
}

const BarbershopGallery = (props: Props) => {
  const {
    className,
    mainImage,
    subImageOne,
    subImageTwo,
    subImageThree,
    galleryButton,
  } = props

  return (
    <div>
      {galleryButton()}
      <div
        className={cn(
          'flex flex-col lg:h-full lg:w-full lg:flex-row lg:gap-2',
          className,
        )}
      >
        {mainImage()}
        <div className="flex gap-3 mt-4 lg:items-evenly mg:mt-8 lg:mt-0 lg:flex-1 lg:flex-col">
          {subImageOne()}
          {subImageTwo()}
          {subImageThree()}
        </div>
        {/* <HaircutGallery /> */}
      </div>
    </div>
  )
}

export default BarbershopGallery
