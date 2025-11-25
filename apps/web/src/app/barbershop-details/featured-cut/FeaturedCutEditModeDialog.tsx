'use client'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { Wizard } from 'react-use-wizard'
import CutInfo from './CutInfo'
import CutInfoHeader from './CutInfoHeader'
import CutsList from './CutsList'
import CutsListFooter from './CutsListFooter'
import CutsListHeader from './CutsListHeader'

type Props = {
  isEditModeDialogOpen: boolean
  closeEditModeDialog: () => void
}

const FeaturedCutEditModeDialog = (props: Props) => {
  const { isEditModeDialogOpen, closeEditModeDialog } = props
  const [selectedCutId, setSelectedCutId] = useState<number | undefined>(undefined)

  return (
    <Dialog open={isEditModeDialogOpen} onOpenChange={closeEditModeDialog}>
      <DialogContent className="space-y-4 sm:max-w-[750px]" hideCloseButton>
        <Wizard>
          <div className="contents">
            <CutsListHeader setSelectedCutId={setSelectedCutId} />
            <CutsList setSelectedCutId={setSelectedCutId} />
            <CutsListFooter />
          </div>
          <div className="space-y-6">
            <CutInfoHeader selectedCutId={selectedCutId} />
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

export default FeaturedCutEditModeDialog
