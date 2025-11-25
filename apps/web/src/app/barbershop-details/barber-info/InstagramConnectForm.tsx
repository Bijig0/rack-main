'use client'
import { useDashboardContext } from '@/app/(dashboard)/dashboard/barbershop-dashboard-context'
import ErrorText from '@/components/error-text'
import { BaseInput } from '@/components/ui/base-input'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { barbershopsKeys, queryClient } from '@/providers/ReactQueryProvider'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../(dashboard)/dashboard/SidebarButton'
import getInstagramFollowers from './get-instagram-followers'
import updateInstagramInfo from './updateInstagramInfo'

const SignUpFormSchema = z.object({
  username: z.string(),
  password: z.string().min(0),
})

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>

type Props = {
  onSubmit?: () => void
}

const InstagramConnectForm = (props: Props) => {
  const form = useForm<SignUpFormValues>()

  const {
    barbershopDetails: { id: barbershopDetailsId },
  } = useDashboardContext()

  const [authError, setAuthError] = useState<string>('')

  const [isPending, startTransition] = useTransition()

  const {
    formState: { errors },
  } = form

  const { toast } = useToast()

  const onSubmit = async (values: SignUpFormValues) => {
    console.log({ values })
    startTransition(async () => {
      try {
        const { data: followers, error } = await getInstagramFollowers({
          username: values.username,
          password: values.password,
        })

        if (error) throw error

        await updateInstagramInfo({
          barbershopId: barbershopDetailsId,
          followerCount: followers!,
          handle: values.username,
          password: values.password,
        })

        queryClient.invalidateQueries({ queryKey: barbershopsKeys.admin() })

        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Your Instagram account has been connected',
        })
        props.onSubmit?.()
      } catch (error) {
        // Make this a tagged error next time but this means that it was an auth error
        // From abovw
        console.log({ error })
        if (typeof error === 'string') {
          console.log('Running')
          setAuthError(
            'Sorry, your username or password was incorrect. Please double check and try again',
          )
          return
        }
      }
    })
  }
  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              rules={{ required: 'Username is required' }}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <BaseInput
                      id="username"
                      type="text"
                      placeholder="taperau"
                      required
                      {...field}
                    />
                  </div>
                  {errors.username && (
                    <ErrorText>Username is required</ErrorText>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <BaseInput
                      id="password"
                      type="password"
                      required
                      {...field}
                    />
                  </div>
                  {errors.password && (
                    <ErrorText>Password is required</ErrorText>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit">
              {isPending ? (
                <LoadingSpinner className="w-4 h-4 mx-auto" />
              ) : (
                'Connect'
              )}
            </Button>
            {authError && <ErrorText>{authError}</ErrorText>}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default InstagramConnectForm
