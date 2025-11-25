'use client'
import { BaseInput } from '@/components/ui/base-input'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { redirect } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import resetPassword from './reset-password'
import Urls from '@/app/urls/urls'

type FormValues = {
  password: string
  confirmPassword: string
}

const page = () => {
  const form = useForm<FormValues>()
  const [isSubmitting, startIsSubmittingTransition] = useTransition()
  const { toast } = useToast()
  const handleSubmit = async (values: FormValues) => {
    startIsSubmittingTransition(async () => {
      try {
        await resetPassword(values.password)
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your password has been reset',
        })
        redirect(Urls.home)
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
    <div className="prose mx-auto mt-8">
      <h1>Password Reset</h1>
      <p>Please enter and confirm your new password</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <BaseInput
                      {...field}
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </div>
                  {form.formState.errors.password && (
                    <FormMessage className="text-red-400">
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: 'Confirm password is required',
                validate: (val: string) => {
                  if (form.watch('password') != val) {
                    return 'Your passwords do not match'
                  }
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">New Password</Label>
                    <BaseInput
                      {...field}
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <FormMessage className="text-red-400">
                      {form.formState.errors.confirmPassword?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" variant="default">
              {isSubmitting ? (
                <LoadingSpinner className="mx-auto h-4 w-4" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default page
