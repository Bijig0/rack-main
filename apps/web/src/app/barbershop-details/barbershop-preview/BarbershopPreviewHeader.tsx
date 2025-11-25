import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const BarbershopPreviewHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Edit Details</DialogTitle>
      <DialogDescription className="w-3/5">
        Edit and/or view your barbershop preview details
      </DialogDescription>
    </DialogHeader>
  )
}

export default BarbershopPreviewHeader
