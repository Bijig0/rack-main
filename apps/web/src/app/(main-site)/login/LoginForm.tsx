'use client'
import { useErrorContext } from '@/app/error-context'
import Urls from '@/app/urls/urls'
import ErrorText from '@/components/error-text'
import { BaseInput } from '@/components/ui/base-input'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { queryClient, userKeys } from '@/providers/ReactQueryProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../(dashboard)/dashboard/SidebarButton'
import emailLogin from './email-login'

type LoginFormValues = {
  email: string
  password: string
}

type Props = {}

const LoginForm = (props: Props) => {
  const form = useForm<LoginFormValues>()
  const {
    formState: { errors },
  } = form
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const { handleGenericError } = useErrorContext()

  const onSubmit = (values: LoginFormValues) => {
    console.log('Test')
    startTransition(async () => {
      try {
        const error = await emailLogin(values.email, values.password)
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error,
          })
          return
        }
        queryClient.invalidateQueries({ queryKey: userKeys.all })
        router.push(Urls.dashboard)
      } catch (error) {
        if (error instanceof Error) {
          handleGenericError(error)
        }
      }
    })
  }

  console.log({ isPending })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid w-[350px] gap-6"
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <FormItem>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <BaseInput
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
                  {errors.email && <ErrorText>Email is required</ErrorText>}
                </div>
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="inline-block ml-auto text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <BaseInput {...field} id="password" type="password" />
                  {errors.password && (
                    <ErrorText>Password is required</ErrorText>
                  )}
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isPending ? (
              <LoadingSpinner className="w-4 h-4 mx-auto" />
            ) : (
              'Login'
            )}
          </Button>
          {/* <Button type="button" variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </div>
        <div className="mt-4 text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
