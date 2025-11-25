'use client'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useState } from 'react'

type Props = {
  onDeleteAddOn: () => void
  isDeletingAddOn: boolean
}

const DeleteAddOnButton = (props: Props) => {
  const { onDeleteAddOn, isDeletingAddOn } = props
  const [confirmDelete, setConfirmDelete] = useState(false)
  const handleDeleteAddOn = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDeleteAddOn()
    setConfirmDelete(false)
  }
  return (
    <Button
      type="button"
      onClick={handleDeleteAddOn}
      variant={confirmDelete ? 'default' : 'destructive'}
    >
      {isDeletingAddOn ? (
        <LoadingSpinner className="w-4 h-4 mx-auto" />
      ) : confirmDelete ? (
        'Confirm Delete'
      ) : (
        'Delete Add-On'
      )}
    </Button>
  )
}

export default DeleteAddOnButton
