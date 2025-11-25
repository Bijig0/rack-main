'use client'
import { SignUpConfirmation } from '@/app/(main-site)/signup/SignUpForm'
import emailSignup from '@/app/(main-site)/signup/email-signup'
import { getSiteUrl } from '@/app/globals'
import ErrorText from '@/components/error-text'
import { BaseInput } from '@/components/ui/base-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  email: string
  password: string
}

const ForBusinessSignUpForm = () => {
  const form = useForm<FormValues>()

  const { errors } = form.formState

  const [isPending, startTransition] = useTransition()
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [authError, setAuthError] = useState<string>('')

  const onSubmit = async (values: FormValues) => {
    console.log({ values })
    startTransition(async () => {
      try {
        const redirectUrl = `${getSiteUrl()}/barbershop-start`

        await emailSignup({ ...values, userType: 'barbershop', redirectUrl })
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
    <Card className="w-full rounded-2xl border-none pb-8 shadow-2xl lg:flex-[2_2_0%] lg:px-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Create your profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SignUpConfirmation
            userType={'barbershop'}
            show={signupSuccess}
            email={form.watch('email')}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <BaseInput
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="px-4 py-6 bg-gray-100 border-none rounded-lg placeholder:font-roobert placeholder:font-semibold"
                        {...field}
                      />
                    </FormControl>
                    {errors.email && (
                      <FormMessage className="text-red-400">
                        Email is required
                      </FormMessage>
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
                    <FormControl>
                      <BaseInput
                        className="px-4 py-6 bg-gray-100 border-none rounded-lg placeholder:font-roobert placeholder:font-semibold"
                        placeholder="Password"
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    {errors.password && (
                      <FormMessage className="text-red-400">
                        Password is required
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {authError && <ErrorText>{authError}</ErrorText>}
              <button
                type="submit"
                className="flex justify-center w-full p-4 font-bold text-white bg-purple-500 rounded-full shadow-xl text-md hover:bg-purple-500 hover:opacity-80"
              >
                {isPending ? (
                  <LoadingSpinner className="w-4 h-4 mx-auto" />
                ) : (
                  'Sign up'
                )}
              </button>
              <div className="mt-4 text-sm text-center">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default ForBusinessSignUpForm
