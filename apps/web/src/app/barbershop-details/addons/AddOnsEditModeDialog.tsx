import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { Wizard } from 'react-use-wizard'
import AddOnInfoHeader from './AddOnInfoHeader'
import AddOnsList from './AddOnsList'
import AddOnsListHeader from './AddOnsListHeader'
import AddOnInfo from './AddOnInfo'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const AddOnsEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  const [selectedAddOnId, setSelectedAddOnId] = useState<number | undefined>(
    undefined,
  )
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-[750px]" hideCloseButton>
        <Wizard>
          <div className="contents">
            <AddOnsListHeader setSelectedAddOnId={setSelectedAddOnId} />
            <AddOnsList setSelectedAddOnId={setSelectedAddOnId} />
            {/* <AddOnsListFooter /> */}
          </div>
          <div>
            <AddOnInfoHeader selectedAddOnId={selectedAddOnId} />
            <div className="my-4" />
            <AddOnInfo
              setSelectedAddOnId={setSelectedAddOnId}
              selectedAddOnId={selectedAddOnId}
              closeModal={closeEditModeDialog}
            />
          </div>
        </Wizard>
      </DialogContent>
    </Dialog>
  )
}

export default AddOnsEditModeDialog
