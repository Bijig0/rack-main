'use client'
import { getSiteUrl } from '@/app/globals'
import ErrorText from '@/components/error-text'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseInput } from '@/components/ui/base-input'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { FaRocket } from 'react-icons/fa6'
import { z } from 'zod'
import { Button } from '../../(dashboard)/dashboard/SidebarButton'
import emailSignup from './email-signup'
import resendEmail from './resend-email'

type Props = {}

export const SignUpConfirmation = ({
  email,
  show,
  userType,
}: {
  email: string
  show: boolean
  userType: 'individual' | 'barbershop'
}) => {
  if (!show) return null

  const [resentEmail, setResentEmail] = useState(false)
  const [error, setError] = useState<string>('')

  const onResend = async () => {
    try {
      await resendEmail(email, userType)
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
      <AlertTitle>Email Confirmation</AlertTitle>
      <AlertDescription>
        Please click the link sent to {email} to confirm your email.
        <br />
        <Separator className="my-2" />
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

const SignUpFormSchema = z.object({
  // firstName: z.string().min(2),
  // lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  userType: z.enum(['individual', 'barbershop']),
})

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>

const SignUpForm = (props: Props) => {
  const form = useForm<SignUpFormValues>({
    defaultValues: {
      userType: 'individual',
    },
  })

  const [authError, setAuthError] = useState<string>('')

  const [isPending, startTransition] = useTransition()
  const [signupSuccess, setSignupSuccess] = useState(false)

  const {
    formState: { errors },
  } = form

  const onSubmit = async (values: SignUpFormValues) => {
    console.log({ values })
    startTransition(async () => {
      try {
        const redirectUrl = `${getSiteUrl()}/barbershop-start`
        await emailSignup({ ...values, redirectUrl })
        setSignupSuccess(true)
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto grid w-[350px] gap-6"
      >
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-fglooreground">
            Enter your email and password below to create your account
          </p>
        </div>
        <SignUpConfirmation
          userType={form.watch('userType')}
          show={signupSuccess}
          email={form.watch('email')}
        />
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
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    {...field}
                  />
                </div>
                {errors.email && <ErrorText>Email is required</ErrorText>}
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
                {errors.password && <ErrorText>Password is required</ErrorText>}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <RadioGroup defaultValue="individual">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      {...field}
                      onClick={() => field.onChange('individual')}
                      value="individual"
                      id="r1"
                    />
                    <Label htmlFor="r1">I am looking for a barber</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      {...field}
                      onClick={() => field.onChange('barbershop')}
                      value="barbershop"
                      id="r2"
                    />
                    <Label htmlFor="r2">I am a barber brand/barbershop</Label>
                  </div>
                </RadioGroup>
                {errors.userType && (
                  <ErrorText>Please select a user type</ErrorText>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isPending ? (
              <LoadingSpinner className="mx-auto h-4 w-4" />
            ) : (
              'Sign Up'
            )}
          </Button>
          {authError && <ErrorText>{authError}</ErrorText>}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm
