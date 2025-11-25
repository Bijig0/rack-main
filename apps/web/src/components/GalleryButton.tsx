'use client'
import HaircutGallery from '@/app/(dashboard)/dashboard/HaircutGallery'
import { Button } from '@/components/ui/button'
import { ComponentPropsWithoutRef, useState } from 'react'
import { text } from 'stream/consumers'

type Props = {
  srcs: string[]
  cutName: string
  text: string
  variant?: string
} & ComponentPropsWithoutRef<'button'>

const GalleryButton = (props: Props) => {
  const { srcs, cutName, text, variant, ...rest } = props
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const openGallery = (urls: URL[]) => {
    setIsGalleryOpen(true)
  }
  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  return (
    <>
      <Button onClick={() => openGallery([])} variant={variant ?? 'default'} {...rest}>
        {text}
      </Button>
      <HaircutGallery
        closeModal={closeGallery}
        isOpen={isGalleryOpen}
        urls={srcs}
        cutName={cutName}
      />
    </>
  )
}

export default GalleryButton
