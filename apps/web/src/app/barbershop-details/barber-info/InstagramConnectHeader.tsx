import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MdArrowBack } from 'react-icons/md'
import { useWizard } from 'react-use-wizard'

const InstagramConnectHeader = () => {
  const { previousStep } = useWizard()
  return (
    <DialogHeader className="space-y-3">
      <MdArrowBack
        onClick={previousStep}
        className="cursor-pointer"
        size={18}
      />
      <div className="space-y-1">
        <DialogTitle>Connect your instagram account</DialogTitle>
        <DialogDescription>
          Please login with your IG <strong>username (not email)</strong> and
          password
        </DialogDescription>
        <DialogDescription className="text-red-400">
          Currently does not work with 2FA enabled accounts
        </DialogDescription>
      </div>
    </DialogHeader>
  )
}

export default InstagramConnectHeader
