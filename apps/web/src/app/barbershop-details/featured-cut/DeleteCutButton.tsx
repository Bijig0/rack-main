'use client'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useState } from 'react'

type Props = {
  onDeleteCut: () => void
  isDeletingCut: boolean
}

const DeleteCutButton = (props: Props) => {
  const { onDeleteCut, isDeletingCut } = props
  const [confirmDelete, setConfirmDelete] = useState(false)
  const handleDeleteCut = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDeleteCut()
    setConfirmDelete(false)
  }
  return (
    <Button
      type="button"
      onClick={handleDeleteCut}
      variant={confirmDelete ? 'default' : 'destructive'}
    >
      {isDeletingCut ? (
        <LoadingSpinner className="w-4 h-4 mx-auto" />
      ) : confirmDelete ? (
        'Confirm Delete'
      ) : (
        'Delete Cut'
      )}
    </Button>
  )
}

export default DeleteCutButton
