import { Dialog } from '@/components/ui/dialog'

type Props = {
  closeModal: () => void
  isOpen: boolean
  children: React.ReactNode
}

const EditModeDialog = (props: Props) => {
  const { isOpen, closeModal, children } = props

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {children}
    </Dialog>
  )
}

export default EditModeDialog
