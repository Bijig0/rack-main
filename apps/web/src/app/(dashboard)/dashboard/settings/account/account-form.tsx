'use client'
import { BaseInput } from '@/components/ui/base-input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import useGetUserDetails from '@/hooks/useGetUserDetails'
import { queryClient, userKeys } from '@/providers/ReactQueryProvider'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import PasswordField from './PasswordField'
import signOut from './signOut'
import updateProfile from './updateProfile'

export type ProfileFormValues = {
  firstName: string
  lastName: string
  email: string
}

export default function AccountForm() {
  const { data, error } = useGetUserDetails()
  if (!data) throw new Error('No user details found')
  const form = useForm<ProfileFormValues>({
    values: {
      firstName: data.first_name!,
      lastName: data.last_name!,
      email: data.email!,
    },
  })
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, startIsSubmittingTransition] = useTransition()
  const [isDiscardingChanges, setIsDiscardingChanges] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { handleSubmit } = form

  function onSubmit(data: ProfileFormValues) {
    console.log({ data })
    startIsSubmittingTransition(async () => {
      const error = await updateProfile(data)

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh, something went wrong',
          description: error.message,
        })
      } else {
        toast({
          variant: 'success',
          title: 'Profile updated',
          description: 'Your profile has been updated',
        })
      }
    })
  }

  const onDiscardChanges = () => {
    setIsDiscardingChanges(true)
    location.reload()
  }

  const onLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    queryClient.invalidateQueries({ queryKey: userKeys.all })

    setIsLoggingOut(false)
    router.push('/')
    toast({
      variant: 'destructive',
      title: 'Logged out',
      description: 'You have been logged out',
    })
  }

  if (!data) return null
  if (error) {
    toast({
      variant: 'destructive',
      title: 'Uh oh, something went wrong',
      description: error.message,
    })
    return (
      <p className="p-4">
        Uh oh, something went wrong, please try reloading the page
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">First Name</FormLabel>
              </div>
              <FormControl>
                <BaseInput {...field} placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">Last Name</FormLabel>
              </div>
              <FormControl>
                <BaseInput {...field} placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel className="block">Email</FormLabel>
              </div>
              <FormControl>
                <BaseInput
                  {...field}
                  disabled
                  placeholder="m@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordField email={data.email} />

        <div className="flex items-center justify-start gap-2">
          <Button
            variant="save-changes"
            className="hover:black bg-black hover:opacity-80"
            type="submit"
          >
            {isSubmitting ? (
              <LoadingSpinner className="mx-auto h-4 w-4" />
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            variant={'default'}
            className="bg-gray-200 text-black hover:bg-gray-200 hover:opacity-80"
            type="button"
            onClick={onDiscardChanges}
          >
            {isDiscardingChanges ? (
              <LoadingSpinner className="mx-auto h-4 w-4" />
            ) : (
              'Discard Changes'
            )}
          </Button>
        </div>
        <Button
          variant={'default'}
          className="bg-red-500 text-white opacity-100 hover:bg-red-500 hover:opacity-80"
          type="button"
          onClick={onLogout}
        >
          {isLoggingOut ? (
            <LoadingSpinner className="mx-auto h-4 w-4" />
          ) : (
            'Log Out'
          )}
        </Button>
      </form>
    </Form>
  )
}
