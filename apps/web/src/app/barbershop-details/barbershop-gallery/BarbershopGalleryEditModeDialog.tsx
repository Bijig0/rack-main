import { Dialog, DialogContent } from '@/components/ui/dialog'
import BarbershopGalleryEditModeDialogBody from './BarbershopGalleryEditModeDialogBody'
import BarbershopGalleryEditModeDialogHeader from './BarbershopGalleryEditModeDialogHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const BarbershopGalleryEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-5xl" hideCloseButton>
        <BarbershopGalleryEditModeDialogHeader />
        <BarbershopGalleryEditModeDialogBody closeModal={closeEditModeDialog} />
      </DialogContent>
    </Dialog>
  )
}

export default BarbershopGalleryEditModeDialog
