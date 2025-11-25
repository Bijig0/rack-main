'use client'
import { createContext, useContext, useState } from 'react'
import { getBarbershopDetails } from './useGetBarbershopDetails'
import { BarbershopGalleryPresent } from '@/utils/assertGallery'

const Context = createContext({} as TContext)

const modes = ['edit', 'read'] as const

export type Mode = (typeof modes)[number]

export type BarbershopDetails = BarbershopGalleryPresent


const RNN_ORIG = Symbol()

type TContext = {
  barbershopDetails: BarbershopDetails
  mode: Mode
  toggleMode: () => void
  isEditMode: boolean
}

type Props = {
  barbershopDetails: BarbershopDetails
  children: React.ReactNode
}

const DashboardProvider = (props: Props) => {
  const { children, barbershopDetails } = props
  const [mode, setMode] = useState<Mode>('read')
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'edit' ? 'read' : 'edit'))
  }

  const isEditMode = mode === 'edit'

  return (
    <Context.Provider
      value={{
        barbershopDetails,
        mode,
        toggleMode,
        isEditMode,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useDashboardContext = () => useContext(Context)

export default DashboardProvider
