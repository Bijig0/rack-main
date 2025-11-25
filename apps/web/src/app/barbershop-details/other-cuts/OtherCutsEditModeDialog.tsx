import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { Wizard } from 'react-use-wizard'
import CutInfo from '../featured-cut/CutInfo'
import CutInfoHeader from '../featured-cut/CutInfoHeader'
import CutsList from './CutsList'
import CutsListFooter from './CutsListFooter'
import CutsListHeader from './CutsListHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const OtherCutsEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  const [selectedCutId, setSelectedCutId] = useState<number | undefined>(
    undefined,
  )
  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-[750px]" hideCloseButton>
        <Wizard>
          <div className="contents">
            <CutsListHeader setSelectedCutId={setSelectedCutId} />
            <CutsList setSelectedCutId={setSelectedCutId} />
            <CutsListFooter />
          </div>
          <div>
            <CutInfoHeader selectedCutId={selectedCutId} />
            <div className="my-4" />
            <CutInfo
              setSelectedCutId={setSelectedCutId}
              selectedCutId={selectedCutId}
              closeModal={closeEditModeDialog}
            />
          </div>
        </Wizard>
      </DialogContent>
    </Dialog>
  )
}

export default OtherCutsEditModeDialog
