'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Urls from './urls/urls'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}
const Error = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="mx-auto mt-8 prose">
      <h1>Something went wrong</h1>
      <button className="text-blue-400 underline" onClick={reset}>
        Please try refreshing the page
      </button>
      <p>or</p>
      <a href={Urls.home} className="text-blue-400 underline">
        Back to Homepage
      </a>
    </div>
  )
}

export default Error
