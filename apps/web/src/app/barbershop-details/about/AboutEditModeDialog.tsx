import { Dialog, DialogContent } from '@/components/ui/dialog'
import AboutEditModeDialogBody from './AboutEditModeDialogBody'
import AboutEditModeDialogHeader from './AboutEditModeDialogHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const BarbershopAboutEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <AboutEditModeDialogHeader />
        <AboutEditModeDialogBody closeModal={closeEditModeDialog} />
      </DialogContent>
    </Dialog>
  )
}

export default BarbershopAboutEditModeDialog
