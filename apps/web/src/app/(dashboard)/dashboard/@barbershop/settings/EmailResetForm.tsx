'use client'
import resendEmail from '@/app/(main-site)/signup/resend-email'
import { getSiteUrl } from '@/app/globals'
import Urls from '@/app/urls/urls'
import ErrorText from '@/components/error-text'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseInput } from '@/components/ui/base-input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FaRocket } from 'react-icons/fa6'
import { z } from 'zod'
import resetEmail from '../reset-email'

type Props = {}

export const ResetEmailConfirmation = ({
  email,
  show,
}: {
  email: string
  show: boolean
}) => {
  if (!show) return null

  const [resentEmail, setResentEmail] = useState(false)
  const [error, setError] = useState<string>('')

  const onResend = async () => {
    try {
      const redirectUrl = `${getSiteUrl()}${Urls['reset-email-redirect']}`

      await resetEmail({ email, redirectUrl })
      setResentEmail(true)
      console.log({ resendEmail })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        throw error
      }
    }
  }

  return (
    <Alert className="bg-purple-200">
      <FaRocket className="h-4 w-4" />
      <AlertTitle>Email reset sent successfully</AlertTitle>
      <AlertDescription>
        Didn't get the link?{' '}
        <button
          type="button"
          onClick={onResend}
          className="text-sm text-blue-400 hover:underline"
        >
          Resend
        </button>
        {(resentEmail || error) && <Separator className="my-2" />}
        {resentEmail && <p>Email has been successfully resent</p>}
        {error && <ErrorText>{error}</ErrorText>}
      </AlertDescription>
    </Alert>
  )
}

const EmailResetFormSchema = z.object({
  email: z.string().email(),
})

export type EmailResetFormValues = z.infer<typeof EmailResetFormSchema>

const EmailResetForm = (props: Props) => {
  const form = useForm<EmailResetFormValues>()

  const [authError, setAuthError] = useState<string>('')

  const [isPending, startTransition] = useTransition()
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const {
    formState: { errors },
  } = form

  const onSubmit = async (values: EmailResetFormValues) => {
    console.log({ values })
    startTransition(async () => {
      try {
        const redirectUrl = `${getSiteUrl()}${Urls['reset-email-redirect']}`

        await resetEmail({ email: values.email, redirectUrl })
        setResetEmailSent(true)
      } catch (error) {
        if (error instanceof Error) {
          setAuthError(error.message)
          return
        }
      }
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/5">
        <ResetEmailConfirmation
          show={resetEmailSent}
          email={form.watch('email')}
        />
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-end">
          <FormField
            control={form.control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormItem className="w-3/4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <BaseInput
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...field}
                  />
                </div>
                {errors.email && (
                  <FormMessage className="text-red-400">
                    Email is required
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="md:w-1/4">
            {isPending ? (
              <LoadingSpinner className="mx-auto h-4 w-4" />
            ) : (
              'Email Reset'
            )}
          </Button>
          {authError && <ErrorText>{authError}</ErrorText>}
        </div>
      </form>
    </Form>
  )
}

export default EmailResetForm
