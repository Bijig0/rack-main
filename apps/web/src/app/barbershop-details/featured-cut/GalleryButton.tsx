'use client'
import HaircutGallery from '@/app/(dashboard)/dashboard/HaircutGallery'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Props = {
  srcs: string[]
  cutName: string
  disabled?: boolean
}

const GalleryButton = (props: Props) => {
  const { srcs, cutName, disabled } = props
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const openGallery = (urls: URL[]) => {
    setIsGalleryOpen(true)
  }
  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  return (
    <>
      <Button
        disabled={disabled}
        // className="text-black underline bg-transparent"
        onClick={() => openGallery([])}
      >
        View Gallery
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
