'use client'
import HaircutGallery from '@/app/(dashboard)/dashboard/HaircutGallery'
import { useState } from 'react'

type Props = {
  srcs: string[]
  cutName: string
}

const GalleryButton = (props: Props) => {
  const { srcs, cutName } = props
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const openGallery = (urls: URL[]) => {
    setIsGalleryOpen(true)
  }
  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  return (
    <>
      <button
        onClick={() => openGallery([])}
        className="cursor-pointer text-sm  text-blue-400"
      >
        Gallery
      </button>
      <HaircutGallery
        cutName={cutName}
        closeModal={closeGallery}
        isOpen={isGalleryOpen}
        urls={srcs}
      />
    </>
  )
}

export default GalleryButton
