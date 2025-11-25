'use client'

import Urls from '@/app/urls/urls'
import { LoadingSpinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { z } from 'zod'
import useSynchronizeChangedEmail from './useSynchronizeChangedEmail'

const paramsSchema = z.object({
  searchParams: z.object({
    old_email: z.string(),
  }),
})

const page = (params: unknown) => {
  console.log(params)
  const {
    searchParams: { old_email },
  } = paramsSchema.parse(params)

  const oldEmail = decodeURIComponent(old_email)

  const { data, error, isLoading } = useSynchronizeChangedEmail({
    oldEmail,
  })

  if (data) {
    return (
      <div>
        <h1>Success</h1>
        <h2>Your email has been successfully changed</h2>
        <Link href={Urls.home} className="text-blue-400 underline">
          Return to homepage
        </Link>
      </div>
    )
  }

  if (isLoading)
    return (
      <div>
        <h1>Please do not leave the page, your email is being updated</h1>
        <LoadingSpinner className="w-16 h-16 mx-auto" />
      </div>
    )

  if (error) {
    console.log({ error })
    if (error instanceof Error && error.message === 'Auth session missing!') {
      return (
        <div>
          <h1>
            You must be logged in to change your email. You might be in
            incognito mode/a different browser, ensure you stay in the same
            window
          </h1>
        </div>
      )
    } else {
      throw error
    }
  }
}

export default page
