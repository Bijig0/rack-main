import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Wizard, useWizard } from 'react-use-wizard'
import BarbershopInfoEditModeDialogBody from './BarbershopInfoEditModeDialogBody'
import BarbershopInfoEditModeDialogHeader from './BarbershopInfoEditModeDialogHeader'
import InstagramConnectForm from './InstagramConnectForm'
import InstagramConnectHeader from './InstagramConnectHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const BarbershopInfoInstagramConnectForm = () => {
  const { previousStep } = useWizard()
  return <InstagramConnectForm onSubmit={previousStep} />
}

const BarbershopInfoEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-[425px]" hideCloseButton>
        <Wizard>
          <div>
            <BarbershopInfoEditModeDialogHeader />
            <BarbershopInfoEditModeDialogBody
              closeEditModeDialog={closeEditModeDialog}
            />
          </div>
          <div>
            <InstagramConnectHeader />
            <BarbershopInfoInstagramConnectForm />
          </div>
        </Wizard>
      </DialogContent>
    </Dialog>
  )
}

export default BarbershopInfoEditModeDialog
