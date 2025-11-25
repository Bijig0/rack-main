import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Wizard, useWizard } from 'react-use-wizard'
import InstagramConnectForm from '../barber-info/InstagramConnectForm'
import InstagramConnectHeader from '../barber-info/InstagramConnectHeader'
import BarbershopPreviewBody from './BarbershopPreviewBody'
import BarbershopPreviewHeader from './BarbershopPreviewHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const BarbershopPreviewInstagramConnectForm = () => {
  const { previousStep } = useWizard()
  return <InstagramConnectForm onSubmit={previousStep} />
}

const BarbershopPreviewEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-[425px]" hideCloseButton>
        <Wizard>
          <div>
            <BarbershopPreviewHeader />
            <BarbershopPreviewBody onCancel={closeEditModeDialog} />
          </div>
          <div>
            <InstagramConnectHeader />
            <BarbershopPreviewInstagramConnectForm />
          </div>
        </Wizard>
      </DialogContent>
    </Dialog>
  )
}

export default BarbershopPreviewEditModeDialog
