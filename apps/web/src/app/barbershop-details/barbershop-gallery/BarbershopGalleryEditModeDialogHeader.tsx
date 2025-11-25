import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const BarbershopGalleryEditModeDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Edit Gallery</DialogTitle>
      <DialogDescription className="w-3/5">
        Edit and/or view your barbershop images and/or videos!
      </DialogDescription>
    </DialogHeader>
  )
}

export default BarbershopGalleryEditModeDialogHeader
