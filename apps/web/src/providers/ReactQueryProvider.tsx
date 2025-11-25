'use client'

export const barbershopsKeys = {
  all: ['barbershops'] as const,
  lists: () => [...barbershopsKeys.all, 'list'] as const,
  list: (filters: string) => [...barbershopsKeys.lists(), { filters }] as const,
  details: () => [...barbershopsKeys.all, 'detail'] as const,
  detailId: (id: number) => [...barbershopsKeys.details(), id] as const,
  detailName: (name: string) => [...barbershopsKeys.details(), name] as const, 
  admin: () => [...barbershopsKeys.details(), 'admin'] as const,
}

export const userKeys = {
  all: ['user'] as const,
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default ReactQueryProvider
