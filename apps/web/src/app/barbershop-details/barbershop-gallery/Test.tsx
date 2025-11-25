import GalleryButton from '@/components/GalleryButton'
import { cn } from '@/utils/tailwind'
import React from 'react'

type Props = {
  mainImage: () => React.ReactNode
  subImageOne: () => React.ReactNode
  subImageTwo: () => React.ReactNode
  subImageThree: () => React.ReactNode
  srcs: string[]
  className?: string
}

const BarbershopGallery = (props: Props) => {
  const {
    className,
    mainImage,
    subImageOne,
    subImageTwo,
    subImageThree,
    srcs,
  } = props

 


  return (
    <GalleryButton
      srcs={srcs}
      cutName={''}
      className="px-0 pb-2 text-base font-normal text-blue-400 bg-transparent cursor-pointer hover:un justify-self-start text-start hover:bg-transparent"
      text="View Gallery"
      type="button"
    />
  )
}

export default BarbershopGallery
