import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const BarbershopInfoEditModeDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Edit Contact Info</DialogTitle>
      <DialogDescription className="w-3/5">
        Edit and/or view your contact info!
      </DialogDescription>
    </DialogHeader>
  )
}

export default BarbershopInfoEditModeDialogHeader
