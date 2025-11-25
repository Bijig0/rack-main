import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const AboutEditModeDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Edit About</DialogTitle>
      <DialogDescription className="w-3/5">
        Edit and/or view your about bio!
      </DialogDescription>
    </DialogHeader>
  )
}

export default AboutEditModeDialogHeader
