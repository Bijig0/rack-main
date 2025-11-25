'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = ({ error, reset }: ErrorProps) => {
  
  useEffect(() => {
    Sentry.captureException(error)
    process.env.NODE_ENV === 'development' && console.log(error)
  }, [error])

  return (
    <div className="mx-auto mt-8 prose">
      <h1>Error</h1>
      <p>Something went wrong</p>
      <button className="text-blue-400 underline" onClick={reset}>
        Retry
      </button>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 text-sm">{error.message}</pre>
      )}
    </div>
  )
}

export default Error
