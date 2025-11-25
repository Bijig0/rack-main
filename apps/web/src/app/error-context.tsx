'use client'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'
import { createContext, useContext } from 'react'

type TContext = {
  handleGenericError: (error: Error) => void
}

const Context = createContext({} as TContext)

type Props = {
  children: React.ReactNode
}

const ErrorProvider = (props: Props) => {
  const { children } = props

  const { toast } = useToast()

  const handleGenericError = (error: Error) => {
    toast({
      variant: 'destructive',
      title: 'Uh oh, something went wrong',
      description: error.message,
    })
    Sentry.captureException(error)
  }

  return (
    <Context.Provider value={{ handleGenericError }}>
      {children}
    </Context.Provider>
  )
}

export const useErrorContext = () => useContext(Context)

export default ErrorProvider
