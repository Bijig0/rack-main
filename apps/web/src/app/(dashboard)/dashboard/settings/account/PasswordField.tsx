'use client'

import { BaseInput } from '@/components/ui/base-input'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { useTransition } from 'react'
import sendPasswordResetEmail from './send-password-reset-email'

type Props = {
  email: string
}

const PasswordField = (props: Props) => {
  const { email } = props
  const [isSendingPasswordResetEmail, startIsSendingPasswordResetEmail] =
    useTransition()

  const { toast } = useToast()

  const handleSendPasswordResetEmail = () => {
    startIsSendingPasswordResetEmail(async () => {
      try {
        await sendPasswordResetEmail(email)
        toast({
          variant: 'success',
          title: 'Password reset email sent',
          description: 'Check your email for the reset link',
        })
      } catch (error) {
        if (error instanceof Error) {
          toast({
            variant: 'destructive',
            title: 'Uh oh, something went wrong',
            description: error.message,
          })
        }
      }
    })
  }
  return (
    <FormItem>
      <div className="flex items-center gap-2">
        <FormLabel className="block">Password</FormLabel>
        <button
          type="button"
          onClick={handleSendPasswordResetEmail}
          className="text-sm text-blue-400 underline"
        >
          {isSendingPasswordResetEmail ? (
            <LoadingSpinner className="mx-auto h-4 w-4" />
          ) : (
            'Reset Password'
          )}
        </button>
      </div>
      <FormControl>
        <BaseInput type="password" disabled placeholder="********" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default PasswordField
